<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    use HasFactory;
    protected $guarded = [];

    // public function subproduct(){
    //     return $this->hasMany(SubProduct::class,'id','sub_product_id');
    // }

    public function order(){
        return $this->belongsTo(Order::class,'id','order_id');
    }
    public function sizequantityinfo(){
        return $this->hasMany(SizeQuantityInfo::class,'id','size_quantity_info_id');
    }
}
