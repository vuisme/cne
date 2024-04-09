<?php

namespace App\Repositories\Frontend\Settings;

use App\Models\Content\Post;
use App\Models\Content\Setting;
use Illuminate\Support\Str;

class SettingRepository
{

  private $exists_token;

  public function __construct()
  {
    $this->exists_token = get_setting('update_token');
  }

  public function update_key()
  {
    $update_token = Str::random(60);
    Setting::save_settings([
      'update_token' => $update_token
    ]);
    return true;
  }

  public function list($request)
  {
    $old_key = request('refresh_token');
    $has_data = request('has_data');
    $exists_key = $this->exists_token;
    $load = false;
    $settings = [];
    if ($old_key !== $exists_key) {
      $load = true;
    }
    if ($has_data == 'false') {
      $load = true;
    }
    if ($load) {
      $settings = Setting::whereNotNull('active')->pluck('value', 'key')->toArray();
    }

    return [
      'settings' => $settings,
      'refresh_token' => $exists_key,
    ];
  }

  public function banners($request)
  {
    $old_key = request('refresh_token');
    $has_data = request('has_data');
    $exists_key = $this->exists_token;
    $load = false;
    $banners = [];
    if ($old_key !== $exists_key) {
      $load = true;
    }
    if ($has_data == 'false') {
      $load = true;
    }
    if ($load) {
      $banners = Post::where('post_type', 'banner')
        ->where('post_status', 'publish')
        ->limit(6)
        ->latest()
        ->get();
    }

    return [
      'banners' => $banners,
      'refresh_token' => $exists_key,
    ];
  }
}
