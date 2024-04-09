<?php

namespace App\Http\Services\Api\Backend;

use App\Http\Services\Api\PaginationService;
use App\Models\Content\OrderItem;

/**
 * ApiWalletService
 */
class ApiWalletService
{
    public function list()
    {
        $search_val   = request('search');
        $status   = request('status', []);
        $query = OrderItem::with('user', 'order', 'product', 'itemVariations', 'trackingExceptional')
            ->whereNotIn('status', ['waiting-for-payment'])
            ->orderByDesc('id');
        $searchable = ['item_number', 'Title', 'order_id', 'shipping_type', 'shipping_from', 'ItemId', 'ProviderType', 'status', 'source_order_number', 'tracking_number',  'invoice_no'];
        if ($search_val && count($searchable) > 0) {
            $query->where(function ($query) use ($searchable, $search_val) {
                foreach ($searchable as $col) {
                    $query->orWhere($col, 'LIKE', "%$search_val%");
                }
            })->orWhereHas('order', function ($query) use ($search_val) {
                $query->where('transaction_id', 'like', '%' . $search_val . '%')
                    ->orWhere('phone', 'like', '%' . $search_val . '%')
                    ->orWhere('name', 'like', '%' . $search_val . '%');
            });
        }

        if (count($status) > 0) {
            $query->whereIn('status', $status);
        }

        $column = [];
        $data  = (new PaginationService())->getPaginatedData($query, $column);
        $paginatedQuery = $data['data'];
        $finalQuery     = $paginatedQuery->get();
        $data['data']   = $finalQuery;
        return $data;
    }


    public function updateWalletCalculation($id)
    {
        $wallet = OrderItem::find($id);
        if ($wallet) {
            $product_price = ($wallet->product_value + $wallet->DeliveryCost - $wallet->coupon_contribution);
            $refunded = $wallet->refunded;
            $adjustment = $wallet->adjustment;
            $customer_tax = $wallet->customer_tax;
            $courier_bill = $wallet->courier_bill;

            $shipping_type = $wallet->shipping_type;
            $weight_change = 0;
            if ($shipping_type != 'regular') {
                $shipping_rate = $wallet->shipping_rate;
                $actual_weight = (float) $wallet->actual_weight;
                $weight_change = ($shipping_rate * $actual_weight);
            }

            $first_payment = $wallet->first_payment;
            $out_of_stock = $wallet->out_of_stock;
            $missing = $wallet->missing;
            $lost_in_transit = $wallet->lost_in_transit;
            $last_payment = $wallet->last_payment;

            $positive = ($product_price + $refunded + $adjustment + $customer_tax + $weight_change + $courier_bill);
            $negative = ($first_payment + $out_of_stock + $missing + $lost_in_transit + $last_payment);
            $wallet->due_payment = ($positive - $negative);
            $wallet->save();
        }
        return $wallet;
    }
}
