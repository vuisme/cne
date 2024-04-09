<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Auth\User;
use App\Models\Content\Frontend\CustomerCart;
use App\Models\Content\Frontend\Wishlist;
use App\Models\Content\Post;
use App\Models\Content\Product;
use App\Repositories\Frontend\HomeRepository;
use Illuminate\Http\Request;

class HomeController extends Controller
{

  public $homeRepository;

  public function __construct(HomeRepository $homeRepository)
  {
    $this->homeRepository = $homeRepository;
  }

  public function verify(Request $request)
  {
    $userID = $request['id'];
    $user = User::findOrFail($userID);
    $user->email_verified_at = now(); // to enable the “email_verified_at field of that user be a current time stamp by mimicing the must verify email feature
    $user->confirmed = 1; // to enable the “email_verified_at field of that user be a current time stamp by mimicing the must verify email feature
    $user->save();
    return response()->json("Email verified!");
  }


  public function resend(Request $request)
  {
    if ($request->user()->hasVerifiedEmail()) {
      return response()->json("User already have verified email!", 422);
      // return redirect($this->redirectPath());
    }
    $request->user()->sendEmailVerificationNotification();
    return response()->json("The notification has been resubmitted");
    // return back()->with(‘resent’, true);
  }


  public function banners()
  {
    $banners = Post::where('post_type', 'banner')->where('post_status', 'publish')->limit(5)->latest()->get();

    return $this->success([
      'banners' => $banners
    ]);
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
      return $this->success([
        'products' => json_encode($products)
      ]);
    }

    return $this->success([
      'products' => json_encode([])
    ]);
  }

  public function lovingProducts()
  {
    $lists = Wishlist::with('product')
      ->latest()
      ->limit(10)
      ->get();
    return response([
      'products' => json_encode($lists)
    ]);
  }

  public function buyingProducts()
  {
    $buyingProducts = CustomerCart::withTrashed()->with('product')->select('ItemId')->groupBy('ItemId')->latest()->get();

    return $this->success([
      'buyingProducts' => $buyingProducts
    ]);
  }

  public function recentProducts()
  {
    $products = Product::whereNotNull('active')
      ->select('ItemId', 'ProviderType', 'Title', 'BrandName', 'MainPictureUrl', 'Price', 'Pictures', 'Features', 'MasterQuantity')
      ->latest()
      ->limit(20)
      ->get();
    return $this->success([
      'recentProducts' => json_encode($products)
    ]);
  }


  public function relatedProducts($item_id)
  {
    $product = Product::where('ItemId', $item_id)->first();
    $products = [];
    if ($product) {
      $CategoryId = $product->CategoryId;
      $products = Product::where('CategoryId', $CategoryId)
        ->where('ItemId', '!=', $item_id)
        ->select('ItemId', 'ProviderType', 'Title', 'BrandName', 'MainPictureUrl', 'Price', 'Pictures', 'Features', 'MasterQuantity')
        ->latest()
        ->limit(20)
        ->get();
    }

    if (!empty($products)) {
      $products = Product::where('ItemId', '!=', $item_id)
        ->select('ItemId', 'ProviderType', 'Title', 'BrandName', 'MainPictureUrl', 'Price', 'Pictures', 'Features', 'MasterQuantity')
        ->latest()
        ->limit(20)
        ->get();
    }

    return response([
      'relatedProducts' => json_encode($products)
    ]);
  }

  public function newArrivedProducts(Request $request)
  {
    $data = $this->homeRepository->getArrivedProducts($request);
    return response($data);
  }

  public function recentViewProducts(Request $request)
  {
    $data = $this->homeRepository->getRecentViewProducts($request);
    return response($data);
  }

  public function newFavoriteProducts(Request $request)
  {
    $data = $this->homeRepository->getFavoriteProducts($request);
    return response($data);
  }


  public function generalSettings()
  {
    return $this->success([
      'general' => json_encode(general_settings())
    ]);
  }

  public function faqPages()
  {
    $faqs = Post::where('post_status', 'publish')
      ->where('post_type', 'faq')
      ->get();
    return $this->success([
      'faqs' => $faqs
    ]);
  }

  public function contactUs()
  {
    $contact = Post::where('post_status', 'publish')
      ->where('post_type', 'page')
      ->where('id', 1)
      ->first();
    return $this->success([
      'contact' => $contact
    ]);
  }

  public function singlePages($slug)
  {
    $singles = Post::where('post_status', 'publish')
      ->where('post_type', 'page')
      ->where('post_slug', $slug)
      ->first();
    return $this->success([
      'singles' => $singles
    ]);
  }
}
