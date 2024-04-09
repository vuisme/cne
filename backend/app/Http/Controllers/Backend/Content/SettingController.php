<?php

namespace App\Http\Controllers\Backend\Content;

use App\Http\Controllers\Controller;
use App\Models\Content\Setting;
use App\Repositories\Frontend\Settings\SettingRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\File;

class SettingController extends Controller
{

    public $setting;

    public function __construct(SettingRepository $setting)
    {
        $this->setting = $setting;
    }

    public function general()
    {
        return view('backend.content.settings.general.index');
    }

    public function logoStore(Request $request)
    {
        if (\request()->hasFile('frontend_logo_menu')) {
            $data['frontend_logo_menu'] = store_picture(\request()->file('frontend_logo_menu'), 'setting/logo');
        }
        if (\request()->hasFile('frontend_logo_footer')) {
            $data['frontend_logo_footer'] = store_picture(\request()->file('frontend_logo_footer'), 'setting/logo');
        }
        if (\request()->hasFile('admin_logo')) {
            $data['admin_logo'] = store_picture(\request()->file('admin_logo'), 'setting/logo');
        }
        if (\request()->hasFile('favicon')) {
            $data['favicon'] = store_picture(\request()->file('favicon'), 'setting/logo');
        }
        Setting::save_settings($data);
        Cache::forget('settings'); // remove setting cache

        $this->setting->update_key();

        return redirect()->back()->withFlashSuccess('Logo Updated Successfully');
    }


    public function socialStore(Request $request)
    {
        $data = request()->all();
        unset($data['_token']);

        if (\request()->hasFile('meta_image')) {
            $data['meta_image'] = store_picture(\request()->file('meta_image'), 'setting/meta');
        }

        if (\request()->hasFile('invoice_logo')) {
            $data['invoice_logo'] = store_picture(\request()->file('invoice_logo'), 'setting/logo');
        }

        Setting::save_settings($data);
        Cache::forget('settings'); // remove setting cache

        $this->setting->update_key();

        return redirect()->back()->withFlashSuccess('Setting Updated Successfully');
    }


    public function price()
    {
        return view('backend.content.settings.price-setting');
    }

    public function limit()
    {
        return view('backend.content.settings.popups.limit');
    }

    public function popupMessage()
    {
        return view('backend.content.settings.popups.popup');
    }


    public function limitationStore()
    {
        $data = request()->all();
        unset($data['_token']);

        Setting::save_settings($data);
        Cache::forget('settings'); // remove setting cache
        $this->setting->update_key();

        return redirect()->back()->withFlashSuccess('Setting Updated Successfully');
    }

    public function aliexpressLimitation()
    {
        $data = request()->all();
        unset($data['_token'], $data['ali_shipping']);
        $shipping = request('ali_shipping', []);
        $data['ali_air_shipping_charges'] = json_encode($shipping);
        Setting::save_settings($data);
        Cache::forget('settings'); // remove setting cache
        $this->setting->update_key();

        return redirect()->back()->withFlashSuccess('Setting Updated Successfully');
    }


    public function message()
    {
        return view('backend.content.settings.message-setting');
    }


