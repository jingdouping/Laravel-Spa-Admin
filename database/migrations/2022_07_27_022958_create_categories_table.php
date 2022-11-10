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
        Schema::create('primary_categories', function (Blueprint $table) {
            $table->id();
            // $table->unsignedBigInteger('product_id');
            // $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
            $table->string('primary_category_name');
            // $table->integer('sort_order')->nullable();
            $table->timestamps();
        });
        Schema::create('secondary_categories', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('primary_category_id');
            $table->foreign('primary_category_id')->references('id')->on('primary_categories')->onDelete('cascade')->onUpdate('cascade');
            // $table->foreignId('primary_category_id')
            // ->constrained();
            $table->string('secondary_category_name');
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
        Schema::dropIfExists('secondary_categories');
        Schema::dropIfExists('primary_categories');
    }
};
