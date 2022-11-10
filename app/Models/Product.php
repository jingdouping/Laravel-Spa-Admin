<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\SecondaryCategory;
use App\Models\SubProduct;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use HasFactory;
    use SoftDeletes;
    protected $guarded = [];
    protected $dates = ['deleted_at'];


    // protected $with = ['secondarycategory','subproduct'];//2つ必要

    public function secondarycategory()
    {
        return $this->belongsTo(SecondaryCategory::class,'secondary_category_id','id');//第二引数つける理由はつけなければsecondarycategory-idでproductsテーブルからキーを探して
    }
    public function subproduct(){
        return $this->hasMany(SubProduct::class,'product_id','id');
    }

    public static function boot(){
        parent::boot();

        static::deleted(function ($product) {
            $product->subproduct()->delete();
        });
    }
}