    public function messageStore()
    {
        $sms = \request('sms') ? 'sms_' : '';
        if ($sms) {
            $data['sms_active_otp_message'] = \request('sms_active_otp_message', null);
            $data['sms_otp_message'] = \request('sms_otp_message', null);
        }
        $data[$sms . 'active_waiting_for_payment'] = \request($sms . 'active_waiting_for_payment', null);
        $data[$sms . 'waiting_for_payment'] = \request($sms . 'waiting_for_payment', null);
        $data[$sms . 'active_partial_paid'] = \request($sms . 'active_partial_paid', null);
        $data[$sms . 'partial_paid'] = \request($sms . 'partial_paid', null);
        $data[$sms . 'active_purchased_message'] = \request($sms . 'active_purchased_message', null);
        $data[$sms . 'purchased_message'] = \request($sms . 'purchased_message', null);
        $data[$sms . 'active_shipped_from_suppliers'] = \request($sms . 'active_shipped_from_suppliers', null);
        $data[$sms . 'shipped_from_suppliers'] = \request($sms . 'shipped_from_suppliers', null);
        $data[$sms . 'active_received_in_china_warehouse'] = \request($sms . 'active_received_in_china_warehouse', null);
        $data[$sms . 'received_in_china_warehouse'] = \request($sms . 'received_in_china_warehouse', null);
        $data[$sms . 'active_shipped_from_china_warehouse'] = \request($sms . 'active_shipped_from_china_warehouse', null);
        $data[$sms . 'shipped_from_china_warehouse'] = \request($sms . 'shipped_from_china_warehouse', null);
        $data[$sms . 'active_received_in_bd_warehouse'] = \request($sms . 'active_received_in_bd_warehouse', null);
        $data[$sms . 'received_in_bd_warehouse'] = \request($sms . 'received_in_bd_warehouse', null);
        $data[$sms . 'active_on_transit_to_customer'] = \request($sms . 'active_on_transit_to_customer', null);
        $data[$sms . 'on_transit_to_customer'] = \request($sms . 'on_transit_to_customer', null);
        $data[$sms . 'active_delivered_completed'] = \request($sms . 'active_delivered_completed', null);
        $data[$sms . 'delivered_completed'] = \request($sms . 'delivered_completed', null);
        $data[$sms . 'active_adjustment'] = \request($sms . 'active_adjustment', null);
        $data[$sms . 'adjustment'] = \request($sms . 'adjustment', null);
        $data[$sms . 'active_canceled_by_seller'] = \request($sms . 'active_canceled_by_seller', null);
        $data[$sms . 'canceled_by_seller'] = \request($sms . 'canceled_by_seller', null);
        $data[$sms . 'active_out_of_stock'] = \request($sms . 'active_out_of_stock', null);
        $data[$sms . 'out_of_stock'] = \request($sms . 'out_of_stock', null);
        $data[$sms . 'active_refunded'] = \request($sms . 'active_refunded', null);
        $data[$sms . 'refunded'] = \request($sms . 'refunded', null);

        Setting::save_settings($data);
        Cache::forget('settings'); // remove setting cache
        $this->setting->update_key();

        return redirect()->back()->withFlashSuccess('Message Updated Successfully');
    }


    public function airShippingStore()
    {
        $shipping = request('shipping');
        $advanced_rates = request('advanced_rates');
        $ali_pricing_conversion = request('ali_pricing_conversion');
        $data = [];
        if ($shipping && is_array($shipping)) {
            $data['air_shipping_charges'] = json_encode($shipping);
        }
        if ($advanced_rates && is_array($advanced_rates)) {
            $data['advanced_rates'] = json_encode($advanced_rates);
        }
        if ($ali_pricing_conversion && is_array($ali_pricing_conversion)) {
            $data['ali_pricing_conversion'] = json_encode($ali_pricing_conversion);
        }
        Setting::save_settings($data);
        Cache::forget('settings'); // remove setting cache
        $this->setting->update_key();

        return redirect()->back()->withFlashSuccess('Shipping Charges Updated Successfully');
    }

    public function popupMessageStore()
    {
        $data = get_setting('cart_popup_message');
        $data = $data ? json_decode($data, true) : [];
        $data['popup_message'] = request('popup_message');
        $data['popup_option'] = request('popup_option');
        if (\request()->hasFile('popup_image')) {
            $file = \request()->file('popup_image');
            $data['popup_image'] = store_mixed_picture($file, 'setting');
        }
        Setting::save_settings(['cart_popup_message' => json_encode($data)]);
        Cache::forget('settings'); // remove setting cache
        $this->setting->update_key();

        return redirect()->back()->withFlashSuccess('Taoabo product popup messages add successfully Updated Successfully');
    }

    public function popupMessageAliexpressStore()
    {
        $data = get_setting('cart_aliexpress_popup_message');
        $data = $data ? json_decode($data, true) : [];
        $data['popup_message'] = request('popup_message');
        $data['popup_option'] = request('popup_option');
        if (\request()->hasFile('popup_image')) {
            $file = \request()->file('popup_image');
            $data['popup_image'] = store_mixed_picture($file, 'setting');
        }
        Setting::save_settings(['cart_aliexpress_popup_message' => json_encode($data)]);
        Cache::forget('settings'); // remove setting cache
        $this->setting->update_key();

        return redirect()->back()->withFlashSuccess('AliExpress Product popup messages add successfully Updated Successfully');
    }

