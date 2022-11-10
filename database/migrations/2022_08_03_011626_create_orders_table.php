<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->foreign('user_id')->references('id')->on('users');
            // $table->unsignedBigInteger('cart_id')->nullable();
            // $table->foreign('cart_id')->references('id')->on('carts');
            // $table->unsignedBigInteger('credit_id')->nullable();
            // $table->foreign('credit_id')->references('id')->on('credits');
            $table->string('address_code');
            $table->string('address1');
            $table->string('post_code');
            $table->string('mansion_name')->nullable();
            $table->string('delivery_method');
            $table->string('delivery_day');
            $table->string('delivery_time');
            $table->string('payment_method');
            $table->string('credit_number')->nullable();
            $table->string('credit_name')->nullable();
            $table->string('cvc')->nullable();
            $table->string('expiry_data')->nullable();
            // $table->string('cart_filter');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('orders');
    }
};
