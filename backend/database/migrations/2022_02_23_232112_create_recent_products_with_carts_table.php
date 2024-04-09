<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRecentProductsWithCartsTable extends Migration
{
  /**
   * Run the migrations.
   *
   * @return void
   */
  public function up()
  {
    Schema::create('recent_products', function (Blueprint $table) {
      $table->bigIncrements('id');
      $table->string('ItemId');
      $table->string('ProviderType');
      $table->text('Title')->nullable();
      $table->string('categoryId')->nullable();
      $table->string('VendorId')->nullable();
      $table->string('VendorName')->nullable();
      $table->string('VendorScore')->nullable();
      $table->string('PhysicalParameters', 255)->nullable();
      $table->string('brand_id')->nullable();
      $table->string('brand_name')->nullable();
      $table->string('original_url', 255)->nullable();
      $table->string('MainPictureUrl', 300)->nullable();
      $table->text('Price')->nullable();
      $table->text('Pictures')->nullable();
      $table->longText('Features')->nullable();
      $table->longText('Attributes')->nullable();
      $table->timestamps();
    });

    // php artisan migrate:refresh --path='./database/migrations/2022_02_23_232112_create_recent_products_with_carts_table.php'

  }

  /**
   * Reverse the migrations.
   *
   * @return void
   */
  public function down()
  {
    Schema::dropIfExists('recent_products');
  }
}
