<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\SubProductController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\OrderController;


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });

Route::middleware('auth:admins')->group(function(){

    Route::get('view-users',[UserController::class,'index']);
    Route::get('view-admins',[AdminController::class,'index']);
    Route::post('store-admin',[AdminController::class,'adminstore']);
    Route::post('adminlogout',[AuthController::class,'adminlogout']);


    Route::post('store-firstcategory',[CategoryController::class,'firstcategorystore']);
    Route::post('store-secondcategory',[CategoryController::class,'secondcategorystore']);
    Route::get('view-firstcategory',[CategoryController::class,'firstcategoryindex']);
    Route::get('view-secondcategory',[CategoryController::class,'secondcategoryindex']);
    Route::get('edit-firstcategory/{categoryid}',[CategoryController::class,'firstcategoryedit']);
    Route::get('edit-secondcategory/{categoryid}',[CategoryController::class,'secondcategoryedit']);
    Route::post('update-firstcategory/{categoryid}',[CategoryController::class,'firstcategoryupdate']);
    Route::post('update-secondcategory/{categoryid}',[CategoryController::class,'secondcategoryupdate']);
    Route::post('delete-firstcategory/{id}',[CategoryController::class,'firstcategorydelete']);
    Route::post('delete-secondcategory/{id}',[CategoryController::class,'secondcategorydelete']);


    Route::post('store-product',[ProductController::class,'store']);
    Route::get('view-product',[ProductController::class,'index']);
    Route::post('delete-product/{id}',[ProductController::class,'delete']);
    Route::get('edit-product/{productid}',[ProductController::class,'edit']);
    Route::post('update-product/{productid}',[ProductController::class,'update']);


    Route::get('view-subproducts',[SubProductController::class,'index']);
    Route::get('view-subproducts/{code}',[SubProductController::class,'indexcode']);
    Route::post('store-subproduct',[SubProductController::class,'store']);
    Route::post('change-status/{id}',[SubProductController::class,'changeStatus']);
    Route::get('edit-subproduct/{productid}',[SubProductController::class,'edit']);
    Route::post('update-subproduct/{productid}',[SubProductController::class,'update']);
    Route::post('delete-subproduct/{id}',[SubProductController::class,'delete']);


    Route::post('store-size/{productid}',[SubProductController::class,'storesize']);
    Route::get('view-size/{subproduct_id}',[SubProductController::class,'viewsize']);
    Route::get('edit-size/{id}',[SubProductController::class,'editsize']);
    Route::post('update-size/{id}/{subproduct_id}',[SubProductController::class,'updatesize']);
    Route::post('delete-size/{id}',[SubProductController::class,'deletesize']);



    Route::get('view-orders',[OrderController::class,'vieworders']);

});

