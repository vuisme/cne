<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Content\CartItem;
use PHPHtmlParser\Dom;

/**
 * Class HomeController.
 */
class HomeController extends Controller
{
  /**
   * @return \Illuminate\View\View
   */
  public function index()
  {
    // $url = "https://www.aliexpress.com/item/1005003429438833.html";
    // $url2 = "https://a.aliexpress.com/_mq8QLFM";

    // $string = file_get_contents($url2);
    // $dom = new Dom;
    // $dom = $dom->loadStr($string);
    // $html = $dom->find("link[rel=canonical]");
    // $full_url = $html->getAttribute('href');

    // dd($full_url);

    return view('frontend.index');
  }
}
