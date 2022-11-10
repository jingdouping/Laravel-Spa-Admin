<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Credit;
use App\Models\Order;
use App\Models\SizeQuantityInfo;
use App\Models\SubProduct;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class OrderController extends Controller
{
    public function createOrder(Request $request){
        $user_id = auth('sanctum')->user()->id;
        // $carts = Cart::where('user_id',$user_id)->get();
        $carts = Cart::where('user_id',$user_id)->where('is_ordered',0)->with('sizequantityinfo.subproduct')->get();

        foreach($carts as $cart){
            $exist = $cart->sizequantityinfo()->where('quantity','>','0')->exists();
            if(!$exist){
                return response()->json([
                    'status' => 404,
                    'message' => '申し訳ございません、カート内の商品に数量が0の商品がございます。',
                ]);
            }
        }

        if(auth('sanctum')->check()){
            if($request->delivery_method ==='1'){
                $delivery_method = '通常配送';
            }else if($request->delivery_method === '2'){
                $delivery_method = 'お急ぎ便';
            }else if($request->delivery_method === '3'){
                $delivery_method = '日時指定便';
            }
            $user_id = auth('sanctum')->user()->id;
            if($request->payment_method === "クレジットカード" && $request->card_filter == ""){
                return response()->json([
                    'status' => 400,
                    'message' => 'クレジット情報を入力してください',
                ]);
            }else if($request->payment_method === '代金引換'){
                $user_id = auth('sanctum')->user()->id;
                $carts = Cart::where('user_id',$user_id)->where('is_ordered',0)->get();
                $order = Order::create([
                    'user_id' => $user_id,
                    'address_code' => $request->address_code,
                    'address1' => $request->address1,
                    'post_code' => $request->post_code,
                    'mansion_name' => $request->mansion_name,
                    'delivery_method' => $delivery_method,
                    'delivery_day' => $request->delivery_day,
                    'delivery_time' => $request->delivery_time,
                    'payment_method' => $request->payment_method,
                ]);
                foreach($carts as $cart){
                    $size_quantity_info_id = $cart->size_quantity_info_id;
                    $cartquantity = $cart->quantity;
                    $subproductquantity = SizeQuantityInfo::where('id',$size_quantity_info_id)->value('quantity');
                    SizeQuantityInfo::where('id',$size_quantity_info_id)->update([
                        'quantity' => $subproductquantity - $cartquantity
                    ]);
                    $cart->update([
                        'order_id' => $order->id,
                        'is_ordered' =>1,
                    ]);

                };



                // $username = auth('sanctum')->user()->name;
                // $email = auth('sanctum')->user()->email;

                // Mail::send('ordermail',[
                //     'orderitem' => $carts,
                //     'username' => $username,
                // ],function ($message) use ($email) {
                //     $message->to($email)
                //     ->subject('テストタイトル');
                // });


                return response()->json([
                    'status' => 200,
                    'message' => '注文完了しました',
                ]);
            }else if($request->payment_method === 'クレジットカード' && $request->card_filter !== ''){
                $user_id = auth('sanctum')->user()->id;
                $carts = Cart::where('user_id',$user_id)->where('is_ordered',0)->get();
                $order = Order::create([
                    'user_id' => $user_id,
                    'credit_number' => $request->card_number,
                    'expiry_data' => $request->expiry_date,
                    'cvc' => $request->cvc,
                    'credit_name' => $request->card_name,
                    'address_code' => $request->address_code,
                    'address1' => $request->address1,
                    'post_code' => $request->post_code,
                    'mansion_name' => $request->mansion_name,
                    'delivery_method' => $delivery_method,
                    'delivery_day' => $request->delivery_day,
                    'delivery_time' => $request->delivery_time,
                    'payment_method' => $request->payment_method,
                ]);
                foreach($carts as $cart){
                    $size_quantity_info_id = $cart->size_quantity_info_id;
                    $cartquantity = $cart->quantity;
                    $subproductquantity = SizeQuantityInfo::where('id',$size_quantity_info_id)->value('quantity');
                    SizeQuantityInfo::where('id',$size_quantity_info_id)->update([
                        'quantity' => $subproductquantity - $cartquantity
                    ]);
                    $cart->update([
                        'order_id' => $order->id,
                        'is_ordered' =>1,

                    ]);
                    // $cart->delete();
                }
                

            //    $username = auth('sanctum')->user()->name;
            //    $email = auth('sanctum')->user()->email;

            //    Mail::send('ordermail',[
            //        'orderitem' => $carts,
            //         'username' => $username,
            //     ],function ($message) use ($email) {
            //         $message->to($email)
            //         ->subject('テストタイトル');
            //     });


                return response()->json([
                    'status' => 200,
                    'message' => '注文完了しました',
                    'cart' => $carts
                ]);
            }
        }else{
            return response()->json([
                'status' => 401,
                'message' => '',
            ]);
        }
    }

    public function vieworders(){
        $orders = Order::with(['user','cart'])->get();

        return response()->json([
            'status' => 200,
            'orders' => $orders,
        ]);
    }
}
