<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PrimaryCategory;
use App\Models\Product;
use App\Models\SizeQuantityInfo;
use App\Models\SubProduct;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\File;
use Illuminate\Validation\Rule;

class ProductController extends Controller
{
    public function index(){
        $products = Product::with('secondarycategory.primarycategory')->get();
        return response()->json([
            'status' => 200,
            'products' => $products,
        ]);
    }

    public function viewproducts(){
        $products = SubProduct::with('product.secondarycategory.primarycategory')->where('quantity','>','0')->get()->toArray();
        $reverseproducts = array_reverse($products);
        return response()->json([
            'status' => 200,
            'products' => $reverseproducts,
        ]);
    }

    public function categoryIndex($cat_id){
        $catwithproducts = PrimaryCategory::with('secondarycategory.product.subproduct')->where('primary_category_name',$cat_id)->get();
        $products = Product::where('categories',$cat_id)->get();
        $allproducts = Product::whereHas('subproduct',function(Builder $q){
            $q->where('quantity','>','0');
        })->where('categories',$cat_id)->get();

        if($catwithproducts){
            return response()->json([
                'status' =>  200,
                'products' => $products,
                'allproducts' => $allproducts,
                'catwithproducts' => $catwithproducts,
            ]);
        }else{
            return response()->json([
                'status' =>  404,
                'message' => '商品が見つかりませんでした',
            ]);
        }
    }

    public function edit($productid){
        $product = Product::find($productid);
        if($product){
            return response()->json([
                'status' =>  200,
                'product' => $product,
            ]);
        }else{
            return response()->json([
                'status' =>  404,
                'message' => '商品が見つかりませんでした',
            ]);
        }
    }

    public function store(Request $request){
        $validator = Validator::make($request->all(),[
            'product_name' => 'required|max:191',
            'product_code' => ['required',Rule::unique('products')->whereNull('deleted_at')],
            'description' => 'required',
            'category' => 'required',
            'price' => 'required|integer|min:0',
        ]);
        if($validator->fails()){
            return response()->json([
                'status' =>  422,
                'errors' =>  $validator->errors(),
            ]);
        }else{
            $product_code = Product::where('product_code',$request->product_code)->exists();
            if($product_code){
                return response()->json([
                    'status' =>  500,
                    'message' => '入力した商品コードは既に存在しています',
                ]);
            }else if(!$product_code){
                $data = [
                    'product_name' => $request->product_name,
                    'product_code' => $request->product_code,
                    'description' => $request->description,
                    'secondary_category_id' => $request->category,
                    'price' => $request->price,
                    'created_at' => Carbon::now(),
                ];
                if($request->hasFile('image')){
                    $file = $request->file('image');
                    $extension = $file->getClientOriginalExtension();
                    $filename = time().'.'.$extension;
                    $file->move('uploads/products/',$filename);
                    $data['image'] = 'uploads/products/'.$filename;
                    Product::create($data);
                }else{
                    Product::create($data);
                }
                return response()->json([
                    'status' =>  200,
                    'message' => '商品型を追加しました',
                ]);
            }
        }
    }

    public function viewProduct($product_code, $onlyid){
        $products = Product::where('product_code',$product_code)->with('subproduct.sizequantityinfo')->get()->toArray();
        $confirmproducts = $products[0]['subproduct'];
        $subarray = array();
        foreach($confirmproducts as $confirmproduct){
            if(count($confirmproduct['sizequantityinfo']) === 0){

            }else if(count($confirmproduct['sizequantityinfo']) !== 0){
                array_push($subarray,$confirmproduct);
            }
        }
        $products[0]['subproduct'] = $subarray;
        $clickedproduct = SubProduct::where('id',$onlyid)->with('sizequantityinfo')->get();
        $size = SizeQuantityInfo::where('subproduct_id',$onlyid)->get(['size']);
        if($products){
            return response()->json([
                'status' =>  200,
                'product' => $products,
                'clickedproduct' => $clickedproduct,
                'size' => $size,
            ]);
        }else{
            return response()->json([
                'status' =>  404,
                'message' => '商品が見つかりませんでした',
            ]);
        }
    }

    public function delete($id){
        $product = Product::findOrFail($id);
        if($product){
            $timestart = microtime(true);
            $subproducts = SubProduct::where('product_id',$id)->get()->toArray();
            $subproductscount = count($subproducts);
            $subprocount = 0;
            while($subprocount < $subproductscount){
                $subproductid = $subproducts[$subprocount]['id'];
                $subproduct = SubProduct::findOrFail($subproductid);
                if($subproduct){
                    $path = $subproduct->topimage;
                    if(File::exists($path)){
                        File::delete($path);
                    }
                    for($i = 1; $i <=5 ; $i++){
                        $path = $subproduct->{'image'.$i};
                        if(File::exists($path)){
                            File::delete($path);
                        }
                    }
                }else{
                    return response()->json([
                        'status'=>404,
                        'message'=>'商品イメージは存在しません',
                    ]);
                }
                $subprocount++;
            }
            $product->delete();
            $time = microtime(true) - $timestart;
            return response()->json([
                'status'=>200,
                'message'=>'商品型を削除しました',
                'time'=>$time,
            ]);
        }else{
            return response()->json([
                'status'=>404,
                'message'=>'カテゴリーが見つかりません',
            ]);
        }
    }

    public function update(Request $request,$productid){
        $product_code = Product::where('id',$productid)->value('product_code');
        if($product_code === $request->product_code){
            $validator = Validator::make($request->all(),[
                'product_name' => 'required|max:191',
                'product_code' => 'required|max:191',
                'product_code' => 'required|max:191',
                'description' => 'required',
                'category' => 'required',
                'price' => 'required|integer',
            ]);
        }else{
            $validator = Validator::make($request->all(),[
                'product_name' => 'required|max:191',
                // 'product_code' => 'required|max:191|unique:products',
                'product_code' => ['required','max:191',Rule::unique('products')->whereNull('deleted_at')],
                'description' => 'required',
                'category' => 'required',
                'price' => 'required|integer',
            ]);
        }
        if($validator->fails()){
            return response()->json([
                'status' =>  422,
                'errors' =>  $validator->errors(),
            ]);
        }else{
            $product = Product::find($productid);
            $data = [
                'secondary_category_id' => $request->category,
                'product_name' => $request->product_name,
                'product_code' => $request->product_code,
                'description' => $request->description,
                'price' => $request->price,
            ];
            if($product){
                if($request->hasFile('image')){
                    $path = $product->image;
                    if(File::exists($path)){
                        File::delete($path);
                    }
                    $file = $request->file('image');
                    $extension = $file->getClientOriginalExtension();
                    $filename = time().'.'.$extension;
                    $file->move('uploads/products/',$filename);
                    $data['image'] = 'uploads/products/'.$filename;
                    $product->Update($data);
                }else{
                    $product->Update($data);
                }
                return response()->json([
                    'status' =>  200,
                    'message' => '商品情報を更新しました',
                ]);
            }else{
                return response()->json([
                    'status' =>  404,
                    'message' => '商品が見つかりませんでした',
                ]);
            }
        }
    }
}
