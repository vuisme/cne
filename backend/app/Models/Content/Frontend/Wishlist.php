<?php

namespace App\Models\Content\Frontend;

use App\Models\Content\Product;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Wishlist extends Model
{
  use SoftDeletes;

  protected $table = 'wishlists';

  public $primaryKey = 'id';

  public $timestamps = true;

  protected $guarded = [];

  protected $hidden = ['user_id', 'created_at', 'updated_at', 'deleted_at'];

  public function user()
  {
    return $this->belongsTo(User::class);
  }

  public function product()
  {
    return $this->belongsTo(Product::class, 'ItemId', 'ItemId');
  }
}
