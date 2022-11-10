<?php

namespace App\Providers;

use App\Models\Admin;
use App\Models\User;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Validator;

class ValidationServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {
        Validator::extend('hankaku', function ($attribute, $value, $parameters, $validator) {
            return preg_match('/^[a-zA-Z]+$/', $value);
        });
        Validator::extend('sizeval', function ($attribute, $value, $parameters, $validator) {
            return preg_match('/^[a-zA-Z.0-9]+$/', $value);
        });
        Validator::extend('addresscode', function ($attribute, $value, $parameters, $validator) {
            return preg_match('/^[0-9]{3}-[0-9]{4}$/', $value);
        });
        Validator::extend('doesntexistemail', function ($attribute, $value, $parameters, $validator) {
            return User::where('email',$value)->exists();
        });
        Validator::extend('existadminname', function ($attribute, $value, $parameters, $validator) {
            return Admin::where('name',$value)->exists();
        });
    }
}
