<?php

namespace App\Http\Controllers\PaymentGateway;

use App\Http\Controllers\Controller;
use App\Models\Content\Invoice;
use App\Models\Content\Order;
use App\Models\Content\OrderItem;
use App\Traits\ApiResponser;
use App\Traits\EmailNotifications;

class NagadPaymentController extends Controller
{
  use ApiResponser, EmailNotifications;

  public $order = null;
  public $invoice = null;


  public function payment_process()
  {
    $tran_id = \request('tran_id');
    $user_id = auth()->id();

    $order = Order::where('transaction_id', $tran_id)->where('user_id', $user_id)->first();
    if (!$order) {
      return $this->error('Your order not found', 417);
    }
    $OrderId = $order->order_number;
    $amount = $order->needToPay;
    $nagadMode = config('nagad.sandbox_mode');
    $MerchantID = config('nagad.merchant_id');
    $accountNumber = config('nagad.merchant_number');
    $merchantCallbackURL = config('nagad.callback_url');
    $DateTime = Date('YmdHis');
    $random = generateRandomString();
    $amount = $nagadMode == 'sandbox' ? 2 : ceil($amount);

    if ($nagadMode == 'sandbox') {
      $PostURL = "https://sandbox.mynagad.com:10080/remote-payment-gateway-1.0/api/dfs/check-out/initialize/" . $MerchantID . "/" . $OrderId;
    } else {
      $PostURL = "https://api.mynagad.com/api/dfs/check-out/initialize/" . $MerchantID . "/" . $OrderId;
    }

    $SensitiveData = array(
      'merchantId' => $MerchantID,
      'datetime' => $DateTime,
      'orderId' => $OrderId,
      'challenge' => $random
    );

    $PostData = array(
      'accountNumber' => $accountNumber, //Replace with Merchant Number
      'dateTime' => $DateTime,
      'sensitiveData' => EncryptDataWithPublicKey(json_encode($SensitiveData)),
      'signature' => SignatureGenerate(json_encode($SensitiveData))
    );

    $Result_Data = HttpPostMethod($PostURL, $PostData);

//    dd($Result_Data);

    if (isset($Result_Data['sensitiveData']) && isset($Result_Data['signature'])) {
      if ($Result_Data['sensitiveData'] != "" && $Result_Data['signature'] != "") {
        $PlainResponse = json_decode(DecryptDataWithPrivateKey($Result_Data['sensitiveData']), true);
        if (isset($PlainResponse['paymentReferenceId']) && isset($PlainResponse['challenge'])) {
          $paymentReferenceId = $PlainResponse['paymentReferenceId'];
          $randomServer = $PlainResponse['challenge'];

          $SensitiveDataOrder = array(
            'merchantId' => $MerchantID,
            'orderId' => $OrderId,
            'currencyCode' => '050',
            'amount' => $amount,
            'challenge' => $randomServer
          );

          // print_r($SensitiveDataOrder);
          // exit;

          $merchantAdditionalInfo = '{"Service Name": "uniqaz", "tran_id" : "' . $tran_id . '" }';

          $PostDataOrder = array(
            'sensitiveData' => EncryptDataWithPublicKey(json_encode($SensitiveDataOrder)),
            'signature' => SignatureGenerate(json_encode($SensitiveDataOrder)),
            'merchantCallbackURL' => $merchantCallbackURL,
            'additionalMerchantInfo' => json_decode($merchantAdditionalInfo)
          );
          if ($nagadMode == 'sandbox') {
            $OrderSubmitUrl = "https://sandbox.mynagad.com:10080/remote-payment-gateway-1.0/api/dfs/check-out/complete/" . $paymentReferenceId;
          } else {
            $OrderSubmitUrl = "https://api.mynagad.com/api/dfs/check-out/complete/" . $paymentReferenceId;
          }

          $Result_Data_Order = HttpPostMethod($OrderSubmitUrl, $PostDataOrder);
          if ($Result_Data_Order['status'] == "Success") {
            return $this->success([
              'nagadURL' => $Result_Data_Order['callBackUrl']
            ]);
          }
          return $this->error('Payment preparing error', 417, $PlainResponse);
        } else {
          return $this->error('Decrypt response failed', 417, $PlainResponse);
        }
      }
    }
    return $this->error('Your payment HttpPostMethod response failed', 417, ['error' => $Result_Data]);
  }

