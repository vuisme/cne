<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Backend\BlockWords;
use App\Models\Content\Product;
use App\Models\Content\SearchLog;
use App\Models\Content\Taxonomy;
use App\Repositories\Backend\CatalogRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Validator;

class CatalogController extends Controller
{
  public $catalogRepository;

  public function __construct(CatalogRepository $catalogRepository)
  {
    $this->catalogRepository = $catalogRepository;
  }

  public function categories(Request $request)
  {
    $categories = $this->catalogRepository->frontendList($request);
    return response($categories);
  }



  public function getSectionProducts()
  {
    $section = request('section');
    if ($section) {
      $_query_type = $section . '_query_type';
      $_query_url = $section . '_query_url';
      $_query_limit = $section . '_query_limit';
      $type = get_setting($_query_type);
      $url = get_setting($_query_url);
      $limit = get_setting($_query_limit, 50);
      $products = [];
      if ($type == 'cat_query') {
        $products = sectionGetCategoryProducts($url, $limit);
      } elseif ($type == 'search_query') {
        $products = sectionGetSearchProducts($url, $limit);
      }
      return response([
        '$url' => $url,
        'products' => json_encode($products)
      ]);
    }

    return response([
      'products' => json_encode([])
    ]);
  }

  public function categoryProducts($cat_slug)
  {
    $page = request('page', 0);
    $offset = $page * 36;
    $limit = 36;
    $taxonomy = Taxonomy::where('slug', $cat_slug)->whereNotNull('active')->first();
    if (!$taxonomy) {
      return response(['status' => false, 'products' => '', 'msg' => 'Category not found!'], 417);
    }
    if ($taxonomy->ProviderType === 'Taobao') {
      $otc_id = $taxonomy->otc_id;
      $products = get_category_browsing_items($otc_id, 'category', $offset, $limit);
    } else {
      $keyword = $taxonomy->keyword ? $taxonomy->keyword : $taxonomy->name;
      $products = get_category_browsing_items($keyword, 'text', $offset, $limit);
    }
    return response([
      'products' => json_encode($products),
    ]);
  }

  public function searchProcess()
  {
    $text = request('search');
    if (!$text) {
      return $this->success([], 'Search text must not empty', 417);
    }
    $search_type = 'text';
    if (request()->hasFile('search')) {
      $search_type = 'picture';
    }
    $log = SearchLog::create([
      'search_id' => Str::random(30),
      'search_type' => $search_type,
      'query_data' => $text,
      'user_id' => auth()->check() ? auth()->id() : null
    ]);

    return $this->success([
      'search_id' => $log->search_id ?? ''
    ]);
  }

  public function getSearchResult()
  {
    $keyword = request('keyword');

    if ($keyword) {
      $lowerCase = Str::lower($keyword);
      $block = BlockWords::where('word', $lowerCase)
        ->orWhere('sentence', 'like', "% {$keyword} %")
        ->orWhere('sentence', 'like', "% {$keyword}%")
        ->orWhere('sentence', 'like', "%{$keyword} %")
        ->first();
      if ($block) {
        return response([
          'block' => true,
          'products' => json_encode(['block' => true])
        ]);
      }
    }
    $page = request('page', 1);
    $limit = request('limit', 30);
    $offset = $page > 0 ? $limit * ($page - 1) : 0;
    $products = null;
    if ($keyword) {
      $keyword = str_replace('&page=0', '', $keyword);
      $products = get_category_browsing_items($keyword, 'text', $offset, $limit);
      if (!empty($products)) {
        SearchLog::updateOrInsert(
          ['query_data' => $keyword, 'search_type' => 'text'],
          [
            'search_id' => Str::random(30),
            'user_id' => auth('sanctum')->check() ? auth('sanctum')->id() : null,
            'created_at' => now(),
            'updated_at' => now()
          ],
        );
      }
    }

    return response([
      'products' => json_encode($products)
    ]);
  }

  public function searchSuggestion()
  {
    $keyword = request('keyword');

    $suggestion = SearchLog::where('search_type', 'text')
      ->where('query_data', 'like', "%$keyword%")
      ->orWhere('query_data', 'like', "% $keyword%")
      ->orWhere('query_data', 'like', "% $keyword %")
      ->orWhere('query_data', 'like', "%$keyword %")
      ->select('query_data')
      ->latest();
    if (auth('sanctum')->check()) {
      $suggestion = $suggestion->where('user_id', auth('sanctum')->id());
    }
    $suggestion = $suggestion->limit(4)->get();

    return response([
      'suggestion' => $suggestion
    ]);
  }

  public function getPictureSearchResult($search_id)
  {
    $page = request('page', 1);
    $page = $page > 0 ? ($page - 1) : 0;
    $offset = $page * 30;
    $limit = 30;
    $SearchLog = SearchLog::where('search_id', $search_id)->where('search_type', 'picture')->first();
    if ($SearchLog) {
      $products = get_category_browsing_items($SearchLog->query_data, 'picture', $offset, $limit);
      return response([
        'products' => json_encode($products)
      ]);
    }
    return response([
      'products' => [],
    ]);
  }

