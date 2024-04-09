<?php

namespace App\Models\Content;

use App\Models\Auth\User;
use App\Models\Backend\OrderTracking;
use App\Models\Backend\OrderTrackingExceptional;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class OrderItem extends Model
{
  use SoftDeletes;

  protected $table = 'order_items';

  public $primaryKey = 'id';

  public $timestamps = true;

  protected $guarded = [];

  public function user()
  {
    return $this->belongsTo(User::class, 'user_id', 'id');
  }

  public function order()
  {
    return $this->belongsTo(Order::class, 'order_id', 'id');
  }

  public function product()
  {
    return $this->belongsTo(Product::class, 'product_id', 'id');
  }

  public function itemVariations()
  {
    return $this->hasMany(OrderItemVariation::class, 'item_id', 'id');
  }

  public function orderTracking()
  {
    return $this->hasMany(OrderTracking::class, 'order_item_id', 'id');
  }

  public function trackingExceptional()
  {
    return $this->hasMany(OrderTrackingExceptional::class, 'order_item_id', 'id');
  }

  public function invoice()
  {
    return $this->hasOne(InvoiceItem::class, 'order_item_id', 'id');
  }
}
