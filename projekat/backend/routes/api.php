<?php

use App\Http\Controllers\AccountCardController;
use App\Http\Controllers\AccountController;
use App\Http\Controllers\AccountTransactionController;
use App\Http\Controllers\AdminController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\Api\AuthController;


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');



Route::post('/auth/register', [AuthController::class, 'createUser']);
Route::post('/auth/login', [AuthController::class, 'loginUser']);
Route::post('/auth/forgot-password', [AuthController::class, 'forgotPassword']);

Route::group(['middleware' => ['auth:sanctum']], function () {
    Route::get('/profile', function (Request $request) {
        $data = auth()->user()->load('accounts');
        return response()->json([
            'message' => "Welcome to user profile",
            'user-data' => $data
        ]);
    });

    Route::get('/profile/cards', [AccountCardController::class, 'index'])->name('profile.cards');
    Route::get('/profile/transactions', [AccountTransactionController::class, 'index'])->name('profile.transactions');

    Route::resource('/accounts', AccountController::class)->only(['update', 'store', 'destroy']);
    Route::post('auth/logout', [AuthController::class, 'logoutUser']);
});

Route::post('/admin/login', [AuthController::class, 'loginAdmin']);
Route::post('/admin/register', [AuthController::class, 'createAdmin']);

Route::group(['middleware' => ['auth:admin-api']], function () {
    Route::get('/users/{id}', [UserController::class, 'show'])->name('users.show');
    Route::get('/users', [UserController::class, 'index'])->name('users.index');
    Route::post('admin/logout', [AuthController::class, 'logoutAdmin']);
    Route::resource('accounts', AccountController::class)->only(['index', 'show']);
});

Route::post('/manager/login', [AuthController::class, 'loginManager']);
Route::post('/manager/register', [AuthController::class, 'createManager']);

Route::group(['middleware' => ['auth:manager-api']], function () {
    // Route::get('/users/{id}', [UserController::class, 'show'])->name('users.show');
    // Route::get('/users', [UserController::class, 'index'])->name('users.index');    
    Route::get('/admins', [AdminController::class, 'index']);
    Route::post('manager/logout', [AuthController::class, 'logoutManager']);
});
