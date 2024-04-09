<?php

use App\Http\Controllers\Api\Backend\ApiInvoiceController;
use App\Http\Controllers\Api\Backend\ApiWalletController;
use Illuminate\Support\Facades\Route;


Route::group(['prefix' => 'order', 'as' => 'order.'], function () {
    Route::get('/wallet', [ApiWalletController::class, 'index']);
    Route::get('/wallet/tracking/{id}', [ApiWalletController::class, 'wallet_tracking_information']);
    Route::post('/wallet', [ApiWalletController::class, 'update_order_wallet_status']);
    Route::put('/wallet/{id}', [ApiWalletController::class, 'update']);
    Route::delete('/wallet/delete', [ApiWalletController::class, 'destroy']);
    Route::post('/invoice/generate', [ApiInvoiceController::class, 'store']);
    Route::get('/invoice', [ApiInvoiceController::class, 'index']);
});
