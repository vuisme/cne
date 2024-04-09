<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Backend\AliExpressSearchLog;
use App\Models\Content\CartItem;
use App\Models\Content\Product;
use App\Traits\AliexpressApi;
use App\Traits\ApiResponser;
use Exception;
use PHPHtmlParser\Dom;

/**
 * Class HomeController.
 */
class AliExpressApiController extends Controller
{
  use ApiResponser, AliexpressApi;


  public function generate_uid($req_query)
  {
    return md5($req_query);
  }

  public function search_log_product_id($req_query)
  {
    $uid = $this->generate_uid($req_query);
    $query = AliExpressSearchLog::where('uid', $uid)->first();
    return $query ? $query->product_id : null;
  }


  public function store_product_id_to_search_log($req_query, $product_id)
  {
    $uid = $this->generate_uid($req_query);
    return AliExpressSearchLog::create([
      'uid' => $uid,
      'product_id' => $product_id,
      'search_url' => $req_query,
      'user_id' => auth()->check() ? auth()->id() : null,
    ]);
  }
  public function checkIdInLink($link)
  {
    $checking = explode("?", $link);
    $checking = $checking[0] ?? null;
    $checking = $checking ? explode('/', $checking) : [];
    $checking = count($checking) == 5 ? end($checking) : null;
    $product_id = $checking ? str_replace('.html', '', $checking) : null;
    if (!$product_id) {
      $link = explode('/', $link);
      $link = count($link) == 5 ? end($link) : null;
      $product_id = $link ? str_replace('.html', '', $link) : null;
    }
    return $product_id;
  }


  public function searchQuery()
  {
    $req_query = request('search');
    if (!$req_query) {
      return response(['status' => false, 'product_id' => '', 'msg' => 'Search result not found']);
    }
    $product_id = $this->search_log_product_id($req_query);
    if (!$product_id) {
      $product_id = $this->checkIdInLink($req_query);
      if (!$product_id) {
        try {
          $query = explode(" ", $req_query);
          $query = count($query) > 3 ? end($query) : $req_query;
          $htmlContents = file_get_contents($query);
          $dom = new Dom;
          $dom = $dom->loadStr($htmlContents);
          $html = $dom->find("link[rel=canonical]");
          $link = $html->getAttribute('href') ?? '';
          $product_id = $this->checkIdInLink($link);
        } catch (Exception $ex) {
          $product_id = null;
        }
      }
    }

    return response([
      'status' =>  $product_id ? true : false,
      'product_id' => $product_id,
      'msg' => !$product_id ? 'Your searching is not valid more' : ''
    ]);
  }

  public function productInfo($product_id)
  {
    $rapid = cache()->get($product_id, null);
    if (!$rapid) {
      $rapid = $this->ApiProductDetails($product_id);
      cache()->put($product_id, $rapid, now()->addMinutes(10));
    }
    $item['item'] = $rapid['result']['item'] ?? [];
    $item['delivery'] = $rapid['result']['delivery'] ?? [];
    $item['seller'] = $rapid['result']['seller'] ?? [];

    $num_iid = $item['item']['num_iid'] ?? null;
    if ($num_iid) {
      $this->updateOrInsertAliProducts($item);
    }
    return response([
      'result' => json_encode($item)
    ]);
  }

  public function priceSeparation($promo_price)
  {
    $promo_price = $promo_price ? explode(' - ', $promo_price) : [];
    $min_promo_price = $promo_price[0] ?? null;
    $max_promo_price = end($promo_price) ?? null;
    return [
      'min' => $min_promo_price < 0.1 ? null : $min_promo_price,
      'max' => $max_promo_price < 0.1 ? null : $max_promo_price,
    ];
  }

  public function updateOrInsertAliProducts($item)
  {
    $product = getArrayKeyData($item, 'item');
    $seller = getArrayKeyData($item, 'seller');
    $recent_token = request('recent_view');
    $promo_price = $product['promotion_price'] ?? null;
    $promo_price = $this->priceSeparation($promo_price);
    $price = $product['price'] ?? null;
    $price = $this->priceSeparation($price);
    $price = [
      'min_promo_price' => $promo_price['min'] ?? null,
      'max_promo_price' => $promo_price['max'] ?? null,
      'min_price' => $price['min'] ?? null,
      'max_price' => $price['max'] ?? null,
    ];
    try {
      $test = Product::updateOrInsert(
        [
          'ItemId' => getArrayKeyData($product, 'num_iid'),
          'ProviderType' => 'aliexpress'
        ],
        [
          'active' => now(),
          'Title' => getArrayKeyData($product, 'title'),
          'CategoryId' => null,
          'ExternalCategoryId' => null,
          'VendorName' => $seller['shop_title'] ?? '',
          'VendorId' => $seller['seller_id'] ?? '',
          'VendorScore' => $seller['rating'] ?? '',
          'PhysicalParameters' => null,
          'BrandId' => $product['BrandId'] ?? '',
          'BrandName' => $product['BrandName'] ?? '',
          'TaobaoItemUrl' => $product['product_url'] ?? null,
          'ExternalItemUrl' => null,
          'MainPictureUrl' => $product['images'][0] ?? null,
          'Price' => json_encode($price),
          'Pictures' => json_encode($product['images'] ?? []),
          'Features' => null,
          'MasterQuantity' => $product['stock'] ?? null,
          'user_id' => auth()->check() ? auth()->id() : null,
          'recent_view_token' => $recent_token,
          'created_at' => now(),
          'updated_at' => now(),
        ]
      );
    } catch (\Throwable $e) {
      return response(['status' => false, 'message' => $e]);
    }
  }



  public function sellerProducts()
  {
    $seller_id = request('seller_id');
    $page = request('page', 1);
    $limit = request('limit', 35);

    $rapid = cache()->get($seller_id, null);
    // $rapid = null;
    if (!$rapid) {
      $rapid = $this->ApiSellerProducts($seller_id, $page, $limit);
      cache()->put($seller_id, $rapid, now()->addMinutes(10));
    }
    $item['item'] = $rapid['result']['items'] ?? [];
    $item['base'] = $rapid['result']['base'] ?? [];

    return response([
      'result' => json_encode($item)
    ]);
  }




  public function relatedProducts($product_id)
  {
    $products = Product::latest()->limit(20)->get();
    return response([
      'result' => json_encode($products)
    ]);
  }
}
