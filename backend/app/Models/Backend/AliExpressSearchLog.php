<?php

namespace App\Models\Backend;

use Illuminate\Database\Eloquent\Model;

class AliExpressSearchLog extends Model
{

  protected $table = 'ali_express_search_logs';

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
}
