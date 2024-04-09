<?php

use App\Models\Content\Setting;
use GuzzleHttp\Client;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Facades\Image;

if (!function_exists('app_name')) {
    /**
     * Helper to grab the application name.
     *
     * @return mixed
     */
    function app_name()
    {
        return config('app.name');
    }
}


if (!function_exists('convertedPrice')) {
    /**
     * Helper to grab the application name.
     *
     * @param $original_price
     * @param $rate
     * @return mixed
     */
    function convertedPrice($original_price)
    {
        $rate = get_setting('increase_rate');
        $rate = number_format($original_price * $rate, 2, '.', '');
        return ceil($rate);
    }
}


if (!function_exists('floating')) {
    function floating($price, $length = 0)
    {
        return number_format($price, $length, '.', '');
    }
}


if (!function_exists('checkNull')) {
    function checkNull($null)
    {
        return $null == "NULL" ? NULL : $null;
    }
}


if (!function_exists('get_setting')) {
    /**
     * Helper to grab the application name.
     *
     * @param $key
     * @param null $default
     * @return mixed
     */
    function get_setting($key, $default = null)
    {
        $setting = general_settings();
        if (is_array($setting)) {
            return array_key_exists($key, $setting) ? $setting[$key] : $default;
        } elseif ($setting->isNotEmpty) {
            $setting = general_settings()->where('key', $key)->first();
            return $setting ? $setting->value : $default;
        }
        return $default;
    }
}

if (!function_exists('currency_icon')) {
    /**
     * Helper to grab the application name.
     *
     * @return mixed
     */
    function currency_icon()
    {
        return get_setting('currency_icon');
    }
}


if (!function_exists('general_settings')) {
    /**
     * Helper to grab the application name.
     *
     * @return mixed
     */
    function general_settings($json = false)
    {
        $setting = Cache::get('settings', function () {
            return Setting::whereNotNull('active')->pluck('value', 'key')->toArray();
        });
        // unset($setting["currency_rate"]);
        if ($json) {
            return json_encode($setting);
        }

        return $setting;
    }
}

if (!function_exists('gravatar')) {
    /**
     * Access the gravatar helper.
     */
    function gravatar()
    {
        return app('gravatar');
    }
}

if (!function_exists('home_route')) {
    /**
     * Return the route to the "home" page depending on authentication/authorization status.
     *
     * @return string
     */
    function home_route()
    {
        if (auth()->check()) {
            if (auth()->user()->can('view backend')) {
                return 'admin.dashboard';
            }

            return 'frontend.index';
        }

        return 'frontend.index';
    }
}


if (!function_exists('store_picture')) {
    function store_picture($file, $dir_path = '/', $name = null, $thumb = false, $resize = false)
    {
        $imageName = $name ? $name . '.' . $file->getClientOriginalExtension() : $file->getClientOriginalName();
        $dir_path = 'storage/' . $dir_path;
        $pathDir = create_public_directory($dir_path); // manage directory
        $img = Image::make($file);
        $fileSize = round($img->filesize() / 1024); // convert to kb

        if (!$resize) {
            $img->save($pathDir . '/' . $imageName); // save original photo
        } else {
            $img->resize(1080, null, function ($c) {
                $c->aspectRatio();
            })->save($pathDir . '/' . $imageName, 90); // save converted photo
        }

        if ($thumb) {
            $thumbPathDir = create_public_directory($dir_path . '/thumbs'); // manage thumbs directory
            if ($img->width() > 400 || $fileSize > 150) {
                $img->resize(400, null, function ($c) {
                    $c->aspectRatio();
                })->save($thumbPathDir . '/' . $imageName, 90); // save thumbs photo
            } else {
                $img->save($thumbPathDir . '/' . $imageName, 90); // save thumbs photo
            }
        }

        return $dir_path . '/' . $imageName;
    }
}


