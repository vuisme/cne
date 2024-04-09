<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAliExpressSearchLogsTable extends Migration
{
  /**
   * Run the migrations.
   *
   * @return void
   */
  public function up()
  {
    Schema::create('ali_express_search_logs', function (Blueprint $table) {
      $table->bigIncrements('id');
      $table->string('uid')->nullable();
      $table->string('product_id')->nullable();
      $table->text('search_url')->nullable();
      $table->string('request_ip')->nullable();
      $table->unsignedBigInteger('user_id')->nullable();
      $table->timestamps();
    });
    // php artisan migrate:refresh --path='./database/migrations/2022_04_17_203059_create_ali_express_search_logs_table.php'
  }

  /**
   * Reverse the migrations.
   *
   * @return void
   */
  public function down()
  {
    Schema::dropIfExists('ali_express_search_logs');
  }
}
