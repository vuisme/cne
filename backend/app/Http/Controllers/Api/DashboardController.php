<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Content\Order;
use App\Models\Content\OrderItem;
use App\Models\Content\PaymentToken;
use App\Repositories\Frontend\DashboardRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class DashboardController extends Controller
{

  public $dashboardRepository;

  public function __construct(DashboardRepository $dashboardRepository)
  {
    $this->dashboardRepository = $dashboardRepository;
  }


  public function paymentStatusUpdate()
  {
    $tran_id = request('tran_id');
    $paymentID = request('paymentID');
    $trxID = request('trxID');
    $method = request('payment_method', 'bkash');

    $user = auth('sanctum')->user();
    $order = Order::where('transaction_id', $tran_id)
      ->where('user_id', $user->id)
      ->where('status', 'waiting-for-payment')
      ->first();

    if ($order) {
      $order->update([
        'bkash_payment_id' => $paymentID,
        'bkash_trx_id' => $trxID,
        'status' => 'partial-paid',
        'payment_method' => $method
      ]);
    }

    return response(['status' => true]);
  }

  public function orderIndex()
  {
    $user_id = auth()->id();
    $page = request('page', 0);
    $limit = request('limit', 10);
    $offset = ($page * $limit);

    $orders = OrderItem::with('order:id,order_number,name,phone,shipping,billing,coupon_code,coupon_discount,payment_method,transaction_id')
      ->latest()
      ->where('user_id', $user_id)
      ->offset($offset)
      ->limit($limit)
      ->get();
    return response([
      'orders' => $orders
    ]);
  }

  public function orderDetails($tran_id)
  {
    $user_id = auth()->id();
    $order = Order::with(['orderItems' => function ($query) {
      $query->with('itemVariations');
    }])
      ->latest()
      ->where('user_id', $user_id)
      ->where('transaction_id', $tran_id)
      ->first();
    return response([
      'order' => $order
    ]);
  }

  public function walletDetails($id)
  {
    $user_id = auth()->id();
    $wallet = OrderItem::with('order', 'itemVariations')
      ->latest()
      ->where('user_id', $user_id)
      ->where('id', $id)
      ->first();
    return response([
      'wallet' => $wallet
    ]);
  }


  public function paymentGenerate()
  {
    $tran_id = request('tran_id');
    $user_id = auth()->id();
    $order = Order::where('user_id', $user_id)
      ->where('transaction_id', $tran_id)
      ->first();
    $token = Str::random(60);
    if ($order) {
      PaymentToken::create([
        'token' => $token,
        'tran_id' => $order->transaction_id,
        'order_id' => $order->id,
        'expire_at' => now()->addMinutes(5)->toDateTimeString(),
        'user_id' => $user_id,
      ]);
      return response([
        'status' => true,
        'msg' => 'Order placed successfully',
        'redirect' => url('bkash/payment/' . $order->transaction_id . '?token=' . $token),
      ]);
    }

    return response([
      'status' => false,
      'msg' => 'Payment token generating fail'
    ]);
  }


  public function invoiceIndex(Request $request)
  {
    $data = $this->dashboardRepository->getCustomerInvoices($request);
    return response($data);
  }

  public function invoiceDetails(Request $request, $invoice_no)
  {
    $data = $this->dashboardRepository->getCustomerInvoiceDetails($request, $invoice_no);
    return response($data);
  }
}
