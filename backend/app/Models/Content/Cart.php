<?php

namespace App\Models\Content;

use App\Models\Auth\User;
use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
  protected $table = 'carts';

  public $primaryKey = 'id';

  public $timestamps = true;

  protected $guarded = [];

  public function user()
  {
    return $this->belongsTo(User::class);
  }

  public function cartItems()
  {
    return $this->hasMany(CartItem::class, 'cart_id', 'id');
  }

  public function variations()
  {
    return $this->hasMany(CartItemVariation::class, 'cart_id', 'id');
  }
}
