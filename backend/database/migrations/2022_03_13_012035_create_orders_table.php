<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOrdersTable extends Migration
{
  /**
   * Run the migrations.
   *
   * @return void
   */
  public function up()
  {
    Schema::create('orders', function (Blueprint $table) {
      $table->bigIncrements('id');
      $table->string('order_number')->nullable();
      $table->string('name', 255)->nullable();
      $table->string('phone', 25)->nullable();
      $table->text('shipping')->nullable();
      $table->text('billing')->nullable();
      $table->string('coupon_code')->nullable();
      $table->string('coupon_discount')->nullable();
      $table->string('payment_method')->nullable();
      $table->string('transaction_id', 55)->nullable();
      $table->string('bkash_payment_id', 55)->nullable();
      $table->string('order_from', 55)->nullable();
      $table->string('status')->nullable();
      $table->unsignedInteger('user_id')->nullable();
      $table->timestamps();
      $table->softDeletes();
    });

    Schema::create('order_items', function (Blueprint $table) {
      $table->bigIncrements('id');
      $table->string('item_number', 25)->nullable();
      $table->unsignedBigInteger('order_id');
      $table->unsignedBigInteger('user_id');
      $table->string('ItemId')->nullable();
      $table->text('Title');
      $table->text('ProviderType');
      $table->string('ItemMainUrl', 255)->nullable();
      $table->string('MainPictureUrl', 255)->nullable();
      $table->unsignedInteger('regular_price')->nullable();
      $table->string('weight', 11)->nullable();
      $table->unsignedInteger('DeliveryCost')->nullable();
      $table->unsignedInteger('Quantity')->nullable();
      $table->string('hasConfigurators', 11)->nullable();
      $table->string('shipped_by', 55)->nullable()->default('air');
      $table->string('shipping_from')->nullable()->default('china');
      $table->unsignedInteger('shipping_rate')->nullable();
      $table->string('status')->nullable();
      $table->string('tracking_number')->nullable();
      $table->unsignedInteger('product_value')->nullable();
      $table->unsignedInteger('first_payment')->nullable();
      $table->unsignedInteger('coupon_contribution')->nullable();
      $table->unsignedInteger('bd_shipping_charge')->nullable();
      $table->unsignedInteger('courier_bill')->nullable();
      $table->unsignedInteger('out_of_stock')->nullable();
      $table->unsignedInteger('missing')->nullable();
      $table->unsignedInteger('adjustment')->nullable();
      $table->unsignedInteger('refunded')->nullable();
      $table->unsignedInteger('last_payment')->nullable();
      $table->unsignedInteger('due_payment')->nullable();
      $table->string('invoice_no', 22)->nullable();
      $table->timestamps();
      $table->softDeletes();
    });


    Schema::create('order_item_variations', function (Blueprint $table) {
      $table->bigIncrements('id');
      $table->unsignedBigInteger('order_id');
      $table->unsignedBigInteger('item_id');
      $table->unsignedBigInteger('user_id');
      $table->string('configId')->nullable();
      $table->unsignedInteger('price')->nullable();
      $table->unsignedInteger('qty')->nullable();
      $table->unsignedInteger('subTotal')->nullable();
      $table->text('attributes')->nullable();
      $table->timestamps();
      $table->softDeletes();
    });

    // php artisan migrate:refresh --path='./database/migrations/2022_03_13_012035_create_orders_table.php'
  }

  /**
   * Reverse the migrations.
   *
   * @return void
   */
  public function down()
  {
    Schema::dropIfExists('orders');
    Schema::dropIfExists('order_items');
    Schema::dropIfExists('order_item_variations');
  }
}
