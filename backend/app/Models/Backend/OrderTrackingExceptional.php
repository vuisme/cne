<?php

namespace App\Models\Backend;

use App\Models\Auth\User;
use App\Models\Content\OrderItem;
use Illuminate\Database\Eloquent\Model;

class OrderTrackingExceptional extends Model
{
  protected $table = 'order_tracking_exceptional';

  public $primaryKey = 'id';

  public $timestamps = true;

  protected $guarded = [];

  protected $dates = [
    'created_at',
    'updated_at'
  ];

  public function user()
  {
    return $this->belongsTo(User::class);
  }

  public function orderItem()
  {
    return $this->belongsTo(OrderItem::class, 'order_item_id', 'id');
  }
}
