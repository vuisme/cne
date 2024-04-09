<?php

namespace App\Http\Controllers\Backend\Content;

use App\Http\Controllers\Controller;
use App\Http\Services\Backend\TrackingService;
use App\Models\Auth\User;
use App\Models\Content\Order;
use App\Models\Content\OrderItem;
use App\Models\Content\OrderItemVariation;
use Carbon\Carbon;
use Illuminate\Contracts\View\Factory;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\View\View;
use Throwable;

class OrderController extends Controller
{
  public function delete_incomplete_order()
  {
    try {
      $days = get_setting('incomplete_order_deletion_after_day', 90);
      $before = Carbon::now()->subDays($days)->endOfDay()->toDateTimeString();
      $items = OrderItem::where('status', 'waiting-for-payment')
        ->where('created_at', '<', $before)
        ->get();
      foreach ($items as $item) {
        $order_id = $item->order_id;
        OrderItemVariation::where('item_id', $item->id)->delete();
        $item->delete();
        $order = Order::withCount('orderItems')->where('id', $order_id)->first();
        if ($order->order_items_count == 0) {
          $order->delete();
        }
      }
    } catch (\Exception $ex) {
      dump('incomplete_order deletion error');
    }
  }

  public function fix_no_name_user()
  {
    $orderUsers = Order::with('user')->whereHas('user', function ($user) {
      $user->whereNull('name')->orWhereNull('first_name');
    })->get();
    DB::beginTransaction();
    try {
      foreach ($orderUsers as $order) {
        $user_id = $order->user_id;
        $shipping = $order->shipping ? json_decode($order->shipping, true) : [];
        $user_name = $shipping['name'] ?? '';
        $user_phone = $shipping['phone'] ?? '';
        $user = User::find($user_id);
        $user->name = $user->name ? $user->name : $user_name;
        $user->first_name = $user->first_name ? $user->first_name : $user_name;
        $user->phone = $user->phone ? $user->phone : $user_phone;
        $user->save();
      }
      DB::commit(); // all good
    } catch (\Exception $e) {
      DB::rollback(); // something went wrong
    }

    $orderUsers = Order::with('user')->whereNull('name')->orWhereNull('phone')->get();

    DB::beginTransaction();
    try {
      foreach ($orderUsers as $order) {
        $user_id = $order->user_id;
        $shipping = $order->shipping ? json_decode($order->shipping, true) : [];
        $user_name = $shipping['name'] ?? '';
        $user_phone = $shipping['phone'] ?? '';
        $order->name = $order->name ? $order->name : $user_name;
        $order->phone = $order->phone ? $order->phone : $user_phone;
        $order->save();
      }
      DB::commit(); // all good
    } catch (\Exception $e) {
      DB::rollback(); // something went wrong
    }
  }
  /**
   * Display a listing of the resource.
   *
   * @return Factory|View
   */
  public function index()
  {
    $this->delete_incomplete_order();
    $this->fix_no_name_user();

    $orders = Order::get();
    $trashedOrders = Order::onlyTrashed()->get();
    return view('backend.content.order.index', compact('orders', 'trashedOrders'));
  }


  public function makeAsPayment($id)
  {
    $order = Order::with('orderItems')->findOrFail($id);
    $order_id = $id;
    $order_user_id = $order->user_id;
    if ($order) {
      DB::transaction(function () use ($order, $order_id, $order_user_id) {
        $order->update([
          'status' => 'partial-paid'
        ]);
        OrderItem::where('order_id', $order_id)
          ->where('user_id', $order_user_id)
          ->update([
            'status' => 'partial-paid',
          ]);
        foreach ($order->orderItems as $item) {
          $item_id = $item->id;
          (new TrackingService())->updateTracking($item_id, 'partial-paid');
        }
      });
    }
    $tran = $order->order_number ?? '';
    return redirect()->back()->withFlashSuccess('Incomplete order #' . $tran . ' make as partial paid');
  }


  public function orderPrint($id)
  {
    dd('development not finished');
    return redirect()->route('admin.order.print', $id);
    // $orderItem = OrderItem::with('order', 'itemVariations')->findOrFail($id);
    // return view('backend.content.order.print', compact('orderItem'));
  }

  /**
   * Store a newly created resource in storage.
   *
   * @param Request $request
   * @return \Illuminate\Http\JsonResponse
   * @throws Throwable
   */
  public function store(Request $request)
  {
    $status = request('status');
    $item_id = request('item_id');
    $orderItem = null;
    $is_array = false;
    if (is_array($item_id)) {
      $is_array = true;
      foreach ($item_id as $item) {
        $orderItem[] = $this->update_order_wallet_status($item, $status, $request);
      }
    } else {
      $is_array = false;
      $orderItem = $this->update_order_wallet_status($item_id, $status, $request);
    }

    $csrf = csrf_token();

    if (!empty($orderItem)) {
      $order_data = [
        'status' => true,
        'csrf' => $csrf,
        'is_array' => $is_array,
        'orderItem' => $orderItem,
      ];
      return \response()->json($order_data);
    }

    return \response()->json(['status' => false, 'csrf' => $csrf]);
  }


