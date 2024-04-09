<?php

namespace App\Mail\Frontend\Order;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Queue\SerializesModels;

class OrderConfirmAdminEmail extends Mailable
{
  use Queueable, SerializesModels;

  public $data;

  /**
   * Create a new notification instance.
   *
   * @return void
   */
  public function __construct($data)
  {
    $this->data = $data;
  }

  /**
   * Build the message.
   *
   * @return $this
   */
  public function build()
  {
    $order = $this->data;
    $transaction_id = $order->transaction_id ?? null;
    $order_id = $order->id ?? null;
    $amount = $order->amount ?? null;
    $needToPay = $order->needToPay ?? null;
    $dueForProducts = $order->dueForProducts ?? null;
    $user = $order->user;
    $full_name = $user ? $user->first_name . ' ' . $user->last_name : 'Customer';

    return $this->markdown('notification/OrderAuthInfo', [
      'full_name' => $full_name,
      'transaction_id' => $transaction_id,
      'amount' => $amount,
      'needToPay' => $needToPay,
      'dueForProducts' => $dueForProducts,
      'order_id' => $order_id
    ]);

    //    return $this->view('frontend.mail.admin')
    //      ->subject(__('strings.emails.contact.subject', ['app_name' => app_name()]));

    //        return $this->view('view.name');
  }
}