  public function searchPicture()
  {
    $validator = Validator::make(request()->all(), [
      'picture' => 'required|max:8000|mimes:jpeg,jpg,png,webp,gif',
    ]);
    if ($validator->fails()) {
      return response(['status' => false, 'errors' => $validator->errors()], 422);
    }
    $search = '';
    if (request()->hasFile('picture')) {
      $file = request()->file('picture');
      $saveDirectory = 'search/' . date('Y-m');
      $search = store_search_picture($file, $saveDirectory, time());
      $search_id = Str::random(30);
      $log = SearchLog::create([
        'search_id' => $search_id,
        'search_type' => 'picture',
        'query_data' => asset($search),
        'user_id' => auth()->check() ? auth()->id() : null,
      ]);

      return response([
        'picture' => asset($search),
        'search_id' => $search_id,
      ]);
    }

    return $this->error('Picture upload fails! Try again', 417);
  }

  public function SearchVendorItems()
  {
    $vendor_id = request('seller_id');
    $page = request('page', 1);
    $page = $page ? $page - 1 : 0;
    $offset = $page * 30;
    $limit = 30;
    $products = get_vendor_items($vendor_id, $offset, $limit);
    if (!empty($products) && is_array($products)) {
      $TotalCount = getArrayKeyData($products, 'TotalCount', 0);
      $Contents = getArrayKeyData($products, 'Content', []);
      if (!empty($Contents) && is_array($Contents)) {
        $Contents = generate_common_params($Contents);
        if (!empty($Contents) && is_array($Contents)) {
          return response([
            'result' => json_encode([
              'TotalCount' => $TotalCount,
              'Content' => $Contents
            ])
          ]);
        }
      }
    }

    return response([
      'result' => ''
    ]);
  }

  public function productDetails($item_id)
  {
    $item = GetItemFullInfoWithDeliveryCosts($item_id);
    if (!empty($item)) {
      $title = $item['Title'] ?? "";
      $titleArray = BlockWords::pluck('word')->toArray();

      $hasBlock = false;
      if (count($titleArray)) {
        for ($i = 0; $i < count($titleArray); $i++) {
          $word = $titleArray[$i];
          if ((strpos($title, $word) !== false)) {
            $hasBlock = true;
            break;
          }
        }
      }

      if ($hasBlock) {
        return response([
          'status' => false,
          'item' => []
        ]);
      }

      $recent_token = request('recent_view');
      $this->storeProductToDatabase($item, $item_id, $recent_token);
      return response([
        'status' => true,
        'item' => $item
      ]);
    }
    return response(['status' => false, 'msg' => 'Product not found']);
  }


  public function productDescription($item_id)
  {
    $description = getDescription($item_id);
    return response([
      'description' => $description
    ]);
  }


  public function productSellerInfo($VendorId)
  {
    $VendorInfo = getSellerInformation($VendorId);
    return response([
      'result' => $VendorInfo
    ]);
  }


  public function storeProductToDatabase($product, $item_id, $recent_token = null)
  {
    if (is_array($product)) {
      $product_id = key_exists('Id', $product) ? $product['Id'] : 0;
      $PhysicalParameters = key_exists('PhysicalParameters', $product) ? $product['PhysicalParameters'] : [];
      $Price = key_exists('Price', $product) ? $product['Price'] : [];
      $Promotions = key_exists('Promotions', $product) ? $product['Promotions'] : [];
      $Price = checkPromotionalPrice($Promotions, $Price);

      $Pictures = key_exists('Pictures', $product) ? $product['Pictures'] : [];
      $Features = key_exists('Features', $product) ? $product['Features'] : [];
      $VendorId = key_exists('VendorId', $product) ? $product['VendorId'] : '';
      $auth_id = \auth()->check() ? \auth()->id() : null;

      try {
        $test = Product::updateOrInsert(
          ['ItemId' => $item_id, 'VendorId' => $VendorId],
          [
            'active' => now(),
            'ProviderType' => $product['ProviderType'] ?? '',
            'Title' => $product['Title'] ?? '',
            'CategoryId' => key_exists('CategoryId', $product) ? $product['CategoryId'] : '',
            'ExternalCategoryId' => key_exists('ExternalCategoryId', $product) ? $product['ExternalCategoryId'] : '',
            'VendorName' => key_exists('VendorName', $product) ? $product['VendorName'] : '',
            'VendorScore' => key_exists('VendorScore', $product) ? $product['VendorScore'] : '',
            'PhysicalParameters' => json_encode($PhysicalParameters),
            'BrandId' => $product['BrandId'] ?? '',
            'BrandName' => $product['BrandName'] ?? '',
            'TaobaoItemUrl' => key_exists('TaobaoItemUrl', $product) ? $product['TaobaoItemUrl'] : '',
            'ExternalItemUrl' => key_exists('ExternalItemUrl', $product) ? $product['ExternalItemUrl'] : '',
            'MainPictureUrl' => key_exists('MainPictureUrl', $product) ? $product['MainPictureUrl'] : '',
            'Price' => json_encode($Price ?? []),
            'Pictures' => json_encode($Pictures ?? []),
            'Features' => json_encode($Features ?? []),
            'MasterQuantity' => key_exists('MasterQuantity', $product) ? $product['MasterQuantity'] : '',
            'user_id' => $auth_id,
            'recent_view_token' => $recent_token,
            'created_at' => now(),
            'updated_at' => now(),
          ]
        );
      } catch (\Throwable $e) {
        return response(['status' => false, 'message' => $e]);
      }
    }
  }
}
