<?php

namespace App\Http\Controllers\PaymentGateway;

use App\Http\Controllers\Controller;
use App\Http\Services\Backend\TrackingService;
use App\Models\Auth\User;
use App\Models\Content\Invoice;
use App\Models\Content\Order;
use App\Models\Content\OrderItem;
use App\Models\Content\PaymentToken;
use App\Models\Content\Setting;
use App\Traits\ApiResponser;
use App\Traits\BkashApiResponse;
use App\Traits\EmailNotifications;
use Auth;

class BkashPaymentController extends Controller
{
  use ApiResponser, BkashApiResponse, EmailNotifications;

  public $order = null;
  public $paymentID = null;
  public $timestamp = null;
  public $statusMessage = null;


  public function PaymentToken($id)
  {
    $token = request('token');
    $token = PaymentToken::where('token', $token)
      ->where('tran_id', $id)
      ->where('expire_at', '>=', now())
      ->first();
    if (!$token) {
      abort(404);
    }
    return $token;
  }

  public function processAmount($token)
  {
    $order = Order::with('orderItems')
      ->where('status', 'waiting-for-payment')
      ->where('id', $token->order_id)
      ->where('user_id', $token->user_id)
      ->first();
    $amount = $order ? (int)($order->orderItems->sum('first_payment')) : 0;
    if (!$order) {
      $invoice = Invoice::where('status', 'waiting-for-payment')->where('transaction_id', $token->tran_id)->first();
      $amount = $amount ? $amount : ($invoice ? $invoice->total_payable : 0);
    }
    return ceil($amount);
  }


  public function bkashPaymentProcess($tran_id)
  {
    $token = $this->PaymentToken($tran_id);
    $amount = $this->processAmount($token);
    $frontend = config('app.frontend_url');
    $token_id = $token->token;
    $data = [
      'ref_no' => $tran_id,
      'amount' => $amount,
      'token_url' => url('/bkash/token'),
      'checkout_url' => url("bkash/checkout?token={$token_id}&ref_no={$tran_id}"),
      'execute_url' => url("bkash/execute?token={$token_id}&paymentID="),
      'success_url' => url("bkash/payment/status?token={$token_id}&status=success&ref_no={$tran_id}"),
      'failed_url' => url("bkash/payment/status?token={$token_id}&status=failed&ref_no={$tran_id}"),
      'cancel_url' => url("bkash/payment/status?token={$token_id}&status=cancel&ref_no={$tran_id}")
    ];
    return view('frontend.payment.bkash', compact('data'));
  }


  public function PaymentStatus()
  {
    $status = request('status');
    $n_msg = request('n_msg');
    $paymentID = request('paymentID');
    $tran_id = request('tran_id');
    $trxID = request('trxID');
    $auth_id = auth()->id();

    $token = $this->PaymentToken($tran_id);
    $order = Order::with('user', 'orderItems')->where('id', $token->order_id)->first();
    $this->order = $order;
    $this->paymentID = $paymentID;
    $this->statusMessage = $n_msg;
    if ($status == 'success') {
      if ($paymentID) {
        $order->update(['bkash_payment_id' => $paymentID, 'bkash_trx_id' => $trxID]);
      }
      return $this->bkash_order_success();
    }

    if ($status == 'cancel') {
      return $this->bkash_order_cancel();
    }
    if ($status == 'failed') {
      return $this->bkash_order_failure();
    }
    $frontend = config('app.frontend_url');
    return redirect()->to("{$frontend}/online/payment/failed?tran_id={$tran_id}?status=failure&&msg=Payment processing failed");
  }


  public function bkash_order_success()
  {
    $frontend = config('app.frontend_url');
    $order = $this->order;
    $order_id = $order->id ?? null;
    $tran_id = $order->transaction_id ?? null;
    $trxID = $order->bkash_trx_id ?? null;
    if ($order) {
      if ($order->status == 'waiting-for-payment') {
        $order->update(['status' => 'partial-paid', 'payment_method' => 'bkash']);
        OrderItem::where('order_id', $order->id)->update(['status' => 'partial-paid']);
        if (config('app.env') === 'production') {
          $this->orderPaymentConfirmationNotification($order);
        }
        try {
          $orderItems = OrderItem::where('order_id', $order->id)->get();
          foreach ($orderItems as $orderItem) {
            (new TrackingService())->updateTracking($orderItem->id, 'partial-paid');
          }
        } catch (\Exception $e) {
        }
      }
      return redirect()->to("{$frontend}/online/payment/success?tran_id={$tran_id}&trxID={$trxID}&paymentID={$this->paymentID}&msg={$this->statusMessage}");
    }
    return redirect()->to("{$frontend}/online/payment/failed?tran_id={$tran_id}?status=failure&paymentID={$this->paymentID}&msg={$this->statusMessage}");
  }

  public function bkash_order_cancel()
  {
    $frontend = config('app.frontend_url');
    $order = $this->order;
    $tran_id = $order->transaction_id ?? null;
    return redirect()->to("{$frontend}/online/payment/cancel?tran_id={$tran_id}&msg={$this->statusMessage}");
  }

  public function bkash_order_failure()
  {
    $frontend = config('app.frontend_url');
    $order = $this->order;
    $tran_id = $order->transaction_id ?? null;
    return redirect()->to("{$frontend}/online/payment/failed?tran_id={$tran_id}&msg={$this->statusMessage}");
  }

  public function bkashToken()
  {
    $id_token = $this->initializeBkashToken();

    return response(['status' => $id_token ? 'Token generated' : 'Token not generated']);
  }

  public function createCheckoutPayment()
  {
    $tran_id = \request('ref_no'); // must be unique
    $token = $this->PaymentToken($tran_id);
    $amount = $this->processAmount($token);

    $body = [
      'amount' => $amount,
      'currency' => "BDT",
      'intent' => "sale",
      'merchantInvoiceNumber' => $tran_id,
    ];

    $data = $this->CreatePayment($body);

    // Setting::save_settings([
    //   'bkash_create_api' => json_encode($data),
    // ]);

    return response($data);
  }

  public function executeCheckoutPayment()
  {
    $paymentID = request('paymentID');
    $response = $this->ExecutePayment($paymentID);
    $status = getArrayKeyData($response, 'status');
    if (!$status) {
      $response = $this->QueryPayment($paymentID);
      //            Setting::save_settings([
      //                'bkash_query_payment' => json_encode($response),
      //            ]);
    }
    //        Setting::save_settings([
    //            'bkash_execute_api' => json_encode($response),
    //        ]);
    return response($response);
  }
}
