<?php

namespace App\Notifications\Frontend\Auth;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class OTPMail extends Notification
{
  use Queueable;

  public $txt;
  /**
   * Create a new message instance.
   *
   * @return void
   */
  public function __construct($txt)
  {
    $this->txt = $txt;
  }

  public function via($notifiable)
  {
    return ['mail'];
  }

  /**
   * Build the message.
   *
   * @return $this
   */
  public function toMail($notifiable)
  {
    $txt = $this->txt;
    $url = 'www.chinaexpress.com.bd/login';
    return (new MailMessage)
      ->subject('OTP Verification Code')
      ->cc(config('mail.from.address'))
      ->replyTo(config('mail.from.address'))
      ->greeting('Hello,')
      ->line($txt)
      ->action('View Orders', $url)
      ->line('Thank you for using our application!');
  }
}
