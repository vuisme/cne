<?php

use App\Http\Controllers\Backend\DashboardController;
use App\Http\Controllers\Backend\Content\SettingController;
use App\Http\Controllers\Backend\Content\InvoiceController;
use App\Http\Controllers\Backend\Content\OrderController;
use App\Http\Controllers\Backend\Content\ProductController;
use App\Http\Controllers\Backend\Content\TaxonomyController;
use App\Http\Controllers\Backend\Content\BkashApiResponseController;
use App\Http\Controllers\Backend\Content\BlockWordController;
use App\Http\Controllers\Backend\Content\OrderTrackingController;
use App\Http\Controllers\Backend\Content\WalletController;
use Illuminate\Support\Facades\Route;

// All route names are prefixed with 'admin.'.
Route::redirect('/', '/admin/dashboard', 301);
Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
Route::post('dashboard/report/data', [DashboardController::class, 'quickReportData']);

Route::get('export/{table}', [DashboardController::class, 'export'])->name('export');

Route::namespace('Content')->group(function () {
  Route::get('product/restore/{post}', 'ProductController@restore')->name('product.restore');
  Route::get('product/restore/{post}', 'ProductController@restore')->name('product.restore');
  Route::get('product/duplicate', 'ProductController@duplicateIndex')->name('product.duplicate');
  Route::post('product/multi-delete', [ProductController::class, 'multiDelete']);
  Route::resource('product', 'ProductController')->except('create', 'show');


  Route::group(['prefix' => 'order', 'as' => 'order.'], function () {
    Route::post('wallet/status/change', [WalletController::class, 'update_order_wallet_status']);
    Route::post('wallet/comments/{wallet}', [WalletController::class, 'storeWalletComment'])->name('wallet.comments');
    Route::get('wallet/updated-parameters/{wallet}', [WalletController::class, 'walletUpdatedParameters']);
    Route::get('wallet/list/data', [WalletController::class, 'list']);
    Route::resource('wallet', 'WalletController');

    Route::resource('tracking', 'OrderTrackingController');
  });

  Route::get('order/trashed', 'OrderController@trashed')->name('order.trashed');
  Route::get('order/restore/{order}', 'OrderController@restore')->name('order.restore');
  Route::get('order/{order}/print', 'OrderController@orderPrint')->name('order.print');
  Route::get('makeAsPayment/{order}', [OrderController::class, 'makeAsPayment'])->name('order.makeAsPayment');
  Route::resource('order', 'OrderController')->except('edit', 'update');

  Route::get('invoice/trashed', [InvoiceController::class, 'trashed'])->name('invoice.trashed');
  Route::get('invoice/restore/{invoice}', [InvoiceController::class, 'restore'])->name('invoice.restore');
  Route::get('invoice/confirm-received/{invoice}', [InvoiceController::class, 'confirm_received'])->name('invoice.confirm.received');
  Route::get('invoice/details/{invoice}', [InvoiceController::class, 'details'])->name('invoice.details');
  Route::resource('invoice', 'InvoiceController');

  Route::get('coupon/trashed', 'CouponController@trashed')->name('coupon.trashed');
  Route::get('coupon/restore/{customer}', 'CouponController@restore')->name('coupon.restore');
  Route::get('coupon/log', 'CouponController@couponLog')->name('coupon.log');
  Route::resource('coupon', 'CouponController');

  Route::get('customer/trashed', 'CustomerController@trashed')->name('customer.trashed');
  Route::get('customer/restore/{customer}', 'CustomerController@restore')->name('customer.restore');
  Route::resource('customer', 'CustomerController');

  Route::post('get-slug-from-title', 'PageController@get_slug_from_title');
  Route::get('page/trashed', 'PageController@trashed')->name('page.trashed');
  Route::get('page/restore/{page}', 'PageController@restore')->name('page.restore');
  Route::post('editor/image-upload', 'PageController@editor_image_upload');
  Route::resource('page', 'PageController');

  Route::resource('menu', 'MenuController')->except('show');

  Route::get('taxonomy/trashed', 'TaxonomyController@trashed')->name('taxonomy.trashed');
  Route::get('taxonomy/restore', 'TaxonomyController@restore')->name('taxonomy.restore');

  Route::post('taxonomy/make-top', [TaxonomyController::class, 'makeAsTop']);
  Route::post('taxonomy/make-active', [TaxonomyController::class, 'makeActive']);
  Route::post('taxonomy/make-delete', [TaxonomyController::class, 'makeDelete']);

  Route::resource('taxonomy', 'TaxonomyController');

  Route::resource('contact', 'ContactController')->except('create', 'store');

  Route::get('faq/trashed', 'FaqController@trashed')->name('faq.trashed');
  Route::get('faq/restore/{faq}', 'FaqController@restore')->name('faq.restore');
  Route::resource('faq', 'FaqController');

  Route::get('announcement/trashed', 'AnnouncementController@trashed')->name('announcement.trashed');
  Route::get('announcement/restore/{faq}', 'AnnouncementController@restore')->name('announcement.restore');
  Route::resource('announcement', 'AnnouncementController');

  Route::get('banner/trashed', 'BannerController@trashed')->name('banner.trashed');
  Route::get('banner/restore/{faq}', 'BannerController@restore')->name('banner.restore');
  Route::resource('banner', 'BannerController');

  Route::group(['prefix' => 'setting', 'as' => 'setting.'], function () {

    Route::get('block-words', [BlockWordController::class, 'create'])->name('block-words');
    Route::post('block-words/store', [BlockWordController::class, 'store'])->name('block-words.store');
    Route::delete('block-words/delete/{id}', [BlockWordController::class, 'destroy'])->name('block-words.delete');

    Route::get('price', [SettingController::class, 'price'])->name('price');
    Route::get('limit', [SettingController::class, 'limit'])->name('limit');
    Route::get('popup', [SettingController::class, 'popupMessage'])->name('popup');
    Route::post('limitationStore', [SettingController::class, 'limitationStore'])->name('limitationStore');
    Route::post('aliexpress/limitation', [SettingController::class, 'aliexpressLimitation'])->name('aliexpress.limitation.store');

    Route::get('message', [SettingController::class, 'message'])->name('message');
    Route::post('message-store', [SettingController::class, 'messageStore'])->name('message.store');

    Route::post('airShippingStore', [SettingController::class, 'airShippingStore'])->name('airShippingStore');

    Route::post('popup-message', [SettingController::class, 'popupMessageStore'])->name('popup-message');
    Route::post('popup-message-aliexpress', [SettingController::class, 'popupMessageAliexpressStore'])->name('popup-message-aliexpress');
    Route::post('aliexpress-express-button', [SettingController::class, 'aliexpress_express_popup_message'])->name('aliexpress-express-button');

    Route::post('logo-store', [SettingController::class, 'logoStore'])->name('logoStore');
    Route::post('social-store', [SettingController::class, 'socialStore'])->name('socialStore');
    Route::get('general', [SettingController::class, 'general'])->name('general');

    Route::post('short-message', [SettingController::class, 'shortMessageStore'])->name('short.message.store');


    Route::get('cache-control', [SettingController::class, 'cacheControl'])->name('cache.control');
    Route::post('cache-control-store', [SettingController::class, 'cacheClear'])->name('cache.control.store');


    Route::group(['prefix' => 'bkash', 'as' => 'bkash.'], function () {
      Route::get('api/response', [BkashApiResponseController::class, 'index'])->name('api.response');
      Route::get('api/grant-token', [BkashApiResponseController::class, 'grant_token'])->name('api.grant.token');
      Route::get('api/create', [BkashApiResponseController::class, 'create'])->name('api.create');
      Route::get('api/execute', [BkashApiResponseController::class, 'executeApi'])->name('api.execute');
      Route::get('api/query', [BkashApiResponseController::class, 'queryApi'])->name('api.query');
      Route::get('api/search', [BkashApiResponseController::class, 'searchApi'])->name('api.search');
      Route::get('api/refund', [BkashApiResponseController::class, 'refundApi'])->name('api.refund');
      Route::get('api/refund/status', [BkashApiResponseController::class, 'refundStatusApi'])->name('api.refund.status');

      // dashboard manageable
      Route::get('refund/order', [BkashApiResponseController::class, 'refundOrder'])->name('refund.order');
      Route::post('payment/status/{id}', [BkashApiResponseController::class, 'paymentStatus'])->name('payment.status');
      Route::post('refund/process/{id}', [BkashApiResponseController::class, 'refundProcess'])->name('refund.process');
      Route::post('refund/submit/{id}', [BkashApiResponseController::class, 'refundSubmit'])->name('refund.submit');
      Route::post('refund/status/{id}', [BkashApiResponseController::class, 'refundStatusCheck'])->name('refund.status');
    });
  });

  Route::group(['prefix' => 'front-setting', 'as' => 'front-setting.'], function () {
    Route::get('top-notice', [SettingController::class, 'topNoticeCreate'])->name('topNotice.create');
    Route::post('top-notice', [SettingController::class, 'topNoticeStore'])->name('topNotice.store');

    Route::get('manage-sections', [SettingController::class, 'manageSections'])->name('manage.sections');
    Route::post('manage-section-store', [SettingController::class, 'manageSectionsStore'])->name('manage.section.store');

    Route::get('banner-right', [SettingController::class, 'bannerRight'])->name('banner.right');
    Route::post('banner-right', [SettingController::class, 'bannerRightStore'])->name('banner.right.store');

    Route::get('image-loader', [SettingController::class, 'createImageLoader'])->name('image.loading.create');
    Route::post('image-loader', [SettingController::class, 'storeImageLoader'])->name('image.loading.store');
  });
});
