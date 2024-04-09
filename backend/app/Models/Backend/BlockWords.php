<?php

namespace App\Models\Backend;

use App\Models\Auth\User;
use Illuminate\Database\Eloquent\Model;

class BlockWords extends Model
{
  protected $table = 'block_words';

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
