<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\PrimaryCategory;

class SecondaryCategory extends Model
{
    use HasFactory;
    protected $guarded = [];

    // protected $with = ['primarycategory'];//2つ必要
    // withはcontrollerで使うここで使うとエラーなる

    public function primarycategory(){
        return $this->belongsTo(PrimaryCategory::class,'primary_category_id');
    }
    public function product(){
        return $this->hasMany(Product::class,'secondary_category_id');
    }
}
