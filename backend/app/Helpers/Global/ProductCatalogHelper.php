<?php

use App\Models\Content\SearchLog;
use App\Models\Content\Taxonomy;

if (!function_exists('generate_common_params')) {
  function generate_common_params($Contents)
  {
    $generated = [];
    $rate = get_setting('increase_rate', 20);
    foreach ($Contents as $product) {
      $item = [
        'img' => get_product_picture($product) ?? '',
        'name' => $product['Title'] ?? '',
        'product_code' => $product['Id'] ?? '',
        'rating' => $product['rating'] ?? '',
        'regular_price' => get_product_regular_price($product, $rate),
        'sale_price' => get_product_sale_price($product, $rate),
        'stock' => $product['MasterQuantity'] ?? 0,
        'total_sold' => get_features_value($product, 'TotalSales'),
      ];
      array_push($generated, $item);
    }

    return $generated;
  }
}

if (!function_exists('get_product_picture')) {
  function get_product_picture($product)
  {
    $Pictures = array_key_exists('Pictures', $product) ? $product['Pictures'] : [];
    if (!empty($Pictures)) {
      $Pictures = is_array($Pictures) ? $Pictures : (json_decode($Pictures, true) ?? []);
      $Medium = array_key_exists('Medium', $Pictures[0]) ? $Pictures[0]['Medium'] : [];
      return array_key_exists('Url', $Medium) ? $Medium['Url'] : '';
    }
    return '';
  }
}

if (!function_exists('get_product_regular_price')) {
  function get_product_regular_price($product, $rate)
  {
    $Price = is_array($product) ? (array_key_exists('Price', $product) ? $product['Price'] : []) : [];
    if (!empty($Price)) {
      $Price = is_array($Price) ? $Price : (json_decode($Price, true) ?? []);
      $OriginalPrice = array_key_exists('OriginalPrice', $Price) ? $Price['OriginalPrice'] : 0;
      if ($OriginalPrice) {
        return round($OriginalPrice * $rate);
      }
    }
    return 0;
  }
}


if (!function_exists('get_product_sale_price')) {
  function get_product_sale_price($product, $rate)
  {
    $Promotions = array_key_exists('Promotions', $product) ? $product['Promotions'] : [];
    if (!empty($Promotions)) {
      $PromoPrice = array_key_exists('Price', $Promotions[0]) ? $Promotions[0]['Price'] : [];
      $OriginalPrice = array_key_exists('OriginalPrice', $PromoPrice) ? $PromoPrice['OriginalPrice'] : 0;
      if ($OriginalPrice) {
        return round($OriginalPrice * $rate);
      }
    }
    $PromotionPrice = array_key_exists('PromotionPrice', $product) ? $product['PromotionPrice'] : [];
    if (!empty($PromotionPrice)) {
      $OriginalPrice = array_key_exists('OriginalPrice', $PromotionPrice) ? $PromotionPrice['OriginalPrice'] : 0;
      if ($OriginalPrice) {
        return round($OriginalPrice * $rate);
      }
    }


    $Price = array_key_exists('Price', $product) ? $product['Price'] : [];
    if (!empty($Price)) {
      $Price = is_array($Price) ? $Price : (json_decode($Price, true) ?? []);
      $OriginalPrice = array_key_exists('OriginalPrice', $Price) ? $Price['OriginalPrice'] : 0;
      if ($OriginalPrice) {
        return round($OriginalPrice * $rate);
      }
    }

    return 0;
  }
}

if (!function_exists('get_features_value')) {
  function get_features_value($product, $key)
  {
    $FeaturedValues = array_key_exists('FeaturedValues', $product) ? $product['FeaturedValues'] : [];
    if (!empty($FeaturedValues)) {
      $FeaturedValues = collect($FeaturedValues)->where('Name', $key)->first();
      if ($FeaturedValues) {
        return $FeaturedValues['Value'] ?? '0';
      }
    }
    return 0;
  }
}


if (!function_exists('generate_browsing_key')) {
  function generate_browsing_key($key)
  {
    $slugKey = Str::slug($key);
    return $slugKey . '_' . md5($key);
  }
}


if (!function_exists('get_browsing_data')) {
  function get_browsing_data($key, $array = false, $fullPath = false)
  {
    $key = generate_browsing_key($key);
    $path = $fullPath ? $key : "browsing/{$key}.json";
    $existsFile = Storage::exists($path);

    if ($array) {
      if ($existsFile) {
        return json_decode(Storage::get($path), true) ?? [];
      }
      return [];
    }

    if ($existsFile) {
      return collect(json_decode(Storage::get($path), true));
    }

    return collect([]);
  }
}

if (!function_exists('store_browsing_data')) {
  function store_browsing_data($key, $data)
  {
    $path = "browsing/{$key}.json";
    Storage::put($path, json_encode($data));
  }
}


if (!function_exists('get_category_browsing_items')) {
  function get_category_browsing_items($keyword, $type, $offset, $limit)
  {
    if ($type == 'category') {
      $products = otc_category_items($keyword, $offset, $limit);
    } elseif ($type == 'text') {
      $products = otc_search_items($keyword, "text", $offset, $limit);
    } elseif ($type == 'picture') {
      $products = otc_search_items($keyword, "picture", $offset, $limit);
    }
    if (!empty($products) && is_array($products)) {
      $TotalCount = getArrayKeyData($products, 'TotalCount', 0);
      $Contents = getArrayKeyData($products, 'Content', []);
      if (!empty($Contents) && is_array($Contents)) {
        $Contents = generate_common_params($Contents);
        if (!empty($Contents) && is_array($Contents)) {
          return [
            'TotalCount' => $TotalCount,
            'Content' => $Contents
          ];
        }
      }
    }
    return ['Content' => [], 'TotalCount' => 0];
  }
}


if (!function_exists('sectionGetCategoryProducts')) {
  function sectionGetCategoryProducts($url, $limit = 50, $offset = 0)
  {
    $hasData = cache()->get($url, null);
    if ($hasData) {
      return $hasData;
    }
    $cat = explode('?', $url);
    $slug_name = str_replace('/', '', $cat[0]);
    $products = [];
    if (count($cat) > 0) {
      $offset = str_replace('page=', '', $cat[1]);
      $offset = $offset > 0 ? $offset * 32 : 0;
    }
    if ($slug_name) {
      $category = Taxonomy::where('slug', $slug_name)->first();
      if ($category) {
        if ($category->ProviderType == 'Taobao') {
          $products = get_category_browsing_items($category->otc_id, 'category', $offset, $limit);
        } else {
          $keyword = $category->keyword ? $category->keyword : $category->name;
          $products = get_category_browsing_items($keyword, 'text', $offset, $limit);
        }
      }
    }

    cache()->put($url, $products, 21600); // 21600 seconds as 6 hours

    return $products;
  }
}

if (!function_exists('sectionGetSearchProducts')) {
  function sectionGetSearchProducts($url, $limit = 35, $offset = 0)
  {
    $cat = explode('&', $url);
    $slug_name = $cat[0] ?? '';
    $products = [];
    if (count($cat) > 0) {
      $page = isset($cat[1]) ? str_replace('page=', '', $cat[1]) : 0;
      $offset = $offset > 0 ? $page * $limit : 0;
    }
    if ($slug_name) {
      $log = SearchLog::where('search_id', $slug_name)
        ->where('search_type', 'picture')
        ->first();
      $keyword = $slug_name;
      $type = 'text';
      if ($log) {
        $keyword = $log->query_data;
        $type = 'picture';
      }
      $products = get_category_browsing_items($keyword, $type, $offset, $limit);
    }
    return $products;
  }
}
