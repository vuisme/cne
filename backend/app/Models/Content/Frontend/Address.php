<?php

namespace App\Models\Content\Frontend;

use App\Models\Auth\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Address extends Model
{
  use SoftDeletes;

  protected $table = 'addresses';

  public $primaryKey = 'id';

  public $timestamps = true;

  protected $guarded = [];

  protected $hidden = [
    'area_id', 'user_id', 'created_at', 'updated_at', 'deleted_at'
  ];

  public function user()
  {
    return $this->belongsTo(User::class);
  }
}
