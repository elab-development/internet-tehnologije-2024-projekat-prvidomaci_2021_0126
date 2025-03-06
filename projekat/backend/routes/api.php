<?php

use App\Http\Controllers\AccountCardController;
use App\Http\Controllers\AccountController;
use App\Http\Controllers\AccountTransactionController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\CurrencyController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\CardController;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

// I
// I
// V cmd command for log info and debugging
// tail -f storage/logs/laravel.log


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::get('/exchange-rates', [CurrencyController::class, 'getExchangeRates']);

Route::middleware('guest')->group(function () {
    Route::post('/auth/register', [AuthController::class, 'createUser']);
    Route::post('/auth/login', [AuthController::class, 'login']);
    Route::post('/auth/forgot-password', [AuthController::class, 'forgotPassword']);
});


Route::group(['middleware' => ['auth:sanctum']], function () {

    Route::get('/profile', function (Request $request) {
        $cacheKey = 'user_profile_' . auth()->id();
        Log::info('Cache key: ' . $cacheKey);

        if (Cache::has($cacheKey)) {
            Log::info('Fetching profile data from cache for user ' . auth()->id());
        } else {
            Log::info('Fetching profile data from database for user ' . auth()->id());
        }

        /*cuvanje je u sekundama, zato 60 min * 60 sek/min*/
        $data = Cache::remember($cacheKey, 60 * 60, function () use ($request) {
            $user = auth()->user()->load('accounts');
            return [
                'message' => "Welcome to user profile",

                'user-data' => $user,
            ];
        });

        return response()->json($data);
    });
    Route::post('/delete-card', [CardController::class, 'destroy']);

    Route::post('/new-transaction', [TransactionController::class, 'store']);
    Route::post('/transactions', [TransactionController::class, 'index']);

    Route::get('/profile/cards', [AccountCardController::class, 'index'])->name('profile.cards');
    Route::get('/profile/transactions', [AccountTransactionController::class, 'index'])->name('profile.transactions');

    Route::post('auth/logout', [AuthController::class, 'logoutUser']);
});

Route::post('/admin/register', [AuthController::class, 'createAdmin']);

Route::group(['middleware' => ['auth:admin-api']], function () {
    Route::get('/users', [UserController::class, 'index']);
    Route::get('/users/{id}', [UserController::class, 'show']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);

    Route::resource('accounts', AccountController::class)->only(['index', 'show']);
    Route::post('/new-account', [AccountController::class, 'store']);

    Route::get('/accounts/{accountId}/cards', [AccountCardController::class, 'index1']);
    Route::post('/accounts/{accountId}/cards', [CardController::class, 'store']);

    Route::post('admin/logout', [AuthController::class, 'logoutAdmin']);
});

Route::post('/manager/register', [AuthController::class, 'createManager']);

Route::group(['middleware' => ['auth:manager-api']], function () {
    Route::get('/admins', [AdminController::class, 'index']);
    Route::post('/new-admin', [AuthController::class, 'createAdmin']);

    Route::delete('/admins/{id}', [AdminController::class, 'destroy']);

    Route::post('manager/logout', [AuthController::class, 'logoutManager']);
});
