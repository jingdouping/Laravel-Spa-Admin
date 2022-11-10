<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    public function register(Request $request){
        $validator = Validator::make($request->all(),[
            'name' => 'required|max:191',
            'email' => 'required|email|max:191|unique:users,email',
            'password' => 'required|min:8|confirmed',
            'address_code' => 'required|addresscode',
            'address1' => 'required',
            'post_code' =>'required',
        ]);
        if($validator->fails()){
            return response()->json([
                'validation_errors' => $validator->errors(),
            ]);
        }
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' =>  Hash::make($request->password),
            'password_confirmation' =>  Hash::make($request->confirm_password),
            'address_code' => $request->address_code,
            'address1' => $request->address1,
            'post_code' =>$request->post_code,
            'mansion_name' => $request->mansion_name,
        ]);
        Auth::login($user);
        // $session = $request->session()->regenerate();
        return response()->json([
            'status' => 200,
            'username' => $user->name,
            // 'session' => $session,
            'message' => '登録完了しました',
        ]);
    }


    public function login(Request $request){
        // $input = $request->all();
        $validator = Validator::make($request->all(),[
            'email' => 'required|max:191|email',
            'password' => 'required',
        ]);

        if($validator->fails()){
            return response()->json([
                'validation_errors' => $validator->errors(),
            ]);
        }
        $user = User::where('email', $request->email)->first();

        if(!$user){
            return response()->json([
                'status' => 401,
                'message' => 'メールアドレスが違います',
            ]);
        }

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'status' => 401,
                'message' => 'パスワードが違います',
            ]);
        }


        if (Auth::attempt($validator->validate())) {
        // if (Auth::guard('users')->attempt($validator->validate())) {
        // if (Auth::guard('users')->attempt(['email' => $input['email'],'password' => $input['password']])) {
            // Auth::guard('users')->login($user);
            $session = $request->session()->regenerate();
            return response()->json([
                'status' => 200,
                'username' => $user->name,
                'user' => $user,
                'session' => $session,
                // 'token' => $token,
                'message' => 'Logged In Successfully',
                // 'role' => $role,
            ]);
        }
    }


    public function adminlogin(Request $request){
        $validator = Validator::make($request->all(),[
            'name' => 'required|existadminname',
            'password' => 'required',
        ]);

        if($validator->fails()){
            return response()->json([
                'validation_errors' => $validator->errors(),
            ]);
        }
        $admin = Admin::where('name', $request->name)->first();
        if (!$admin || !Hash::check($request->password, $admin->password)) {
            return response()->json([
                'status' => 401,
                'message' => 'パスワードが違います',
            ]);
        }

        if (Auth::attempt($validator->validate())) {
        // if (auth()->guard('admins')->attempt($validator->validate())) {
            $session = $request->session()->regenerate();
            return response()->json([
                'status' => 200,
                'session' => $session,
                // 'token' => $token,
                'message' => 'Logged In Successfully',
                // 'role' => $role,
            ]);
        }
    }

    public function adminlogout(Request $request){
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return response()->json([
            'status'=>200,
            'message'=>'ログアウトしました',
        ]);
    }

    public function logout(Request $request){
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return response()->json([
            'status'=>200,
            'message'=>'ログアウトしました',
        ]);
    }

    public function AdminCheck(){
        if(Auth::check()){
            if(auth()->user()->tokenCan('server:admin')){//personal_access_tokensテーブルのabilitiesカラムから
                return response()->json([
                    'status' => 200,
                ]);
            }else{
                return response()->json([
                    'message' => 'アクセスが拒否されました',
                ],403);
            }
        }else{
            return response()->json([
                'status' => 401,
                'message' => 'まずログインしてください',
            ]);
        }
    }
}
