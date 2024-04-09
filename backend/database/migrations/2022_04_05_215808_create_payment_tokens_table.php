<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePaymentTokensTable extends Migration
{
  /**
   * Run the migrations.
   *
   * @return void
   */
  public function up()
  {
    Schema::create('payment_tokens', function (Blueprint $table) {
      $table->bigIncrements('id');
      $table->string('token');
      $table->string('tran_id');
      $table->unsignedInteger('order_id')->nullable();
      $table->unsignedInteger('user_id')->nullable();
      $table->timestamps();
    });


    // php artisan migrate:refresh --path='./database/migrations/2022_04_05_215808_create_payment_tokens_table.php'
  }

  /**
   * Reverse the migrations.
   *
   * @return void
   */
  public function down()
  {
    Schema::dropIfExists('payment_tokens');
  }
}
