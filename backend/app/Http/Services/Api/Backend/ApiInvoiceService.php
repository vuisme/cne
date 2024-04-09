<?php

namespace App\Http\Services\Api\Backend;

use App\Http\Services\Api\PaginationService;
use App\Http\Services\Backend\TrackingService;
use App\Models\Auth\User;
use App\Models\Content\Invoice;
use App\Models\Content\InvoiceItem;
use App\Models\Content\OrderItem;

/**
 * ApiInvoiceService
 */
class ApiInvoiceService
{
    public function list($request)
    {
        $search_val   = request('search');
        $status   = request('status', []);
        $query = Invoice::with('invoiceItems', 'user');
        $searchable = ['invoice_no', 'transaction_id', 'customer_name', 'customer_phone', 'customer_address', 'total_payable', 'total_courier', 'payment_method', 'delivery_method', 'total_due', 'status'];
        if ($search_val && count($searchable) > 0) {
            $query->where(function ($query) use ($searchable, $search_val) {
                foreach ($searchable as $col) {
                    $query->orWhere($col, 'LIKE', "%$search_val%");
                }
            })->orWhereHas('invoiceItems', function ($query) use ($search_val) {
                $query->where('order_item_number', 'like', '%' . $search_val . '%')
                    ->orWhere('product_name', 'like', '%' . $search_val . '%')
                    ->orWhere('weight', 'like', '%' . $search_val . '%')
                    ->orWhere('total_due', 'like', '%' . $search_val . '%');
            })->orWhereHas('user', function ($query) use ($search_val) {
                $query->where('name', 'like', '%' . $search_val . '%')
                    ->orWhere('first_name', 'like', '%' . $search_val . '%')
                    ->orWhere('last_name', 'like', '%' . $search_val . '%')
                    ->orWhere('email', 'like', '%' . $search_val . '%')
                    ->orWhere('phone', 'like', '%' . $search_val . '%');
            });
        }

        if (count($status) > 0) {
            $query->whereIn('status', $status);
        }
        $query = $query->orderByDesc('id');

        $column = [];
        $data  = (new PaginationService())->getPaginatedData($query, $column);
        $paginatedQuery = $data['data'];
        $finalQuery     = $paginatedQuery->get();
        $data['data']   = $finalQuery;
        return $data;
    }


    public function store($request)
    {
        $invoices = $request->input('invoices', []);
        $related = $request->input('related', []);
        $status = false;
        if (!empty($related)) {
            $user_id = $related['user_id'];
            $isNotify = $related['notify_customer'];
            $courier_bill = $related['courier_bill'];
            $payment_method = $related['payment_method'];
            $delivery_method = $related['delivery_method'];
            $user = User::with('shipping')->find($user_id);
            $invoice = Invoice::create([
                // 'transaction_id' => uniqid('SSL'),
                'customer_name' => $user->full_name,
                'customer_phone' => $user->phone,
                'customer_address' => json_encode($user->shipping),
                'total_payable' => $related['payable_amount'],
                'total_courier' => $courier_bill,
                'payment_method' => $payment_method,
                'delivery_method' => $delivery_method,
                'total_due' => $related['payable_amount'],
                'status' => 'Pending',
                'user_id' => $user_id,
            ]);

            $invoice_no = generate_order_number($invoice->id, 4);

            $invoice->update([
                'invoice_no' => $invoice_no,
            ]);

            if (!empty($invoices)) {
                $total_invoices = is_array($invoices) ? count($invoices) : 0;
                $courier_bill = $courier_bill > 0 && $total_invoices > 0 ? ($courier_bill / $total_invoices) : 0;
                $orderNo = [];
                $dues = [];
                foreach ($invoices as $item) {
                    $item_id = $item['id'] ?? null;
                    $total_due = $item['due_payment'] ?? 0;
                    $item_number = $item['item_number'] ?? null;
                    $weight = $item['actual_weight'] ?? null;
                    array_push($dues, $total_due);
                    array_push($orderNo, $item_number);
                    InvoiceItem::create([
                        'invoice_id' => $invoice->id,
                        'order_item_id' => $item_id,
                        'order_item_number' => $item_number,
                        'product_id' => $item['ItemId'],
                        'product_name' => $item['Title'],
                        'weight' => $weight ? $weight : 0,
                        'total_due' => $total_due,
                        'user_id' => $user_id,
                    ]);
                    $wallet = OrderItem::find($item_id);
                    if ($wallet) {
                        $wallet_status = 'adjusted-by-invoice';
                        if ($wallet->status == 'received-in-BD-warehouse') {
                            $wallet_status = 'on-transit-to-customer';
                        }
                        $wallet->courier_bill = $courier_bill;
                        $wallet->invoice_no = $invoice_no;
                        $wallet->status = $wallet_status;
                        $wallet->last_payment = $total_due;
                        $wallet->save();
                        (new ApiWalletService())->updateWalletCalculation($item_id);
                        (new TrackingService())->updateTracking($item_id, $wallet_status);
                    }
                }
                if ($isNotify) {
                    generate_customer_notifications('on-transit-to-customer', $user, implode(', ', $orderNo), implode(', ', $dues), "");
                }
                $status =  true;
            }
        }

        return ['status' => $status];
    }
}