    public function aliexpress_express_popup_message()
    {
        $data = get_setting('aliexpress_express_popup_message');
        $data = $data ? json_decode($data, true) : [];
        $data['popup_message'] = request('popup_message');
        $data['popup_option'] = request('popup_option');
        if (\request()->hasFile('popup_image')) {
            $file = \request()->file('popup_image');
            $data['popup_image'] = store_mixed_picture($file, 'setting');
        }
        Setting::save_settings(['aliexpress_express_popup_message' => json_encode($data)]);
        Cache::forget('settings'); // remove setting cache
        $this->setting->update_key();

        return redirect()->back()->withFlashSuccess('AliExpress product Express button popup messages add successfully Updated Successfully');
    }


    public function cacheControl()
    {
        $path = storage_path('app/browsing/');
        $files = File::allFiles($path);
        // foreach ($files as $key => $file) {
        //   dd($file);
        // }
        return view('backend.content.settings.cache-control', compact('files'));
    }

    public function cacheClear()
    {
        $pathname = \request('pathname');
        if (File::exists($pathname)) {
            File::delete($pathname);
            return redirect()->back()->withFlashWarning('Browsing Cache Remove Successfully');
        }
        return redirect()->back()->withFlashDanger('Cache Type Not Found');
    }


    public function manageSections()
    {
        return view('backend.content.settings.manage-sections.index');
    }

    public function manageSectionsStore()
    {
        $data = \request()->all();
        unset($data['_token']);

        if (\request()->hasFile('section_one_title_image')) {
            $data['section_one_title_image'] = store_picture(\request()->file('section_one_title_image'), 'setting');
        }
        Setting::save_settings($data);
        $this->setting->update_key();

        return redirect()->back()->withFlashSuccess('Section Updated  Successfully');
    }


    public function bannerRight()
    {
        return view('backend.content.settings.banner-right');
    }


    public function bannerRightStore()
    {
        $data['right_banner_image_link'] = request('right_banner_image_link', null);
        if (\request()->hasFile('right_banner_image')) {
            $data['right_banner_image'] = store_picture(\request()->file('right_banner_image'), 'setting/banner-right');
        }
        Setting::save_settings($data);
        $this->setting->update_key();

        return redirect()->back()->withFlashSuccess('Banner Right Image Set Successfully');
    }


    public function topNoticeCreate()
    {
        return view('backend.content.settings.top-notice');
    }

    public function topNoticeStore()
    {
        $active = request('top_notice_text_active');
        $top_notice_text = request('top_notice_text');

        $data['top_notice_text_active'] = null;
        if ($active) {
            $data['top_notice_text_active'] = $active;
        }
        $data['top_notice_text'] = $top_notice_text;

        Setting::save_settings($data);
        $this->setting->update_key();

        return redirect()->back()->withFlashSuccess('Top Notice Updated  Successfully');
    }

    public function createImageLoader()
    {
        return view('backend.content.settings.image-loader-setting');
    }

    public function storeImageLoader()
    {
        $data = [];
        if (\request()->hasFile('banner_image_loader')) {
            $data['banner_image_loader'] = store_picture(\request()->file('banner_image_loader'), 'setting/loader');
        }

        if (\request()->hasFile('category_image_loader')) {
            $data['category_image_loader'] = store_picture(\request()->file('category_image_loader'), 'setting/loader');
        }

        if (\request()->hasFile('sub_category_image_loader')) {
            $data['sub_category_image_loader'] = store_picture(\request()->file('sub_category_image_loader'), 'setting/loader');
        }

        if (\request()->hasFile('product_image_loader')) {
            $data['product_image_loader'] = store_picture(\request()->file('product_image_loader'), 'setting/loader');
        }

        Setting::save_settings($data);
        $this->setting->update_key();

        return redirect()->back()->withFlashSuccess('Loading Image Store Successfully');
    }


    public function shortMessageStore()
    {
        $data = \request()->only(['approx_weight_message', 'china_local_delivery_message', 'china_to_bd_bottom_message', 'order_summary_bottom_message', 'payment_summary_bottom_message']);
        Setting::save_settings($data);
        $this->setting->update_key();
        return redirect()->back()->withFlashSuccess('Short Message\'s Updated  Successfully');
    }

    public function bkashApiResponse()
    {

        return view('backend.content.settings.image-loader-setting');

        $data = \request()->only(['approx_weight_message', 'china_local_delivery_message', 'china_to_bd_bottom_message', 'order_summary_bottom_message', 'payment_summary_bottom_message']);
        Setting::save_settings($data);
        $this->setting->update_key();
        return redirect()->back()->withFlashSuccess('Short Message\'s Updated  Successfully');
    }
}
