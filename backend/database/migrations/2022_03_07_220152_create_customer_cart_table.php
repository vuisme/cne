<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCustomerCartTable extends Migration
{
  /**
   * Run the migrations.
   *
   * @return void
   */
  public function up()
  {
    Schema::create('carts', function (Blueprint $table) {
      $table->bigIncrements('id');
      $table->string('cart_uid');
      $table->unsignedInteger('user_id')->nullable();
      $table->string('cookie_id')->nullable();
      $table->text('shipping')->nullable();
      $table->text('billing')->nullable();
      $table->string('payment_method')->nullable();
      $table->string('coupon_code')->nullable();
      $table->string('coupon_discount')->nullable();
      $table->string('status')->nullable();
      $table->boolean('is_purchase')->nullable();
      $table->timestamps();
    });

    Schema::create('cart_items', function (Blueprint $table) {
      $table->bigIncrements('id');
      $table->unsignedInteger('cart_id')->nullable();
      $table->string('ItemId')->nullable();
      $table->string('Title', 350)->nullable();
      $table->string('ProviderType')->nullable();
      $table->string('ItemMainUrl', 255)->nullable();
      $table->string('MainPictureUrl', 255)->nullable();
      $table->string('MasterQuantity', 11)->nullable();
      $table->string('FirstLotQuantity', 11)->nullable();
      $table->string('NextLotQuantity', 11)->nullable();
      $table->string('ProductPrice', 11)->nullable();
      $table->string('weight', 11)->nullable();
      $table->string('DeliveryCost', 11)->nullable();
      $table->string('Quantity', 11)->nullable();
      $table->string('hasConfigurators', 11)->nullable();
      $table->string('shipped_by')->nullable();
      $table->string('shipping_rate')->nullable();
      $table->string('shipping_from')->nullable();
      $table->string('status')->nullable();
      $table->boolean('is_checked')->nullable();
      $table->timestamps();
    });

    Schema::create('cart_item_variations', function (Blueprint $table) {
      $table->bigIncrements('id');
      $table->unsignedInteger('cart_id')->nullable();
      $table->unsignedInteger('cart_item_id')->nullable();
      $table->string('configId')->nullable();
      $table->unsignedInteger('price')->nullable();
      $table->unsignedInteger('qty')->nullable();
      $table->text('attributes')->nullable();
      $table->string('maxQuantity', 11)->nullable();
      $table->timestamps();
    });

    // php artisan migrate:refresh --path='./database/migrations/2022_03_07_220152_create_customer_cart_table.php'
  }

  /**
   * Reverse the migrations.
   *
   * @return void
   */
  public function down()
  {
    Schema::dropIfExists('carts');
    Schema::dropIfExists('cart_items');
    Schema::dropIfExists('cart_item_variations');
  }
}
