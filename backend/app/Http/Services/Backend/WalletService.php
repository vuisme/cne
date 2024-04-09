<?php

namespace App\Http\Services\Backend;

use App\Models\Backend\OrderTracking;
use App\Models\Content\OrderItem;
use Carbon\Carbon;
use Illuminate\Http\Request;

/**
 * WalletService
 */
class WalletService
{

    public function all()
    {
        return OrderItem::whereNotNull('active')->pluck('value', 'key')->toArray();
    }

    public function updatedParameters(Request $request, $id)
    {
        $wallet = OrderItem::find($id);
        $data = [];
        if ($wallet) {
            $data = $wallet->toArray();
            $product_value = $wallet->product_value ? $wallet->product_value : 0;
            $DeliveryCost = $wallet->DeliveryCost ? $wallet->DeliveryCost : 0;
            $coupon = $wallet->coupon_contribution ? $wallet->coupon_contribution : 0;
            $data['net_product_value'] = ($product_value + $DeliveryCost - $coupon);

            $weight = $wallet->actual_weight ? $wallet->actual_weight : 0;
            $Quantity = $wallet->Quantity ? $wallet->Quantity : 0;
            $totalWeight = $weight * $Quantity;
            $data['invoice_no'] = $wallet->invoice_no ? $wallet->invoice_no : "N/A";

            $shipping_rate = $wallet->shipping_rate ? $wallet->shipping_rate : 0;
            $shipping_type = $wallet->shipping_type ? $wallet->shipping_type : null;
            if ($shipping_type == 'regular') {
                $data['shipping_rate'] = 'N/A';
                $data['weight_charges'] = '0';
            } else {
                $data['weight_charges'] = round($shipping_rate * $totalWeight);
            }

            $data['invoice_no'] = $wallet->invoice_no ? $wallet->invoice_no : "N/A";
            $data['source_order_number'] = $wallet->source_order_number ? $wallet->source_order_number : "N/A";
            $data['tracking_number'] = $wallet->tracking_number ? $wallet->tracking_number : "N/A";

            $purchases_at = $wallet->purchases_at;
            $days = $purchases_at ? Carbon::parse($purchases_at)->diffInDays() : 0;
            $data['day_count'] = $days <= 1 ? $days . ' Day' : $days . ' Days';
        }
        return $data;
    }

    public function storeComments(Request $request, $id)
    {
        $wallet = OrderItem::find($id);
        if ($wallet) {
            $type = $request->type;
            $comments = $request->comments;
            if ($type == 'one') {
                $wallet->comment1 = $comments;
            } else {
                $wallet->comment2 = $comments;
            }
            $wallet->save();
        }
        return $wallet;
    }

    public function updateWalletCalculation($id)
    {
        $wallet = OrderItem::find($id);
        if ($wallet) {
            $product_price = ($wallet->product_value + $wallet->DeliveryCost - $wallet->coupon_contribution);

            $courier_bill = $wallet->courier_bill;
            $refunded = $wallet->refunded;
            $customer_tax = $wallet->customer_tax;
            $last_payment = $wallet->last_payment;

            $adjustment = $wallet->adjustment;

            $shipping_type = $wallet->shipping_type;
            $weight_change = 0;
            if ($shipping_type != 'regular') {
                $shipping_rate = $wallet->shipping_rate;
                $actual_weight = (float) $wallet->actual_weight;
                $weight_change = ($shipping_rate * $actual_weight);
            }

            $sumData = ($product_price -  $wallet->first_payment - $wallet->out_of_stock - $wallet->missing - $wallet->lost_in_transit);
            $sumData = ($sumData + $refunded + $customer_tax + $weight_change + $courier_bill) - $last_payment;

            $wallet->due_payment = ($sumData + $adjustment);
            $wallet->save();
        }
        return $wallet;
    }



    public function list()
    {
        $data = OrderItem::with('user', 'order', 'product')->orderByDesc('id')->get();
        return [
            'info' => [
                'seed' => '',
                'results' => $data->count(),
                'page' => 1,
            ],
            'results' => $data
        ];
    }
}
