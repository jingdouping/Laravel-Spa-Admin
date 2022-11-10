<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Product;
use App\Models\Stock;
use App\Models\User;
use Illuminate\Database\Eloquent\SoftDeletes;

class SubProduct extends Model
{
    use HasFactory;
    use SoftDeletes;


    protected $dates = ['deleted_at'];
    protected $guarded = [];

    // protected $with = ['product','stock'];//2つ必要
    public function product()
    {
        return $this->belongsTo(Product::class,'product_id','id');
    }
    public function stock(){
        return $this->hasMany(Stock::class,'subproduct_id','id');
    }

    public function user()
    {
        return $this->belongsToMany(User::class,'carts')->withPivot('id','quantity');
    }

    public function sizequantityinfo(){
        return $this->hasMany(SizeQuantityInfo::class,'subproduct_id','id');
    }

    public static function boot(){
        parent::boot();

        static::deleted(function ($subproduct) {
            $subproduct->sizequantityinfo()->delete();
        });
    }
}