if (!function_exists('store_search_picture')) {
    function store_search_picture($file, $dir_path = '/', $prefix='')
    {
        $imageName = $prefix . '.jpg';
        $dir_path = 'storage/' . $dir_path;
        $pathDir = create_public_directory($dir_path); // manage directory
        $img = Image::make($file);

        if ($img->width() >= 800) {
            $resize = $img->resize(800, 800, function ($constraint) {
                $constraint->aspectRatio();
                $constraint->upsize();
            });
        } else {
            $resize = $img->resize(400, 400, function ($constraint) {
                $constraint->aspectRatio();
                $constraint->upsize();
            });
        }
        $resize->save($pathDir . '/' . $imageName, 70); // save converted photo

        return $dir_path . '/' . $imageName;
    }
}


if (!function_exists('create_public_directory')) {
    function create_public_directory($path)
    {
        File::isDirectory(public_path('storage')) ?: Artisan::call('storage:link');
        File::isDirectory(public_path($path)) ?: File::makeDirectory(public_path($path), 0777, true, true);
        return public_path($path);
    }
}

if (!function_exists('store_mixed_picture')) {
    function store_mixed_picture($file, $dir_path = '/')
    {
        $imageName = $file->getClientOriginalName();
        $imageName = strtolower($imageName);
        $imageName = time() . '-' . str_replace(' ', '-', $imageName);
        $dir_path = 'storage/' . $dir_path;
        $pathDir = create_public_directory($dir_path); // manage directory

        $file->move($pathDir, $imageName);

        return $dir_path . '/' . $imageName;
    }
}


if (!function_exists('array_except')) {
    /**
     * @param array $array
     * @param array $keys
     * @return array
     */
    function array_except(array $array, array $keys)
    {
        foreach ($keys as $key) {
            unset($array[$key]);
        }
        return $array;
    }
}

if (!function_exists('clear_upload_location')) {
    /**
     * @param string $post_slug
     * @param int $limit
     * @return string
     */
    function clear_upload_location(string $post_slug, int $limit = 30)
    {
        return str_replace(".", "", Str::limit($post_slug, $limit));
    }
}


if (!function_exists('generate_order_number')) {
    function generate_order_number($id, $prefix = '255', $length = 5)
    {
        return str_pad($id, $length, $prefix, STR_PAD_LEFT);
    }
}


if (!function_exists('sendSSL_WareSMS')) {

    function sendSSL_WareSMS($txt, $phone)
    {
        $messageBody = $txt;
        $msisdn = $phone;
        $csms_id = uniqid();

        return singleSms($msisdn, $messageBody, $csms_id);
    }
}


if (!function_exists('coupon_contribution')) {

    function coupon_contribution($totalAmount, $itemTotal, $itemCoupon)
    {
        if ($totalAmount > 0 & $itemTotal > 0 & $itemCoupon > 0) {
            $percent = ($itemTotal / $totalAmount * 100);
            $getting = ($itemCoupon * $percent / 100);
            return floating($getting);
        }
        return null;
    }
}


if (!function_exists('calculatePromotionalPrice')) {
    function calculatePromotionalPrice($config_id, $Promotions)
    {
        $promoPrice = [];
        if (!empty($Promotions)) {
            for ($n = 0; $n < count($Promotions); $n++) {
                $Promotion = $Promotions[$n];
                if (is_array($Promotion)) {
                    $ConfiguredItems = key_exists('ConfiguredItems', $Promotion) ? $Promotion['ConfiguredItems'] : [];
                    if (!empty($ConfiguredItems)) {
                        $findConfig = collect($ConfiguredItems)->where('Id', $config_id)->first();
                        if ($findConfig) {
                            if (key_exists('Price', $findConfig)) {
                                $promoPrice = $findConfig['Price'];
                                break;
                            }
                        }
                    } else {
                        $Price = key_exists('Price', $Promotion) ? $Promotion['Price'] : [];
                        if (!empty($Price)) {
                            $promoPrice = $Price;
                            break;
                        }
                    }
                }
            }
        }
        return $promoPrice;
    }
}

