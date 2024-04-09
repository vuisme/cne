<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOrderTrackingTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('order_tracking', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedInteger('order_item_id');
            $table->string('status');
            $table->string('tracking_status', 255);
            $table->smallInteger('sorting')->nullable();
            $table->timestamp('updated_time')->nullable();
            $table->text('comment')->nullable();
            $table->unsignedInteger('user_id');
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('order_tracking_exceptional', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedInteger('order_tracking_id');
            $table->unsignedInteger('order_item_id');
            $table->string('status');
            $table->string('tracking_status', 255);
            $table->smallInteger('sorting')->nullable();
            $table->timestamp('updated_time')->nullable();
            $table->text('comment')->nullable();
            $table->unsignedInteger('user_id');
            $table->timestamps();
            $table->softDeletes();
        });


        // php artisan migrate:refresh --path='./database/migrations/2022_07_25_002202_create_order_tracking_table.php'
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('order_tracking');
        Schema::dropIfExists('order_tracking_exceptional');
    }
}
