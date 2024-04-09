<?php

namespace App\Http\Services\Backend;

use App\Models\Backend\OrderTracking;
use App\Models\Backend\OrderTrackingExceptional;
use App\Models\Content\OrderItem;
use Carbon\Carbon;
use Illuminate\Http\Request;

/**
 * TrackingService
 */
class TrackingService
{




    public function show($item_id)
    {
        $tracking = OrderTracking::with(['exceptions' => function ($exceptions) {
            $exceptions->orderByDesc('id');
        }])->where('order_item_id', $item_id)
            ->orderByDesc('id')
            ->get();
        return $tracking;
    }

    public function initialTrackerStatus($wallet, $status, $item_id)
    {
        $statusArray = $this->expressTrackingArray();
        if (strtolower($wallet->shipping_type) == 'regular' && strtolower($wallet->ProviderType) == 'aliexpress') {
            $statusArray = $this->aliRegularTrackingArray();
        }
        foreach ($statusArray as $key => $value) {
            $tracking = new OrderTracking();
            $tracking->order_item_id = $item_id;
            $tracking->status = $key;
            $tracking->tracking_status = $value;
            if ($status == $key) {
                $tracking->updated_time = now();
            }
            if ($key == 'partial-paid') {
                $tracking->updated_time = $wallet->created_at;
            }
            $tracking->user_id = $wallet->user_id;
            $tracking->save();
        }
        return OrderTracking::where('order_item_id', $item_id)->get();
    }

    public function updateTracking($item_id,  $status, $comment = null)
    {
        $wallet =  OrderItem::find($item_id);
        $tracking = OrderTracking::where('order_item_id', $item_id)->get();
        if (!$tracking->count()) {
            $tracking = $this->initialTrackerStatus($wallet, $status, $item_id);
        }
        $tracking_find = $tracking->where('status', $status)->first();
        if ($tracking_find) {
            $tracking_find->updated_time = now();
            if ($comment) {
                $tracking_find->comment = $comment;
            }
            $tracking_find->save();
        } else {
            $last_track = $tracking->whereNotNull('updated_time')
                ->sortByDesc('id')
                ->first();
            $exceptArray = $this->exceptionTrackingArray();
            if (array_key_exists($status, $exceptArray)) {
                $last_track_id = $last_track ? $last_track->id : 0;
                $findExceptional = OrderTrackingExceptional::where('order_tracking_id', $last_track_id)
                    ->where('status', $status)->first();
                $findExceptional = $findExceptional ? $findExceptional : new OrderTrackingExceptional();
                $findExceptional->order_item_id = $item_id;
                $findExceptional->order_tracking_id = $last_track_id;
                $findExceptional->status = $status;
                $findExceptional->tracking_status = $exceptArray[$status];
                if ($comment) {
                    $findExceptional->comment = $comment;
                }
                $findExceptional->updated_time = now();
                $findExceptional->user_id = $wallet->user_id;
                $findExceptional->save();
            }
        }

        return true;
    }

    private function expressTrackingArray()
    {
        return [
            'partial-paid' => 'Partial Paid',
            'purchased' => 'Purchased',
            'shipped-from-suppliers' => 'Shipped from Seller',
            'received-in-china-warehouse' => 'Received in China Warehouse',
            'shipped-from-china-warehouse' => 'Shipped from China Warehouse',
            'received-in-BD-warehouse' => 'Received in BD Warehouse',
            'on-transit-to-customer' => 'On Transit to Customer',
            'delivered' => 'Delivered',
        ];
    }

    private function aliRegularTrackingArray()
    {
        return [
            'partial-paid' => 'Partial Paid',
            'purchased' => 'Purchased',
            'shipped-from-suppliers' => 'Shipped from Seller',
            'received-in-BD-warehouse' => 'Received in BD Warehouse',
            'on-transit-to-customer' => 'On Transit to Customer',
            'delivered' => 'Delivered',
        ];
    }

    private function exceptionTrackingArray()
    {
        return [
            'out-of-stock' => 'Out of Stock',
            'missing' => 'Missing/Shortage',
            'adjusted-by-invoice' => 'Adjusted by Invoice',
            'lost_in_transit' => 'Lost in Transit',
            'refunded' => 'Refund to Customer',
            'cancel' => 'Order Canceled',
            'comment1' => 'Comment-1',
            'comment2' => 'Comment-2',
        ];
    }
}
