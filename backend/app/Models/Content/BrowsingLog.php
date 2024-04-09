<?php

namespace App\Models\Content;

use App\Models\Auth\User;
use Illuminate\Database\Eloquent\Model;

class BrowsingLog extends Model
{
     protected $table = 'browsing_logs';

    public $primaryKey = 'id';

    public $timestamps = true;

    protected $guarded = [];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
