<?php

namespace App\Http\Controllers\Backend\Content;

use App\Http\Controllers\Controller;
use App\Http\Services\Backend\TrackingService;
use App\Models\Auth\User;
use App\Models\Content\Order;
use App\Models\Content\OrderItem;
use App\Models\Content\OrderItemVariation;
use App\Http\Services\Backend\WalletService;
use Illuminate\Contracts\View\Factory;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\View\View;
use Throwable;

class WalletController extends Controller
{

  public $walletService;


  public function __construct(WalletService $walletService)
  {
    $this->walletService = $walletService;
  }


  /**
   * Display a listing of the resource.
   *
   * @return Factory|View
   */
  public function index()
  {
    $customers = User::role('user')
      ->whereNotNull('first_name')
      ->orderBy('first_name')
      ->get()
      ->pluck('first_name', 'id')
      ->prepend(' - Select Customer - ', '');

    return view('backend.content.wallet.index', ['findable' => $customers]);
  }

  public function list()
  {
    $data = $this->walletService->list();
    return \response($data);
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


  public function update_order_wallet_status(Request $request)
  {
    $item_id = request('item_id');
    $status = request('status');
    $orderItem = OrderItem::find($item_id);
    $data = [];
    $order_id = $orderItem->order_item_number;
    $amount = '';
    $tracking = '';
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
    } elseif ($status == 'delivered') {
      $data = $request->only('status');
    } elseif ($status == 'out-of-stock') {
      $data = $request->only('out_of_stock', 'out_of_stock_type', 'status');
      $amount = request('out_of_stock');
    } elseif ($status == 'adjustment') {
      $data = $request->only('adjustment', 'status');
      $amount = request('adjustment');
    } elseif ($status == 'customer_tax') {
      $data = $request->only('customer_tax');
    } elseif ($status == 'lost_in_transit') {
      $data = $request->only('lost_in_transit');
    } elseif ($status == 'refunded') {
      $data = $request->only('refunded', 'refunded_method', 'status');
      $amount = request('refunded');
    }

    // manage customer Messages
    $status =  false;
    if (!empty($data)) {
      $orderItem->update($data);
      $abcd = $this->walletService->updateWalletCalculation($orderItem->id);
      $status = true;
    }

    $user = $orderItem->user;
    if ($request->input('notify')) {
      generate_customer_notifications($status, $user, $order_id, $amount, $tracking);
    }

    return response(['status' => $status, 'data' => $orderItem]);
  }

  public function storeWalletComment(Request $request, $id)
  {
    $wallet = $this->walletService->storeComments($request, $id);
    return response(['status' => true, 'data' => $wallet]);
  }

  public function walletUpdatedParameters(Request $request, $id)
  {
    $wallet = $this->walletService->updatedParameters($request, $id);
    return response(['wallet' => $wallet]);
  }


  /**
   * Display the specified resource.
   *
   * @param int $id
   * @return \Illuminate\Contracts\Routing\ResponseFactory|Response
   */
  public function show($id)
  {
    $data = OrderItem::with('user:id,name,phone,email,first_name,last_name', 'order', 'itemVariations')->find($id);
    $render = '';
    $title = 'Wallet details';
    $status = false;
    if ($data) {
      $item_no = $data->item_number;
      $status = true;
      $title = "Wallet details of #{$item_no}";
    }

    return \response([
      'status' => $status,
      'title' => $title,
      'data' => $data,
    ]);
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
    $data = request()->all();
    unset($data['_method']);
    $orderItem  = OrderItem::find($id);
    if ($orderItem) {
      $orderItem->update($data);
      $abcd = $this->walletService->updateWalletCalculation($request, $id);
    }
    return response(['data' => $orderItem]);
  }

  /**
   * Remove the specified resource from storage.
   *
   * @param int $page
   * @return Response
   */
  public function destroy($id)
  {
    $orderItem = OrderItem::withTrashed()->find($id);
    $order_user_id = $orderItem->user_id ?? null;
    $orderItemItems = $orderItem->pluck('id')->toArray();
    $OrderItemVariation = OrderItemVariation::withTrashed()->whereIn('item_id', $orderItemItems)->where('user_id', $order_user_id);

    if ($orderItem->trashed()) {
      $orderItem->forceDelete();
      $OrderItemVariation->forceDelete();
      return \response([
        'status' => true,
        'icon' => 'success',
        'msg' => 'Wallet and Order Item variation permanently deleted',
      ]);
    } else if ($orderItem->delete()) {
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
    $OrderItemVariation = OrderItemVariation::onlyTrashed()->whereIn('order_item_id', $orderItemItems)->where('user_id', $order_user_id);

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