  public function update_order_wallet_status($item_id, $status, $request)
  {
    $orderItem = OrderItem::find($item_id);
    $data = [];
    $order_id = $orderItem->order_item_number;
    $amount = '';
    $tracking = '';
    if ($status === 'purchased') {
      $data = $request->only('order_number', 'status');
    } elseif ($status === 'shipped-from-suppliers') {
      $data = $request->only('tracking_number', 'status');
      $tracking = $data['tracking_number'];
    } elseif ($status === 'received-in-china-warehouse') {
      $data = $request->only('status');
    } elseif ($status === 'shipped-from-china-warehouse') {
      $data = $request->only('status');
    } elseif ($status === 'received-in-BD-warehouse') {
      $data = $request->only('actual_weight', 'status');
      $data['shipping_charge'] = $orderItem->shipping_rate * $data['actual_weight'];
    } elseif ($status === 'on-transit-to-customer') {
      $data = $request->only('status');
    } elseif ($status === 'delivered') {
      $data = $request->only('status');
    } elseif ($status === 'out-of-stock') {
      $data = $request->only('out_of_stock', 'out_of_stock_type', 'status');
      $amount = $data['out_of_stock'];
    } elseif ($status === 'adjustment') {
      $data = $request->only('adjustment', 'status');
      $amount = $data['adjustment'];
    } elseif ($status === 'refunded') {
      $data = $request->only('refunded', 'status');
      $amount = $data['refunded'];
    }

    // manage customer Messages
    $user = $orderItem->user;
    if ($request->input('notify')) {
      generate_customer_notifications($status, $user, $order_id, $amount, $tracking);
    }

    if (!empty($data)) {
      $orderItem->update($data);

      $product_value = (int)$orderItem->product_value;
      $chinaLocalDelivery = (int)$orderItem->chinaLocalDelivery;
      $coupon_contribution = (int)$orderItem->coupon_contribution;
      $first_payment = ($product_value + $chinaLocalDelivery - $coupon_contribution) * 0.50;

      $out_of_stock = (int)$orderItem->out_of_stock;
      $adjustment = (int)$orderItem->adjustment;
      $refunded = (int)$orderItem->refunded;
      $shipping_charge = (int)$orderItem->shipping_charge;
      $courier_bill = (int)$orderItem->courier_bill;
      $last_payment = (int)$orderItem->last_payment;
      $missing = (int)$orderItem->missing;

      $due_payment = $product_value + $chinaLocalDelivery - $coupon_contribution - $first_payment - $out_of_stock + $refunded + $shipping_charge + $courier_bill - $last_payment - $missing;

      $due_payment = $adjustment > 0 ? $due_payment + abs($adjustment) : $due_payment - abs($adjustment);

      $orderItem->update(['due_payment' => $due_payment, 'first_payment' => $first_payment]);
    }

    return $orderItem;
  }


  /**
   * Display the specified resource.
   *
   * @param int $id
   * @return \Illuminate\Contracts\Routing\ResponseFactory|Response
   */
  public function show($id)
  {
    $order = Order::with('orderItems')->findOrFail($id);
    return view('backend.content.order.show', compact('order'));
  }

  /**
   * Show the form for editing the specified resource.
   *
   * @param int $id
   * @return Response
   */
  public function edit($id)
  {
    dd($id);
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
    //
  }

  /**
   * Remove the specified resource from storage.
   *
   * @param int $page
   * @return Response
   */
  public function destroy($id)
  {
    $order_id = $id;
    $order = Order::withTrashed()->find($order_id);
    $orderItem = OrderItem::withTrashed()->where('order_id', $order_id);
    $OrderItemVariation = OrderItemVariation::withTrashed()->where('order_id', $order_id);

    if ($order->trashed()) {
      $order->forceDelete();
      $orderItem->forceDelete();
      $OrderItemVariation->forceDelete();
      return \response([
        'status' => true,
        'icon' => 'success',
        'msg' => 'Order, Order Item and Order Item variation permanently deleted',
      ]);
    } else if ($order->delete()) {
      $orderItem->delete();
      $OrderItemVariation->delete();
      return \response([
        'status' => true,
        'icon' => 'success',
        'msg' => 'Order, Order Item and Order Item variation delete successfully',
      ]);
    }
    return \response([
      'status' => false,
      'icon' => 'error',
      'msg' => 'Delete failed',
    ]);
  }

  public function trashed()
  {
    $orders = Order::onlyTrashed()->latest()->paginate(10);
    return view('backend.content.order.trash', compact('orders'));
  }

  public function restore($id)
  {
    $trashOrder = Order::onlyTrashed()->findOrFail($id);

    $order_id = $id;
    $order_user_id = $trashOrder->user_id;

    $orderItem = OrderItem::onlyTrashed()->where('order_id', $order_id)
      ->where('user_id', $order_user_id);
    $orderItemItems = $orderItem->pluck('id')->toArray();
    $OrderItemVariation = OrderItemVariation::onlyTrashed()->whereIn('item_id', $orderItemItems)->where('user_id', $order_user_id);

    $trashOrder->restore();
    $orderItem->restore();
    $OrderItemVariation->restore();

    return redirect()->route('admin.order.index')->withFlashSuccess('Order Recovered Successfully');
  }


  public function paymentValidator($update_id = null)
  {

    return request()->validate([
      'type' => 'required|string|max:155|exists:package_types,slug',
      'plan' => 'required|string|max:155|exists:packages,slug',
      'package' => 'required|numeric|max:9999|exists:packages,id',
      'domain' => $update_id ? 'required|string|max:191|unique:orders,domain,' . $update_id : 'required|string|max:191|unique:orders,domain',
      'payment_method' => 'required|string|max:191',
      'agent_account' => 'required|string|max:191', // payment received agent number
      'subs_year' => 'required|numeric|max:5',
      'subs_total' => 'required|numeric|max:9999',
      'client_account' => 'required|string|max:191',
      'transaction_no' => 'required|string|max:191',
    ]);
  }
}
