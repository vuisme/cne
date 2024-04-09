<?php

namespace App\Models\Content;

use App\Models\Auth\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;

class Setting extends Model
{

  // use SoftDeletes;

  protected $table = 'settings';

  public $primaryKey = 'id';

  public $timestamps = true;

  protected $guarded = [];

  public function user()
  {
    return $this->belongsTo(User::class);
  }

  public static function get_value($key)
  {
    $setting = self::whereKey($key)->whereNotNull('active')->first();
    return $setting ? $setting->value : null;
  }

  public static function active_setting($active_key)
  {
    self::whereKey($active_key)->update([
      'active' => now(),
      'user_id' => auth()->id(),
    ]);
  }

  public static function save_settings(array $arras)
  {
    foreach ($arras as $key => $value) {
      self::updateOrCreate(
        ['key' => $key],
        [
          'value' => $value,
          'user_id' => auth()->id(),
        ]
      );
    }
  }
}
