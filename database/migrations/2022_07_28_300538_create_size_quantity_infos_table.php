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
        Schema::create('size_quantity_infos', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->unsignedBigInteger('subproduct_id');
            $table->foreign('subproduct_id')->references('id')->on('sub_products')->onDelete('cascade')->onUpdate('cascade');
            $table->string('size')->nullable();
            $table->string('quantity');
            // $table->boolean('is_selling');
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('size_quantity_infos');
    }
};
