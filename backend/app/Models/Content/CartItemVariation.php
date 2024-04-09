<?php

namespace App\Models\Content;

use App\Models\Auth\User;
use Illuminate\Database\Eloquent\Model;

class CartItemVariation extends Model
{
  protected $table = 'cart_item_variations';

  public $primaryKey = 'id';

  public $timestamps = true;

  protected $guarded = [];

  public function cartItem()
  {
    return $this->belongsTo(CartItem::class, 'cart_item_id', 'id');
  }
}
