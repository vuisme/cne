<?php

namespace App\Repositories\Frontend;

use App\Models\Content\Frontend\Wishlist;
use App\Models\Content\Product;
use Illuminate\Http\Request;

/**
 * Class HomeRepository.
 */
class HomeRepository
{

  public function getArrivedProducts(Request $request)
  {
    $page = request('page', 1);
    $limit = request('limit', 20);
    $page = $page > 0 ? ($page - 1) : 0;
    $offset = $page * $limit;

    $recent = new Product();
    $data['totalPage'] = round($recent->count() / $limit);
    $products = $recent->select('ItemId', 'ProviderType', 'Title', 'BrandName', 'MainPictureUrl', 'Price', 'Pictures', 'Features', 'MasterQuantity')
      ->latest()
      ->offset($offset)
      ->limit($limit)
      ->get();
    $data['products'] = json_encode($products);
    return $data;
  }

  public function getRecentViewProducts(Request $request)
  {
    $recent_token = request('recent_view');
    $page = request('page', 1);
    $limit = request('limit', 20);
    $page = $page > 0 ? ($page - 1) : 0;
    $offset = $page * $limit;

    $recent = new Product();
    $data['totalPage'] = round($recent->where('recent_view_token', $recent_token)->count() / $limit);
    $products = $recent->where('recent_view_token', $recent_token)
      ->select('ItemId', 'ProviderType', 'Title', 'BrandName', 'MainPictureUrl', 'Price', 'Pictures', 'Features', 'MasterQuantity')
      ->latest()
      ->offset($offset)
      ->limit($limit)
      ->get();
    $data['products'] = json_encode($products);
    return $data;
  }

  public function getFavoriteProducts(Request $request)
  {
    $page = request('page', 1);
    $limit = request('limit', 20);
    $page = $page > 0 ? ($page - 1) : 0;
    $offset = $page * $limit;

    $wishlist = new Wishlist();
    $data['totalPage'] = round($wishlist->count() / $limit);
    $products = $wishlist->offset($offset)->limit($limit)->get();
    $data['products'] = json_encode($products);
    return $data;
  }
}
