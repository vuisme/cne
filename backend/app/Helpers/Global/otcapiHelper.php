<?php

use GuzzleHttp\Client;


if (!function_exists('load_otc_api')) {
  function load_otc_api()
  {
    $base_url = get_setting('mybd_api_url', 'https://www.mybdstore.com');
    return new Client([
      'base_uri' => $base_url . '/api/v1/',
      // 'timeout' => 8.0
    ]);
  }
}

if (!function_exists('setOtcParams')) {
  function setOtcParams()
  {
    return [
      'api_token' => get_setting('mybd_api_token')
    ];
  }
}

if (!function_exists('getArrayKeyData')) {
  function getArrayKeyData($array, $key, $default = null)
  {
    if (is_array($array)) {
      return array_key_exists($key, $array) ? $array[$key] : $default;
    }
    return $default;
  }
}


if (!function_exists('GetThreeLevelRootCategoryInfoList')) {
  function GetThreeLevelRootCategoryInfoList()
  {
    // GetThreeLevelRootCategoryInfoList()
    $query = setOtcParams();
    $response = load_otc_api()->request('GET', 'GetThreeLevelRootCategoryInfoList', ['query' => $query]);
    $statusCode = $response->getStatusCode();
    if ($statusCode == 200) {
      $content = json_decode($response->getBody(), true);
      if (is_array($content)) {
        $CategoryInfoList = array_key_exists('CategoryInfoList', $content) ? $content['CategoryInfoList'] : [];
        if (is_array($CategoryInfoList)) {
          return array_key_exists('Content', $CategoryInfoList) ? $CategoryInfoList['Content'] : [];
        }
      }
    }
    return [];
  }
}


if (!function_exists('otc_category_items')) {
  function otc_category_items($cat_id, $offset = 0, $limit = 50)
  {
    // otc_category_items('otc-214', 0, 1)
    $query = setOtcParams();
    $query['categoryId'] = $cat_id;
    $query['framePosition'] = $offset;
    $query['frameSize'] = $limit;

    $response = load_otc_api()->request('GET', 'GetCategoryItemInfoListFrame', ['query' => $query]);

    $statusCode = $response->getStatusCode();
    if ($statusCode == 200) {
      $content = json_decode($response->getBody(), true);
      if (is_array($content)) {
        return array_key_exists('OtapiItemInfoSubList', $content) ? $content['OtapiItemInfoSubList'] : [];
      }
    }
    return ['Content' => [], 'TotalCount' => 0];
  }
}


if (!function_exists('otc_search_items')) {
  function otc_search_items($search, $type, $offset = 1, $limit = 24)
  {
    // otc_search_items('bag', 'text', 0, 5)
    parse_str(parse_url($search, PHP_URL_QUERY), $search_array);
    $data_id = key_exists('id', $search_array) ? $search_array['id'] : null;
    $search = $data_id ? "https://item.taobao.com/item.htm?id={$data_id}" : $search;
    $query = setOtcParams();
    $query['type'] = $type;
    $query['search'] = $search;
    $query['framePosition'] = $offset;
    $query['frameSize'] = $limit;
    $response = load_otc_api()->request('GET', 'SearchItemsFrame', ['query' => $query]);

    $statusCode = $response->getStatusCode();
    if ($statusCode == 200) {
      $body = json_decode($response->getBody(), true);
      $result = getArrayKeyData($body, 'Result', []);
      $Items = getArrayKeyData($result, 'Items', []);
      $Content = getArrayKeyData($Items, 'Content', []);
      $TotalCount = getArrayKeyData($Items, 'TotalCount', 0);
      return ['Content' => $Content, 'TotalCount' => $TotalCount];
    }
    return ['Content' => [], 'TotalCount' => 0];
  }
}




if (!function_exists('get_vendor_items')) {
  function get_vendor_items($vendor_id, $offset = 1, $limit = 24)
  {
    $query = setOtcParams();
    $query['VendorId'] = $vendor_id;
    $query['framePosition'] = $offset;
    $query['frameSize'] = $limit;
    $response = load_otc_api()->request('GET', 'SearchVendorItems', ['query' => $query]);
    $statusCode = $response->getStatusCode();
    if ($statusCode == 200) {
      $body = json_decode($response->getBody(), true);
      $result = getArrayKeyData($body, 'Result', []);
      $Items = getArrayKeyData($result, 'Items', []);
      $Content = getArrayKeyData($Items, 'Content', []);
      $TotalCount = getArrayKeyData($Items, 'TotalCount', 0);
      return ['Content' => $Content, 'TotalCount' => $TotalCount];
    }
    return ['Content' => [], 'TotalCount' => 0];
  }
}


if (!function_exists('otc_items_full_info')) {
  function otc_items_full_info($item_id)
  {
    //otc_items_full_info('520672721526')
    $query = setOtcParams();
    $query['itemId'] = $item_id;
    $response = load_otc_api()->request('get', 'GetItemFullInfo', ['query' => $query]);

    if ($response->getStatusCode() == 200) {
      $body = json_decode($response->getBody(), true);
      if (is_array($body)) {
        return array_key_exists('OtapiItemFullInfo', $body) ? $body['OtapiItemFullInfo'] : [];
      }
    }
    return [];
  }
}


if (!function_exists('GetItemFullInfoWithDeliveryCosts')) {
  function GetItemFullInfoWithDeliveryCosts($item_id)
  {
    //GetItemFullInfoWithDeliveryCosts('520672721526')
    $query = setOtcParams();
    $query['itemId'] = $item_id;
    $response = load_otc_api()->request('GET', 'GetItemFullInfoWithDeliveryCosts', ['query' => $query]);
    if ($response->getStatusCode() == 200) {
      $body = json_decode($response->getBody(), true);
      if (is_array($body)) {
        return key_exists('OtapiItemFullInfo', $body) ? $body['OtapiItemFullInfo'] : [];
      }
    }
    return [];
  }
}

if (!function_exists('getDescription')) {
  function getDescription($item_id)
  {
    //getDescription('555582080064')
    $query = setOtcParams();
    $query['itemId'] = $item_id;
    $response = load_otc_api()->request('get', 'GetItemDescription', ['query' => $query]);

    if ($response->getStatusCode() == 200) {
      $content = json_decode($response->getBody(), true);
      if (is_array($content)) {
        return getArrayKeyData($content, 'ItemDescription', []);
      }
    }
    return [];
  }
}

if (!function_exists('getSellerInformation')) {
  function getSellerInformation($VendorId)
  {
    // getSellerInformation('李宁官方网络旗舰店')
    $query = setOtcParams();
    $query['vendorId'] = $VendorId;

    $response = load_otc_api()->request('get', 'GetVendorInfo', ['query' => $query]);

    if ($response->getStatusCode() == 200) {
      $content = json_decode($response->getBody(), true);
      if (is_array($content)) {
        return getArrayKeyData($content, 'VendorInfo', []);
      }
    }
    return [];
  }
}
