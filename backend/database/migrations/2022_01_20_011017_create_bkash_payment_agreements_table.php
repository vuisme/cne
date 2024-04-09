<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBkashPaymentAgreementsTable extends Migration
{
  /**
   * Run the migrations.
   *
   * @return void
   */
  public function up()
  {
    Schema::create('bkash_payment_aggrements', function (Blueprint $table) {
      $table->bigIncrements('id');
      $table->unsignedInteger('user_id');
      $table->timestamp('active')->nullable();
      $table->string('agreementID', 255);
      $table->string('payerReference')->nullable();
      $table->string('agreementStatus')->nullable();
      $table->string('customerMsisdn')->nullable();
      $table->string('agreementExecuteTime', 255)->nullable();
      $table->timestamps();
      $table->softDeletes();
    });

    // php artisan migrate:refresh --path='./database/migrations/2022_01_20_011017_create_bkash_payment_agreements_table.php'
  }

  /**
   * Reverse the migrations.
   *
   * @return void
   */
  public function down()
  {
    Schema::dropIfExists('bkash_payment_aggrements');
  }
}
