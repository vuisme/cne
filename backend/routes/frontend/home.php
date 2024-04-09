<?php

use App\Http\Controllers\Frontend\HomeController;
use App\Http\Controllers\Frontend\User\AccountController;
use App\Http\Controllers\Frontend\User\DashboardController;
use App\Http\Controllers\Frontend\User\ProfileController;
use App\Http\Controllers\SslCommerzPaymentController;


use App\Http\Controllers\PaymentGateway\NagadPaymentController;
use App\Http\Controllers\PaymentGateway\BkashPaymentController;


/*
 * Frontend Controllers
 * All route names are prefixed with 'frontend.'.
 */

Route::get('/', [HomeController::class, 'index'])->name('index');


/*
 * These frontend controllers require the user to be logged in
 * All route names are prefixed with 'frontend.'
 * These routes can not be hit if the password is expired
 */
Route::group(['middleware' => ['auth', 'password_expires']], function () {

  Route::group(['namespace' => 'User', 'as' => 'user.'], function () {
    // User Dashboard Specific
    // Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    // Route::get('notification', [DashboardController::class, 'notification'])->name('dashboard.notification');

    // manage order information
    // Route::get('order-details/{tranId}', [DashboardController::class, 'orderDetails'])->name('order-details');
    // Route::get('failed-order-pay-now/{tranId}', [DashboardController::class, 'failedOrderPayNow'])->name('failedOrderPayNow');

    // manage Invoice information
    Route::get('invoice-details/{invoice_id}', [DashboardController::class, 'invoiceDetails'])->name('invoice-details');
    Route::get('invoice-pay-now/{tranId}', [DashboardController::class, 'invoicePayNow'])->name('invoice.payNow');

    // User Account Specific
    Route::get('account', [AccountController::class, 'index'])->name('account');
    Route::get('update-information', [AccountController::class, 'updateInformation'])->name('update.information');
    Route::post('update-information', [AccountController::class, 'updateInformationStore'])->name('update.information.store');

    // User Profile Specific
    Route::patch('profile/update', [ProfileController::class, 'update'])->name('profile.update');
  });
});

// nagad payment process
Route::get('nagad/callback', [NagadPaymentController::class, 'nagad_payment_verify']);

// start bkash payment
Route::get('bkash/payment/status', [BkashPaymentController::class, 'PaymentStatus']);
Route::get('bkash/payment/{id}', [BkashPaymentController::class, 'bkashPaymentProcess']);
Route::post('bkash/token', [BkashPaymentController::class, 'bkashToken']);
Route::post('bkash/checkout', [BkashPaymentController::class, 'createCheckoutPayment']);
Route::post('bkash/execute', [BkashPaymentController::class, 'executeCheckoutPayment']);
// end bkash payment

// SSLCOMMERZ Start
Route::post('/pay-via-ajax', [SslCommerzPaymentController::class, 'payViaAjax']); // for some of
Route::post('sslcommerz/payment', [SslCommerzPaymentController::class, 'index']);
Route::post('/success', [SslCommerzPaymentController::class, 'success']);
Route::post('/fail', [SslCommerzPaymentController::class, 'fail']);
Route::post('/cancel', [SslCommerzPaymentController::class, 'cancel']);
Route::post('/ipn', [SslCommerzPaymentController::class, 'ipn']);
//SSLCOMMERZ END
