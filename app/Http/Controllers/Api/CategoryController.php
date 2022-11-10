<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PrimaryCategory;
use App\Models\Product;
use App\Models\SecondaryCategory;
use App\Models\SubProduct;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class CategoryController extends Controller
{

    public function firstcategoryindex(){
        // $primary_category = PrimaryCategory::all();
        $primary_category = PrimaryCategory::with('secondarycategory')->get();
        return response()->json([
            'status'=>200,
            'primary_category'=>$primary_category,
            // 'prim_category'=>$prim_category
        ]);
    }

    public function secondcategoryindex(){
        $secondary_category = SecondaryCategory::with('primarycategory')->get();
        return response()->json([
            'status'=>200,
            'secondary_category'=>$secondary_category,
        ]);
    }

    public function firstcategorystore(Request $request){

        $validator = Validator::make($request->all(),[
            'primary_category_name' => 'required|max:191|unique:primary_categories',
        ]);

        if($validator->fails()){
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors(),
            ]);
        }else{

                PrimaryCategory::create([
                    'primary_category_name' => $request->primary_category_name,
                    'created_at' => Carbon::now(),
                ]);
            return response()->json([
                'status' => 200,
                'message' => '第一カテゴリーを追加しました',
            ]);
        }

    }

    public function secondcategorystore(Request $request){
        // return response()->json([
        //     'status' => 400,
        //     'primary_category_id' => $request->primary_category_id,
        //     'secondary_category_name' => $request->secondary_category_name,
        // ]);

        $validator = Validator::make($request->all(),[
            'primary_category_id' => 'required|max:191',
            'secondary_category_name' => ['required','max:191',Rule::unique('secondary_categories')->where(fn ($query) =>
            $query->where('primary_category_id',$request->primary_category_id)->where('secondary_category_name',$request->secondary_category_name))],
        ]);

        if($validator->fails()){
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors(),
            ]);
        }else{

                SecondaryCategory::create([
                    'secondary_category_name' => $request->secondary_category_name,
                    'primary_category_id' => $request->primary_category_id,
                    'created_at' => Carbon::now(),
                ]);
            return response()->json([
                'status' => 200,
                'message' => '第二カテゴリーを追加しました',
            ]);
        }

    }

    public function firstcategoryedit($categoryid){
        $primary_category = PrimaryCategory::find($categoryid);

        if($primary_category){
            return response()->json([
                'status'=>200,
                'primary_category'=>$primary_category,
            ]);
        }else{
            return response()->json([
                'status'=>404,
                'message'=>'該当カテゴリーが見つかりませんでした',
            ]);
        }
    }

    public function secondcategoryedit($categoryid){
        $secondary_category = SecondaryCategory::with('primarycategory')->where('id',$categoryid)->get();
        // $secondary_category_name = SecondaryCategory::where('id',$categoryid)->get('secondary_category_name');
        $primary_category = PrimaryCategory::all();
        // $catpri = SecondaryCategory::with('primarycategory')->where('id',$categoryid)->value('primary_category_name');

        if($secondary_category){
            return response()->json([
                'status'=>200,
                'secondary_category'=>$secondary_category,
                'primary_category'=>$primary_category,
                // 'catpri'=>$catpri,
            ]);
        }else{
            return response()->json([
                'status'=>404,
                'message'=>'該当カテゴリーが見つかりませんでした',
            ]);
        }
    }

    public function firstcategoryupdate(Request $request,$id){
        $validator = Validator::make($request->all(),[
            'primary_category_name' => 'required|max:191|unique:primary_categories',
        ]);

        if($validator->fails()){
            return response()->json([
                'status' => 422,
                'errors' => $validator->errors(),
            ]);
        }else{
            PrimaryCategory::findOrFail($id)->update([
                'primary_category_name' => $request->primary_category_name,
            ]);

            return response()->json([
                'status' => 200,
                'message' => '第一カテゴリーを更新しました',
            ]);
        }
    }

    public function secondcategoryupdate(Request $request,$id){
        $existname = SecondaryCategory::where('id',$id)->value('secondary_category_name');

        $validator = Validator::make($request->all(),[
            'primary_category_id' => 'required|max:191',
            'secondary_category_name' => ($request->secondary_category_name === $existname) ? '' : ['required','max:191',Rule::unique('secondary_categories')->where(fn ($query) =>
            $query->where('primary_category_id',$request->primary_category_id)->where('secondary_category_name',$request->secondary_category_name))],
        ]);

        if($validator->fails()){
            return response()->json([
                'status' => 422,
                'errors' => $validator->errors(),
            ]);
        }else{
            secondaryCategory::findOrFail($id)->update([
                'primary_category_id' => $request->primary_category_id,
                'secondary_category_name' => $request->secondary_category_name,
            ]);

            return response()->json([
                'status' => 200,
                'message' => '第二カテゴリーを更新しました',
            ]);
        }
    }

    public function firstcategorydelete($id){
        $primary_category = PrimaryCategory::findOrFail($id);
        if($primary_category){
            $secondcategories = SecondaryCategory::where('primary_category_id',$id)->get()->toArray();
            $secondcategoriescount = count($secondcategories);
            $seccount = 0;
            while($seccount < $secondcategoriescount){
                $secondcategoryid = $secondcategories[$seccount]['id'];
                $products = Product::where('secondary_category_id',$secondcategoryid)->get()->toArray();
                $productscount = count($products);
                $procount = 0;
                while($procount < $productscount){
                    $productid = $products[$procount]['id'];
                    $subproducts = SubProduct::where('product_id',$productid)->get()->toArray();
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
                    $procount++;
                }
                $seccount++;
            }

            $primary_category->delete();
            return response()->json([
                'status'=>200,
                'message'=>'第一カテゴリーを削除しました',
            ]);
        }else{
            return response()->json([
                'status'=>404,
                'message'=>'該当カテゴリーが見つかりませんでした',
            ]);
        }
    }

    public function secondcategorydelete($id){
        $Secondary_category = SecondaryCategory::findOrFail($id);
        if($Secondary_category){
            $products = Product::where('secondary_category_id',$id)->get()->toArray();
            $productscount = count($products);
            $procount = 0;
            while($procount < $productscount){
                $productid = $products[$procount]['id'];
                $subproducts = SubProduct::where('product_id',$productid)->get()->toArray();
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
                $procount++;
            }

            $Secondary_category->delete();


            return response()->json([
                'status'=>200,
                'message'=>'第二カテゴリーを削除しました',
            ]);
        }else{
            return response()->json([
                'status'=>404,
                'message'=>'該当第二カテゴリーが見つかりませんでした',
            ]);
        }
    }
}
