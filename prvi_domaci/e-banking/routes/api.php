<?php

use App\Http\Controllers\AccountController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\API\AuthController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::resource('accounts', AccountController::class);



Route::post('/auth/register', [AuthController::class, 'createUser']);
Route::post('/auth/login', [AuthController::class, 'loginUser']);

Route::group(['middleware' => ['auth:sanctum']], function () {
    Route::get('/profile', function(Request $request) {
        $data = auth()->user();
        return response()->json(['message' => "Welcome to user profile", 'data' => $data]);
    });

    Route::resource('accounts', AccountController::class)->only(['update','store','destroy']);
    Route::post('auth/logout', [AuthController::class, 'logoutUser']);  
});


Route::group(['middleware' => ['auth:admin-api']], function () {
    Route::get('/admin/dashboard', function () {
        return response()->json(['message' => 'Welcome to admin dashboard']);
    });
});

Route::post('/admin/login', [AuthController::class, 'loginAdmin']);
Route::post('/admin/register', [AuthController::class, 'createAdmin']);

Route::group(['middleware' => ['auth:admin-api']], function () {
    Route::get('/users/{id}', [UserController::class, 'show'])->name('users.show');
    Route::get('/users', [UserController::class, 'index'])->name('users.index');    
    Route::post('admin/logout', [AuthController::class, 'logoutAdmin']);
});