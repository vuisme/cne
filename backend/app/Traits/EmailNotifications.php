<?php

namespace App\Traits;

use App\Models\Auth\User;
use App\Notifications\OrderAuthInformation;
use App\Notifications\OrderPending;
use Illuminate\Support\Facades\Notification;


trait EmailNotifications
{

  protected function orderPaymentConfirmationNotification($order)
  {
    if ($order) {
      if (get_setting('active_partial_paid')) {
        if ($order->user) {
          $order->user->notify(new OrderPending($order));
        }
      }
      $this->orderPaymentConfirmationForAdmin($order);
    }
  }


  protected function orderPaymentConfirmationForAdmin($order)
  {
    $users = User::role('administrator')->whereConfirmed(1)->get();
    Notification::send($users, new OrderAuthInformation($order));
  }
}
