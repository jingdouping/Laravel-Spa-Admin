<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\SubProduct;

class Stock extends Model
{
    use HasFactory;

    protected $guarded = [];


    // protected $with = ['subproduct'];//2つ必要

    public function subproduct()
    {
        return $this->belongsTo(SubProduct::class,'subproduct_id','id');//第二引数つける理由はつけなければsecondarycategory-idでproductsテーブルからキーを探して
    }
}
