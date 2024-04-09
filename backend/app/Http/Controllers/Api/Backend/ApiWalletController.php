<?php

namespace App\Http\Controllers\Api\Backend;

use App\Http\Controllers\Controller;
use App\Http\Services\Api\Backend\ApiWalletService;
use App\Http\Services\Backend\TrackingService;
use App\Models\Auth\User;
use App\Models\Content\Order;
use App\Models\Content\OrderItem;
use App\Models\Content\OrderItemVariation;
use Illuminate\Contracts\View\Factory;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\View\View;
use Svg\Tag\Rect;
use Throwable;

class ApiWalletController extends Controller
{

  public $apiWalletService;

  public function __construct(ApiWalletService $apiWalletService)
  {
    $this->apiWalletService = $apiWalletService;
  }


  /**
   * Display a listing of the resource.
   *
   * @return Factory|View
   */
  public function index(Request $request)
  {
    $data = $this->apiWalletService->list();
    return \response($data);
  }

  public function wallet_tracking_information($wallet_id)
  {
    $tracking = (new TrackingService())->show($wallet_id);
    return response(['tracking' => $tracking]);
  }

  public function update_order_wallet_status(Request $request)
  {
    $item_id = request('item_id');
    $status = request('status');

    $orderItem = OrderItem::find($item_id);
    $order_id = $orderItem->order_item_number;
    $amount = '';
    $tracking = '';
    $data = [];
    if ($status == 'purchased') {
      $data = $request->only('source_order_number', 'status');
      $data['purchases_at'] = now();
    } elseif ($status == 'shipped-from-suppliers') {
      $data = $request->only('tracking_number', 'status');
      $tracking = request('tracking_number');
    } elseif ($status == 'received-in-china-warehouse') {
      $data = $request->only('status');
    } elseif ($status == 'shipped-from-china-warehouse') {
      $data = $request->only('status');
    } elseif ($status == 'received-in-BD-warehouse') {
      $data = $request->only('actual_weight', 'status');
      $data['bd_shipping_charge'] = $orderItem->shipping_rate * (int) request('actual_weight', 0);
    } elseif ($status == 'on-transit-to-customer') {
      $data = $request->only('status');
    } elseif ($status == 'out-of-stock') {
      if (request('out_of_stock_type') == 'full') {
        $data = $request->only('out_of_stock', 'status');
      } else {
        $data = $request->only('out_of_stock');
      }
      $amount = request('out_of_stock');
    } elseif ($status == 'missing') {
      $data = $request->only('missing');
      $amount = request('out_of_stock');
    } elseif ($status == 'adjustment') {
      $data = $request->only('adjustment');
      $amount = request('adjustment');
    } elseif ($status == 'customer_tax') {
      $data = $request->only('customer_tax');
    } elseif ($status == 'lost_in_transit') {
      $data = $request->only('status', 'lost_in_transit');
    } elseif ($status == 'refunded') {
      $data = $request->only('refund_payment_method', 'refunded', 'status');
      $amount = request('refunded');
    } elseif ($status == 'cancel') {
      $data = $request->only('status', 'missing');
    } elseif ($status == 'comment1') {
      $data = $request->only('comment1');
    } elseif ($status == 'comment2') {
      $data = $request->only('comment2');
    }

    // manage customer Messages
    $res_status =  false;
    if (!empty($data)) {
      $orderItem->update($data);
      $this->apiWalletService->updateWalletCalculation($orderItem->id);
      $res_status = true;
    }
    $comment = request('comment');
    $res = (new TrackingService())->updateTracking($item_id, $status, $comment);
    return response(['$res' => $res]);

    $user = $orderItem->user;
    if (request('notify', null)) {
      generate_customer_notifications($status, $user, $order_id, $amount, $tracking);
    }


    return response(['status' => $res_status, 'data' => $orderItem]);
  }



  public function generateInvoices(Request $request)
  {
    $wallet = $request->all();
    return response(['wallet' => $wallet]);
  }


  public function storeWalletComment(Request $request, $id)
  {
    $wallet = $this->walletService->storeComments($request, $id);
    return response(['status' => true, 'data' => $wallet]);
  }

  /**
   * Update the specified resource in storage.
   *
   * @param Request $request
   * @param int $id
   * @return Response
   */
  public function update(Request $request, $id)
  {
    $data = request()->except('calculate');
    $calculate = request('calculate');
    $orderItem  = OrderItem::find($id);
    if (count($data) && $orderItem) {
      $orderItem->fill($data);
      $orderItem->save();
      if ($calculate) {
        $this->apiWalletService->updateWalletCalculation($orderItem->id);
      }
    }
    return response(['data' => $orderItem]);
  }

  /**
   * Remove the specified resource from storage.
   *
   * @param int $page
   * @return Response
   */
  public function destroy()
  {
    $selected = request('selected', []);

    $orderItem = OrderItem::withTrashed()->whereIn('id', $selected);
    $orderItemItems = $orderItem->pluck('id')->toArray();
    $OrderItemVariation = OrderItemVariation::withTrashed()->whereIn('item_id', $orderItemItems);

    if ($orderItem->delete()) {
      $OrderItemVariation->delete();
      return \response([
        'status' => true,
        'icon' => 'success',
        'msg' => 'Wallet and Order Item variation delete successfully',
      ]);
    }
    return \response([
      'status' => false,
      'icon' => 'error',
      'msg' => 'Delete failed',
    ]);
  }

  public function restore($id)
  {
    $trashOrder = Order::onlyTrashed()->findOrFail($id);

    $order_id = $id;
    $order_user_id = $trashOrder->user_id;

    $orderItem = OrderItem::onlyTrashed()->where('order_id', $order_id)
      ->where('user_id', $order_user_id);
    $orderItemItems = $orderItem->pluck('id')->toArray();
    $OrderItemVariation = OrderItemVariation::onlyTrashed()->whereIn('order_item_id', $orderItemItems)->where('user_id', $order_user_id);

    $trashOrder->restore();
    $orderItem->restore();
    $OrderItemVariation->restore();

    return redirect()->route('admin.order.index')->withFlashSuccess('Order Recovered Successfully');
  }
}
