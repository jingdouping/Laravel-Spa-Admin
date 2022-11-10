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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            // $table->string('product_title');
            $table->unsignedBigInteger('secondary_category_id');
            $table->foreign('secondary_category_id')->references('id')->on('secondary_categories')->onDelete('cascade')->onUpdate('cascade');
            // $table->string('category_name');
            // $table->string('product_id');
            $table->string('product_code');
            $table->string('product_name');
            $table->text('description');
            // $table->string('image');
            $table->integer('price');
            $table->softDeletes();
            // $table->integer('sort_order')->nullable();
            // $table->string('size');
            // $table->string('color');
            // $table->string('price');
            // $table->string('quantity');
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
        // Schema::dropIfExists('secondary_categories');
        Schema::dropIfExists('products');
    }
};
