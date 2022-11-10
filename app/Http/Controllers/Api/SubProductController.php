<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PrimaryCategory;
use App\Models\Product;
use App\Models\SecondaryCategory;
use App\Models\SizeQuantityInfo;
use App\Models\SubProduct;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class SubProductController extends Controller
{
    public function index(){
        $products = Product::with('subproduct')->get();
        $subproducts = SubProduct::with('product')->get();
        $primary_category = PrimaryCategory::with('secondarycategory')->get();

        return response()->json([
            'status' => 200,
            'products' => $products,
            'subproducts' => $subproducts,
            'primary_category' => $primary_category,
        ]);
    }

    public function indexcode($code){
        $products = Product::where('product_code',$code)->with('subproduct')->get();
        $subproducts = SubProduct::with('product')->get();
        $primary_category = PrimaryCategory::with('secondarycategory')->get();

        return response()->json([
            'status' => 200,
            'products' => $products,
            'subproducts' => $subproducts,
            'primary_category' => $primary_category,
        ]);
    }

    public function categoryIndex($cat_id){
        $products = SubProduct::where('categories',$cat_id)->get();

        if($products){
            return response()->json([
                'status' =>  200,
                'products' => $products,
            ]);
        }else{
            return response()->json([
                'status' =>  404,
                'message' => '商品が見つかりませんでした',
            ]);
        }
    }

    public function edit($productid){
        $product = SubProduct::with('product')->find($productid);
        $products = Product::with('subproduct')->get();
        $primary_category = PrimaryCategory::with('secondarycategory')->get();
        if($product){
            return response()->json([
                'status' =>  200,
                'product' => $product,
                'products' => $products,
                'primary_category' => $primary_category,
            ]);
        }else{
            return response()->json([
                'status' =>  404,
                'message' => '商品が見つかりませんでした',
            ]);
        }
    }

    public function store(Request $request){
        $product_id = Product::where('product_code',$request->product_code)->value('id');
        // $topimage = $request->topimage;
        // $topimagefile = $request->file('topimage');
        // $color = $request->color;
        // return response()->json([
        //     'status' =>  412,
        //     'topimage' =>  $topimage,
        //     'topimagefile' =>  $topimagefile,
        //     'color' =>  $color,
        // ]);
        $validator = Validator::make($request->all(),[
            'product_code' => 'required|max:191',
            'color' => ['required','hankaku',Rule::unique('sub_products')->where(fn ($query) =>
            $query->where('product_id',$product_id)->where('color',$request->color)->whereNull('deleted_at'))],
            'topimage' => 'required|max:2048|image|mimes:jpeg,png,jpg',
            'image1' => 'nullable|max:2048|image|mimes:jpeg,png,jpg',
            'image2' => 'nullable|max:2048|image|mimes:jpeg,png,jpg',
            'image3' => 'nullable|max:2048|image|mimes:jpeg,png,jpg',
            'image4' => 'nullable|max:2048|image|mimes:jpeg,png,jpg',
            'image5' => 'nullable|max:2048|image|mimes:jpeg,png,jpg',
        ]);
        if($validator->fails()){
            return response()->json([
                'status' =>  422,
                'errors' =>  $validator->errors(),
            ]);
        }else{
            $secondary_category_id = Product::where('product_code',$request->product_code)->value('secondary_category_id');
            $primary_category_id = SecondaryCategory::where('id',$secondary_category_id)->value('primary_category_id');
            $data = [
                'product_id' => $product_id,
                'primary_category_id' => $primary_category_id,
                'color' => $request->color,
                'topimage' => $request->topimage,
                'image1' => $request->image1,
                'image2' => $request->image2,
                'image3' => $request->image3,
                'image4' => $request->image4,
                'image5' => $request->image5,
            ];
            if($request->hasFile('topimage')){
                $topimagefile = $request->file('topimage');
                $extension = $topimagefile->getClientOriginalExtension();
                $filename = time().'.'.$extension;
                $topimagefile->move('uploads/products/',$filename);
                $data['topimage'] = 'uploads/products/'.$filename;
                for($i = 1; $i <=5 ; $i ++){
                    if($request->hasFile('image'.$i)){
                        ${'imagefiles'.$i} = $request->file('image'.$i);
                        $extension = ${'imagefiles'.$i}->getClientOriginalExtension();
                        $filename = time() + $i .'.'.$extension;
                        $data['image'.$i] = 'uploads/products/'.$filename;
                        ${'imagefiles'.$i}->move('uploads/products/',$filename);
                    }
                }
                SubProduct::create($data);
            }else{
                SubProduct::create($data);
            }
            return response()->json([
                'status' =>  200,
                'message' => 'カラーとイメージを追加しました',
            ]);
        }
    }

    // public function changeStatus($id){
    //     $status = SizeQuantityInfo::where('id',$id)->value('is_selling');

    //     SizeQuantityInfo::findOrFail($id)->update([
    //         'is_selling' => !$status
    //     ]);
    //     $changestatus = SizeQuantityInfo::where('id',$id)->value('is_selling');
    //     return response()->json([
    //         'status' =>  200,
    //         'is_selling' => $changestatus,
    //     ]);
    // }

    public function delete($id){
        $product = SubProduct::findOrFail($id);
        if($product){
            $product->delete();
            $path = $product->topimage;
            if(File::exists($path)){
                File::delete($path);
            }
            for($i = 1; $i <=5 ; $i++){
                $path = $product->{'image'.$i};
                if(File::exists($path)){
                    File::delete($path);
                }
            }
            return response()->json([
                'status'=>200,
                'message'=>'削除しました',
            ]);
        }else{
            return response()->json([
                'status'=>404,
                'message'=>'そのカテゴリーは存在しません',
            ]);
        }
    }

    public function update(Request $request,$productid){
        $existtopimage = SubProduct::where('id',$productid)->value('topimage');
        $existimage1 = SubProduct::where('id',$productid)->value('image1');
        $existimage2 = SubProduct::where('id',$productid)->value('image2');
        $existimage3 = SubProduct::where('id',$productid)->value('image3');
        $existimage4 = SubProduct::where('id',$productid)->value('image4');
        $existimage5 = SubProduct::where('id',$productid)->value('image5');
        $product_id = Product::where('product_code',$request->product_code)->value('id');
        $validator = Validator::make($request->all(),[
            'product_code' => 'required|max:191',
            'color' => ['required','hankaku',Rule::unique('sub_products')->where(fn ($query) =>
            $query->where('id','!=',$productid)->where('product_id',$product_id)->whereNull('deleted_at'))],
            'topimage' => ($request->topimage === $existtopimage) ? '' :'required|max:2048|image|mimes:jpeg,png,jpg',
            'image1' => ($request->image1 === $existimage1) ? '' : 'nullable|max:2048|image|mimes:jpeg,png,jpg',
            'image2' => ($request->image2 === $existimage2) ? '' : 'nullable|max:2048|image|mimes:jpeg,png,jpg',
            'image3' => ($request->image3 === $existimage3) ? '' :'nullable|max:2048|image|mimes:jpeg,png,jpg',
            'image4' => ($request->image4 === $existimage4) ? '' :'nullable|max:2048|image|mimes:jpeg,png,jpg',
            'image5' => ($request->image5 === $existimage5) ? '' :'nullable|max:2048|image|mimes:jpeg,png,jpg',
        ]);
        if($validator->fails()){
            return response()->json([
                'status' =>  422,
                'errors' =>  $validator->errors(),
            ]);
        }else{
            $secondary_category_id = Product::where('product_code',$request->product_code)->value('secondary_category_id');
            $primary_category_id = SecondaryCategory::where('id',$secondary_category_id)->value('primary_category_id');
            $product = SubProduct::find($productid);
            $data = [
                'product_id' => $product_id,
                'primary_category_id' => $primary_category_id,
                'color' => $request->color,
                'topimage' => $request->topimage,
                'image1' => $request->image1,
                'image2' => $request->image2,
                'image3' => $request->image3,
                'image4' => $request->image4,
                'image5' => $request->image5,
            ];
            if($request->topimage === $existtopimage){
                $data['topimage'] = $existtopimage;

            }else if($request->hasFile('topimage')){
                $topimagefile = $request->file('topimage');
                $extension = $topimagefile->getClientOriginalExtension();
                $filename = time().'.'.$extension;
                $topimagefile->move('uploads/products/',$filename);
                $data['topimage'] = 'uploads/products/'.$filename;
                $path = $product->topimage;
                if(File::exists($path)){
                    File::delete($path);
                }
            }
            for($i = 1; $i <=5 ; $i++){
                if($request->{'image'.$i} === ${'existimage'.$i}){
                    $data['image'.$i] = ${'existimage'.$i};
                }else if($request->{'image'.$i} === null){
                    $path = $product->{'image'.$i};
                    if(File::exists($path)){
                        File::delete($path);
                    }
                }else if($request->hasFile('image'.$i)){
                    ${'imagefiles'.$i} = $request->file('image'.$i);
                    $extension = ${'imagefiles'.$i}->getClientOriginalExtension();
                    $filename = time() + $i .'.'.$extension;
                    $data['image'.$i] = 'uploads/products/'.$filename;
                    ${'imagefiles'.$i}->move('uploads/products/',$filename);
                    $path = $product->{'image'.$i};
                    if(File::exists($path)){
                        File::delete($path);
                    }
                }
            }
            $product->Update($data);
            return response()->json([
                'status' =>  200,
                'message' => '編集完了いたしました',
            ]);
        }
    }

    // public function categoryProduct(){
    //     $primary_category = PrimaryCategory::with('secondarycategory')->get();
    //     $productwithcategory = PrimaryCategory::with('secondarycategory.product.subproduct')->get();
    //     $sub_products = SubProduct::with('product.secondarycategory.primarycategory')->where('quantity','>','0')->get();
    //     $secondary_category = SecondaryCategory::all();
    //     return response()->json([
    //         'status'=>200,
    //         'primary_category'=>$primary_category,
    //         'productwithcategory'=>$productwithcategory,
    //         'sub_products'=>$sub_products,
    //         'secondary_category' => $secondary_category,
    //     ]);
    // }

    public function categoryProduct($cat){
        $categoryproducts = PrimaryCategory::where('primary_category_name',$cat)->with('secondarycategory.product.subproduct')->get();
        $primarycat_id = PrimaryCategory::where('primary_category_name',$cat)->value('id');
        $selectsecondarycat = SecondaryCategory::where('primary_category_id',$primarycat_id)->get();
        // $categoryproducts = PrimaryCategory::with('secondarycategory.product.subproduct')->get();
        $subproducts = SubProduct::with(['sizequantityinfo','product.secondarycategory.primarycategory'])->get()->toArray();
        $productsarray = array();
        foreach($subproducts as $subproduct){
            if(count($subproduct['sizequantityinfo']) === 0){
            }else if(count($subproduct['sizequantityinfo']) !== 0){
                array_push($productsarray,$subproduct);
            }
        }
        $reversesubproducts = array_reverse($productsarray);
        $secondary_category = SecondaryCategory::all();
        $primary_category = PrimaryCategory::with('secondarycategory.product.subproduct')->get();
        return response()->json([
            'status'=>200,
            'primary_category'=>$primary_category,
            'categoryproducts'=>$categoryproducts,
            'reversesubproducts'=>$reversesubproducts,
            'secondary_category' => $secondary_category,
            'selectsecondarycat' => $selectsecondarycat,
        ]);
    }

    public function viewWebProduct(){
        $primary_category = PrimaryCategory::with('secondarycategory.product.subproduct.sizequantityinfo')->take(3)->get();
        for($i=0;$i<=2;$i++){
            ${'categoryproducts'.$i} = array();
            $productwithcategory = $primary_category->skip($i)->value('id');
            $subproducts = SubProduct::where('primary_category_id',$productwithcategory)->with(['sizequantityinfo','product'])->get()->toArray();
            $reversesubproducts = array_reverse($subproducts);
            foreach($reversesubproducts as $reversesubproduct){
                if(count($reversesubproduct['sizequantityinfo']) === 0){

                }else if(count($reversesubproduct['sizequantityinfo']) !== 0){
                    array_push(${'categoryproducts'.$i},$reversesubproduct);
                }
                if(count(${'categoryproducts'.$i}) === 3){
                    break;
                }
            }
        }
        $sub_products = SubProduct::with(['product.secondarycategory.primarycategory','sizequantityinfo'])->get()->toArray();
        $productsarray = array();
        foreach($sub_products as $sub_product){
            if(count($sub_product['sizequantityinfo']) === 0){
            }else if(count($sub_product['sizequantityinfo']) !== 0){
                array_push($productsarray,$sub_product);
            }
        }
        $reversesubproducts = array_reverse($productsarray);
        // $secondary_category = SecondaryCategory::all();
        return response()->json([
            'status'=>200,
            'primary_category'=>$primary_category,
            'reversesubproducts'=>$reversesubproducts,
            'categoryproducts0' => $categoryproducts0,
            'categoryproducts1' => $categoryproducts1,
            'categoryproducts2' => $categoryproducts2,
        ]);
    }

    public function storesize(Request $request,$productid){
        $validator = Validator::make($request->all(),[
            'size' => ['required',Rule::unique('size_quantity_infos')->where(fn ($query) =>
                $query->where('subproduct_id',$productid)->where('size',$request->size)->whereNull('deleted_at')
        ),Rule::in(['XS','S','M','L','XL'])],
            'quantity' => 'required|numeric|min:1',
            // 'is_selling' => 'required',
        ]);
        if($validator->fails()){
            return response()->json([
                'status' =>  422,
                'errors' =>  $validator->errors(),
            ]);
        }else{
            $subproduct_id = SubProduct::where('id',$productid)->value('id');
            SizeQuantityInfo::create([
                'subproduct_id' => $subproduct_id,
                'size' => $request->size,
                'quantity' => $request->quantity,
                // 'is_selling' => $request->is_selling,
            ]);
            return response()->json([
                'status' => 200,
                'message' => 'サイズと数量を追加しました',
            ]);
        }
    }

    public function viewsize($subproduct_id){
        $size = SizeQuantityInfo::where('subproduct_id',$subproduct_id)->get();
        return response()->json([
            'status' => 200,
            'size' => $size,
        ]);
    }

    public function editsize($id){
        $size = SizeQuantityInfo::where('id',$id)->get();
        return response()->json([
            'status' => 200,
            'size' => $size,
        ]);
    }

    public function updatesize(Request $request,$id,$subproduct_id){
        $existsixe = SizeQuantityInfo::where('id',$id)->value('size');
        $validator = Validator::make($request->all(),[
            'size' => ($request->size === $existsixe) ? ['required',Rule::in(['XS','S','M','L','XL'])] : ['required',Rule::in(['XS','S','M','L','XL']),Rule::unique('size_quantity_infos')->where(fn ($query) =>
                $query->where('subproduct_id',$subproduct_id)->where('size',$request->size)->whereNull('deleted_at')
            )],
            'quantity' => 'required|numeric|min:1',
            // 'is_selling' => 'required',
        ]);
        if($validator->fails()){
            return response()->json([
                'status' =>  422,
                'errors' =>  $validator->errors(),
            ]);
        }else{
            SizeQuantityInfo::findOrFail($id)->update([
                'subproduct_id' => $subproduct_id,
                'size' => $request->size,
                'quantity' => $request->quantity,
                // 'is_selling' => $request->is_selling,
            ]);
            return response()->json([
                'status' => 200,
                'message' => 'サイズと数量を追加しました',
            ]);
        }
    }

    public function deletesize($id){
        $size = SizeQuantityInfo::findOrFail($id);
        if($size){
            $size->delete();
            return response()->json([
                'status'=>200,
                'message'=>'削除しました',
            ]);
        }else{
            return response()->json([
                'status'=>404,
                'message'=>'その商品サイズは存在しません',
            ]);
        }
    }
}