if (!function_exists('checkPromotionalPrice')) {
    function checkPromotionalPrice($Promotions, $Price)
    {
        $promoPrice = [];
        if (!empty($Promotions)) {
            for ($n = 0; $n < count($Promotions); $n++) {
                $Promotion = $Promotions[$n];
                if (is_array($Promotion)) {
                    $Price = key_exists('Price', $Promotion) ? $Promotion['Price'] : [];
                    if (!empty($Price)) {
                        $promoPrice = $Price;
                        break;
                    }
                }
            }
        } else {
            $promoPrice = $Price;
        }
        return $promoPrice;
    }
}


if (!function_exists('check_attribute_image')) {
    /**
     * @param $status
     * @return string
     */
    function check_attribute_image($attributes, $mainImage)
    {
        $attr_data = $mainImage;
        if (is_array($attributes)) {
            if (empty($attributes)) {
                return $mainImage;
            }
            $attribute = collect($attributes)->whereNotNull('ImageUrl')->first();
            if ($attribute) {
                if (key_exists('MiniImageUrl', $attribute)) {
                    $attr_data = $attribute['MiniImageUrl'] ?? $mainImage;
                } else {
                    $attr_data = key_exists('ImageUrl', $attribute) ? $attribute['ImageUrl'] : $mainImage;
                }
            }
        }
        return $attr_data;
    }
}


if (!function_exists('readable_status')) {
    /**
     * @param $status
     * @return string
     */
    function readable_status($status)
    {
        $status = str_replace('_', ' ', $status);
        $status = str_replace('-', ' ', $status);
        return ucfirst($status);
    }
}


if (!function_exists('generate_transaction_id')) {
    /**
     * @param $status
     * @return string
     */
    function generate_transaction_id()
    {
        return uniqid("CH");
    }
}

if (!function_exists('get_aliExpress_shipping')) {
    /**
     * @param $status
     * @return string
     */
    function get_aliExpress_shipping($weight)
    {
        $rate = get_setting('express_shipping_weight_rate', 0);
        $min_charge = get_setting('express_shipping_weight_min_charge', 0);
        $total = $rate * $weight;
        return $total >= $min_charge ? $total : $min_charge;
    }
}

if (!function_exists('get_aliExpress_air_shipping_rate')) {
    /**
     * @param $status
     * @return string
     */
    function get_aliExpress_air_shipping_rate($variations, $type = 'express')
    {
        $total = 0;
        foreach ($variations as $variation) {
            $qty = $variation->qty;
            $price = $variation->price;
            $total += ($qty * $price);
        }
        $charges = $type == 'express' ? get_setting('ali_air_shipping_charges') : get_setting('air_shipping_charges');
        $charges = $charges ? json_decode($charges, true) : [];
        return calculate_air_shipping_rate($charges, $total);
    }
}


if (!function_exists('calculate_air_shipping_rate')) {
    /**
     * @param $status
     * @return string
     */
    function calculate_air_shipping_rate($conditions, $amount)
    {
        $shipping_rate = 0;
        for ($x = 0; $x < count($conditions); $x++) {
            $condition = $conditions[$x];
            $minimum = $condition['minimum'] ?? 0;
            $maximum = $condition['maximum'] ?? 0;
            $rate = $condition['rate'] ?? 0;
            if (!$amount) {
                $shipping_rate = $rate;
                break;
            } else if ($amount >= $minimum && $amount <= $maximum) {
                $shipping_rate = $rate;
                break;
            }
        }
        return $shipping_rate;
    }
}

if (!function_exists('calculate_advanced_rate')) {
    /**
     * @param $status
     * @return string
     */
    function calculate_advanced_rate($cart_total, $rates, $current_rate = 100)
    {
        $settingRates = $rates ? json_decode($rates, true) : [];
        if (count($settingRates) > 0) {
            $adv = 0;
            for ($x = 0; $x < count($settingRates); $x++) {
                $condition = $settingRates[$x];
                $minimum = $condition['minimum'] ?? 0;
                $maximum = $condition['maximum'] ?? 0;
                $rate = $condition['rate'] ?? 0;
                if ($cart_total >= $minimum && $cart_total <= $maximum) {
                    $adv = $rate;
                    break;
                }
            }
            if ($adv) {
                return $adv;
            }
        }
        return $current_rate;
    }
}
