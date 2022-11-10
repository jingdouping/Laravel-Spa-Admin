<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\SecondaryCategory;

class PrimaryCategory extends Model
{
    use HasFactory;
    protected $guarded = [];

    // protected $with = ['secondarycategories'];//2つ必要
    public function secondarycategory(){
        return $this->hasMany(SecondaryCategory::class);
    }
    // public function product(){
    //     return $this->hasMany(Product::class);
    // }
}
