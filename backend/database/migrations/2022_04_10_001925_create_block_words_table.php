<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBlockWordsTable extends Migration
{
  /**
   * Run the migrations.
   *
   * @return void
   */
  public function up()
  {
    Schema::create('block_words', function (Blueprint $table) {
      $table->bigIncrements('id');
      $table->string('word', 255)->nullable();
      $table->text('sentence')->nullable();
      $table->unsignedInteger('block_count')->nullable();
      $table->unsignedInteger('user_id');
      $table->timestamps();
    });

    // php artisan migrate:refresh --path='./database/migrations/2022_04_10_001925_create_block_words_table.php'
  }

  /**
   * Reverse the migrations.
   *
   * @return void
   */
  public function down()
  {
    Schema::dropIfExists('block_words');
  }
}
