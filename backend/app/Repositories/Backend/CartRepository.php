<?php

namespace App\Repositories\Backend;

use App\Models\Auth\User;
use App\Models\Content\Cart;
use App\Models\Content\CartItem;
use App\Models\Content\CartItemVariation;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

/**
 * Class UserRepository.
 */
class CartRepository
{

  public function cart_uid(Request $request)
  {
    $cart_uid = $request->token;
    return $cart_uid ? $cart_uid : Str::random(60);
  }

  public function get_pure_cart($cart_id)
  {
    return Cart::with(['cartItems' => function ($query) {
      $query->with('variations')->withCount('variations');
    }])
      ->withCount('variations')
      ->whereNull('is_purchase')
      ->where('id', $cart_id)
      ->first();
  }

  public function get_customer_cart(Request $request, $cart_uid = null)
  {
    $cart_uid = $cart_uid ? $cart_uid : $this->cart_uid($request);
    $auth_check = auth('sanctum')->check();
    $cart = Cart::whereNull('is_purchase')
      ->where('cart_uid', $cart_uid)
      ->orderByDesc('id')
      ->get();
    if ($cart->isEmpty() && $auth_check) {
      $cart = Cart::whereNull('is_purchase')
        ->where('user_id', auth('sanctum')->id())
        ->orderByDesc('id')
        ->get();
    }

    if ($cart->isEmpty()) {
      return [];
    }

    $first = $cart->first();

    if ($cart->count() > 1) {
      foreach ($cart as $item) {
        if ($first->id !== $item->id) {
          CartItem::where('cart_id', $item->id)
            ->update([
              'cart_id' => $first->id,
            ]);
          CartItemVariation::where('cart_id', $item->id)
            ->update([
              'cart_id' => $first->id,
            ]);
          $item->update(['is_purchase' => 1]);
        }
      }
    }

    $cart = $this->get_pure_cart($first->id);

    if ($auth_check) {
      $auth_id = auth('sanctum')->id();
      $user = User::with('shipping')->find($auth_id);
      $cart->payment_method = 'bkash';
      $cart->shipping = $user->shipping ? json_encode($user->shipping) : null;
      $cart->user_id = $auth_id;
      $cart->save();
    }
    if ($cart) {
      if (!$cart->cart_uid || $cart->cart_uid == 'null') {
        $cart->cart_uid = Str::random(60);
        $cart->save();
      }
    }

    return $cart;
  }


  public function get_checkout_cart(Request $request)
  {
    $cart = $this->get_customer_cart($request);
    $cart_id = null;
    if ($cart) {
      $cart_id = $cart->id;
      $cartItems = $cart->cartItems;
      foreach ($cartItems as $item) {
        if (!$item->IsCart) {
          $variations = $item->variations->pluck('id');
          CartItemVariation::whereIn('id', $variations)->delete();
          CartItem::where('id', $item->id)->delete();
        } else {
          $variation_count = $item->variations->count();
          if (!$variation_count) {
            CartItem::where('id', $item->id)->delete();
          }
        }
      }
    }
    return  $this->get_pure_cart($cart_id);
  }
}
