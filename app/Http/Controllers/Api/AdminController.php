<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;

class AdminController extends Controller
{
    public function index(){
        $admins = Admin::all();

        return response()->json([
            'status' => 200,
            'admins' => $admins,
        ]);
    }

    public function adminstore(Request $request){
        $validator = Validator::make($request->all(),[
            'name' => 'required|max:191|unique:admins,name',
            'password' => 'required|min:8|confirmed',
        ]);
        if($validator->fails()){
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors(),
            ]);
        }
        $admin = Admin::create([
            'name' => $request->name,
            'password' =>  Hash::make($request->password),
            'password_confirmation' =>  Hash::make($request->confirm_password),
        ]);
        return response()->json([
            'status' => 200,
            'admin' => $admin,
            // 'session' => $session,
            'message' => '登録完了しました',
        ]);
    }
}
