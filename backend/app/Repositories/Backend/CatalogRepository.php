<?php

namespace App\Repositories\Backend;

use App\Models\Content\Setting;
use App\Models\Content\Taxonomy;
use Illuminate\Http\Request;

/**
 * Class CatalogRepository
 */
class CatalogRepository
{
  private $exists_token;

  public function __construct()
  {
    $this->exists_token = get_setting('update_token');
  }

  public function frontendList(Request $request)
  {
    $old_key = request('refresh_token');
    $has_data = request('has_data');
    $exists_key = $this->exists_token;
    $load = false;
    $categories = [];
    if ($old_key !== $exists_key) {
      $load = true;
    }
    if ($has_data == 'false') {
      $load = true;
    }
    if ($load) {
      $categories = Taxonomy::whereNotNull('active')->withCount('children')->get();
    }

    return [
      'categories' => $categories,
      'refresh_token' => $exists_key,
    ];
  }
}
