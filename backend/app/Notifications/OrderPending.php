<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class OrderPending extends Notification
{
  use Queueable;

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
   * Get the notification's delivery channels.
   *
   * @param mixed $notifiable
   * @return array
   */
  public function via($notifiable)
  {
    // return ['mail', 'database'];
    return ['mail'];
  }

  /**
   * Get the mail representation of the notification.
   *
   * @param mixed $notifiable
   * @return MailMessage
   */
  public function toMail($notifiable)
  {
    $order = $this->data;
    $frontend_url = config('app.frontend_url');
    $transaction_id = $order->transaction_id ?? null;
    $txt = get_setting('partial_paid');
    $txt = str_replace('[transactionNumber]', $transaction_id, $txt);
    $txt = str_replace('[orderNumber]', $order->order_number, $txt);
    $txt = str_replace('[amount]', ($order->orderItems->sum('product_value') ?? 0), $txt);
    $subject = 'Payment Confirmation';
    $url = $frontend_url . "/dashboard/orders/{$transaction_id}";
    $first_name = $notifiable->first_name ?? 'Customer';
    $last_name = $notifiable->last_name ?? '';
    $full_name = $notifiable->name ? $notifiable->name : $first_name . ' ' . $last_name;

    return (new MailMessage)
      ->subject($subject)
      ->bcc('sumon4skf@gmail.com')
      ->replyTo(config('mail.from.address'))
      ->greeting('Hello, ' . $full_name)
      ->line($txt)
      ->action('View Orders', $url)
      ->line('Thank you for using our application!');
  }

  /**
   * Get the array representation of the notification.
   *
   * @param mixed $notifiable
   * @return array
   */
  public function toArray($notifiable)
  {
    $order = $this->data;
    $transaction_id = $order->transaction_id ?? null;
    $txt = get_setting('partial_paid');
    $txt = str_replace('[transactionNumber]', $transaction_id, $txt);
    $amount = $this->data->amount ?? null;
    return [
      'invoice_id' => $order->id,
      'transaction_id' => $transaction_id,
      'text' => $txt,
      'amount' => $amount,
    ];
  }
}
