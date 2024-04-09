<?php

namespace App\Http\Controllers\Backend\Content;

use App\Http\Controllers\Controller;
use App\Http\Services\Backend\TrackingService;
use App\Models\Auth\User;
use App\Models\Content\OrderItem;
use App\Models\Content\OrderItemVariation;
use Illuminate\Contracts\View\Factory;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\View\View;
use Throwable;

class OrderTrackingController extends Controller
{
  public $trackingService;

  public function __construct(TrackingService $trackingService)
  {
    $this->trackingService = $trackingService;
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

    return view('backend.content.tracking.index', ['findable' => $customers]);
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

  

  public function walletTrackingInformation(Request $request, $id)
  {
  }

  /**
   * Display the specified resource.
   *
   * @param int $id
   * @return \Illuminate\Contracts\Routing\ResponseFactory|Response
   */
  public function show($id)
  {
    $tracking = $this->trackingService->show($id);
    return response(['tracking' => $tracking]);
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
