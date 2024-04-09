<?php

namespace App\Models\Content;

use App\Models\Auth\User;
use Illuminate\Database\Eloquent\Model;

class CartItem extends Model
{
  protected $table = 'cart_items';

  public $primaryKey = 'id';

  public $timestamps = true;

  protected $guarded = [];

  public function cart()
  {
    return $this->belongsTo(Cart::class, 'cart_id', 'id');
  }

  public function variations()
  {
    return $this->hasMany(CartItemVariation::class, 'cart_item_id', 'id');
  }
}
