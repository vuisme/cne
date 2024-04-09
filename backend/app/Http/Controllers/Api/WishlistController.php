<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Content\Frontend\Wishlist;
use App\Traits\ApiResponser;

/**
 * Class HomeController.
 */
class WishlistController extends Controller
{
  use ApiResponser;

  public function AddToWishList()
  {
    $wishlistData = request()->only('img', 'name', 'provider_type', 'rating', 'regular_price', 'sale_price', 'stock', 'total_sold');
    $ItemId = request('ItemId');
    $auth_id = auth()->id();
    $wishlists = [];
    if ($auth_id) {
      Wishlist::UpdateOrCreate(
        ['user_id' => $auth_id, 'ItemId' => $ItemId],
        $wishlistData
      );
      $wishlists = Wishlist::where('user_id', $auth_id)->get();
    }
    return response([
      'status' => true,
      'wishlists' => $wishlists
    ]);
  }

  public function getCustomerWishList()
  {
    $items = [];
    $user = auth('sanctum')->check() ? auth('sanctum')->user() : null;
    if ($user) {
      $items = Wishlist::where('user_id', $user->id)->latest()->get();
    }
    return response([
      'status' => true,
      'wishlists' => $items
    ]);
  }

  public function removeCustomerWishList()
  {
    $auth_id = auth()->id();
    $item_id = request('ItemId');
    if ($auth_id && $item_id) {
      Wishlist::where('ItemId', $item_id)
        ->where('user_id', $auth_id)
        ->delete();
    }
    Wishlist::whereNull('ItemId')->delete();
    $wishlists = Wishlist::where('user_id', $auth_id)->get();
    return response([
      'status' => true,
      'wishlists' => $wishlists
    ]);
  }
}