  public function nagad_payment_verify()
  {
    $request = request()->all();
    $order_id = request('order_id');
    $payment_ref_id = request('payment_ref_id');
    $status = request('status'); // Success
    $message = request('message');
    $nagadMode = config('nagad.sandbox_mode');

    if ($nagadMode == 'sandbox') {
      $url = "http://sandbox.mynagad.com:10080/remote-payment-gateway-1.0/api/dfs/verify/payment/" . $payment_ref_id;
    } else {
      $url = "https://api.mynagad.com/api/dfs/verify/payment/" . $payment_ref_id;
    }

    $order = Order::with('user')->where('id', $order_id)->first();
    $invoice = Invoice::with('user')->where('id', $order_id)->first();

    $this->order = $order;
    $this->invoice = $invoice;

    if ($status == 'Success') {
      if ($order) {
        return $this->nagad_order_success();
      }
      if ($invoice) {
        return $this->nagad_invoice_success();
      }
      $msg = "Fail to load payment. You can contact us";
      return redirect("/payment/{123}?status=success&msg={$msg}");
    }

    if ($status === 'Aborted') {
      return $this->nagad_order_failure();
    }

    $msg = "Fail to load payment. You can contact us";
    return redirect("/payment/{123}?status=failure&msg={$msg}");
  }

  public function nagad_order_success()
  {
    $order = $this->order;
    if ($order) {
      $order_id = $order->id;
      $msg = "Thank you for your order";
      if ($order->status == 'waiting-for-payment') {
        $order->update(['status' => 'partial-paid', 'pay_method' => 'bkash']);
        OrderItem::where('order_id', $order->id)->update(['status' => 'partial-paid']);

        $this->orderPaymentConfirmationNotification($order);

        return redirect("/payment/{$order_id}?status=success&msg={$msg}");
      }
      return redirect("/payment/{$order_id}?status=success&msg={$msg}");
    }
    $msg = "Your order not found. You can contact us";
    return redirect("/payment/{123}?status=success&msg={$msg}");
  }


  public function nagad_invoice_success()
  {
    $invoice = $this->invoice;
    $tran_id = $invoice->transaction_id ?? "unknown";
    if ($invoice) {
      $invoice_id = $invoice->id;
      $msg = "Thanks for Payment";
      if ($invoice->status == 'Pending') {
        $invoice->update(['status' => 'confirm_received']);
        // $users = User::role('administrator')->get();
        // Notification::send($users, new OrderAuthInformation($order));
        // if (get_setting('active_partial_paid')) {
        //     if ($order->user) {
        //         $order->user->notify(new OrderPending($order));
        //     }
        // }
        return redirect("/payment/{$invoice_id}?status=success&msg={$msg}");
      }
      return redirect("/payment/{$invoice_id}?status=success&msg={$msg}");
    }
    $msg = "Your Invoice not found. You can contact us";
    return redirect("/payment/{123}?status=failure&msg={$msg}");
  }

  public function nagad_order_failure()
  {
    $order = $this->order;
    if ($order) {
      $order_id = $order->id;
      $msg = "Your order is not completed due to payment failed!";
      return redirect("/payment/{$order_id}?status=failure&msg={$msg}");
    }
    $invoice = $this->invoice;
    if ($invoice) {
      $invoice_id = $invoice->id;
      $msg = "Your Payment is not completed due to payment failed!";
      return redirect("/payment/{$invoice_id}?status=failure&msg={$msg}");
    }
    $msg = "Your Payment not found. You can contact us";
    return redirect("/payment/{123}?status=failure&msg={$msg}");
  }

}
