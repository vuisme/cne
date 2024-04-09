<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Auth\User;
use App\Models\Content\Contact;
use App\Models\Content\Frontend\CustomerCart;
use App\Models\Content\Frontend\Wishlist;
use App\Models\Content\Post;
use App\Models\Content\Product;
use App\Notifications\Backend\ContactInformation;
use App\Repositories\Frontend\Settings\SettingRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;
use Validator;

class GeneralController extends Controller
{

  private $setting;

  public function __construct(SettingRepository $setting)
  {
    $this->setting = $setting;
  }

  public function verify(Request $request)
  {
    $userID = $request['id'];
    $user = User::find($userID);
    if (!$user) {
      return response(['msg' => "Email not verified!"]);
    }
    $user->email_verified_at = now();
    $user->confirmed = 1;
    $user->save();
    return response(['msg' => "Email verified!"]);
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


  public function banners(Request $request)
  {
    $data = $this->setting->banners($request);
    return response($data);
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
      ->limit(30)
      ->get();
    return $this->success([
      'lovingProducts' => json_encode($lists)
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
      ->limit(10)
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


    return $this->success([
      'relatedProducts' => json_encode($products)
    ]);
  }


  public function generalSettings(Request $request)
  {
    $data = $this->setting->list($request);
    return response($data);
  }

  public function faqPages()
  {
    $faqs = Post::where('post_status', 'publish')
      ->where('post_type', 'faq')
      ->get();
    return response([
      'faqs' => $faqs
    ]);
  }

  public function singlePages($slug)
  {
    $singles = Post::where('post_status', 'publish')
      ->where('post_type', 'page')
      ->where('post_slug', $slug)
      ->first();
    return response([
      'singles' => $singles
    ]);
  }


  public function contactUs()
  {
    $contact = Post::where('post_status', 'publish')
      ->where('post_type', 'page')
      ->where('id', 1)
      ->first();
    return response([
      'contact' => $contact
    ]);
  }


  public function contactMessageSend()
  {
    $validator = Validator::make(request()->all(), [
      'name' => 'required|string|max:191',
      'phone' => 'required|string|max:12',
      'email' => 'required|string|max:191',
      'subject' => 'required|string|max:191',
      'message' => 'required|string|max:600',
    ]);
    if ($validator->fails()) {
      return response(['status' => false, 'errors' => $validator->errors()]);
    }
    $users = User::role(['administrator'])->get();
    DB::transaction(function () use ($users) {
      $contact = Contact::create([
        'name' => request('name'),
        'phone' => request('phone'),
        'email' => request('email'),
        'message' => request('message'),
        'status' => 'contact',
      ]);
      Notification::send($users, new ContactInformation($contact));
    });
    return response(['status' => true, 'msg' => 'Your message send successfully']);
  }
}
