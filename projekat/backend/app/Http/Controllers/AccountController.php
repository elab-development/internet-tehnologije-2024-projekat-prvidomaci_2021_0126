<?php

namespace App\Http\Controllers;

use App\Http\Resources\AccountResource;
use App\Models\Account;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class AccountController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    // public function index()
    // {
    //     $accounts = Account::all();
    //     return AccountResource::collection($accounts);
    // }

    public function index(Request $request)
    {
        if (Cache::has('accounts')) {
            Log::info('Fetching accounts from cache.');
        } else {
            Log::info('Fetching accounts from database.');
        }

        // Use Cache::remember to cache the results for 10 minutes
        $accounts = Cache::remember('accounts', 10, function () {
            return Account::paginate(20); // Paginate the results
        });

        return response()->json([
            'status' => true,
            'message' => 'Accounts fetched.',
            'data' => $accounts,
        ]);
    }


    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */

    public function store(Request $request)
    {
        // Validate the request
        $validator = Validator::make($request->all(), [
            'balance' => 'required|numeric|min:0',
            'balance_in_usd' => 'required|numeric|min:0',
            'currency' => 'required|string|size:3',
            'user_id' => 'required|exists:users,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors(),
            ], 422);
        }

        if (!Auth::check()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. Please log in.',
            ], 401);
        }

        $accountNumber = Str::random(16);

        $account = Account::create([
            'account_number' => $accountNumber,
            'currency' => strtoupper($request->currency),
            'balance' => $request->balance,
            'balance_in_usd' => $request->balance_in_usd,
            'is_active' => true,
            'user_id' => $request->user_id,
        ]);

        // Invalidate the cache for the user profile
        $cacheKey = 'user_profile_' . $request->user_id;

        // Log the cache key and whether it exists
        Log::info('Cache key to invalidate:', ['key' => $cacheKey]);
        Log::info('Cache exists before invalidation:', ['exists' => Cache::has($cacheKey)]);

        Cache::forget($cacheKey);

        // Log whether the cache was successfully invalidated
        Log::info('Cache exists after invalidation:', ['exists' => Cache::has($cacheKey)]);

        return response()->json([
            'success' => true,
            'message' => 'Account created successfully.',
            'data' => $account,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Account $account)
    {
        return new AccountResource($account);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Account $account)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Account $account)
    {
        $validator = Validator::make($request->all(), [
            'account_number' => 'required|string|size:16|unique:accounts,account_number,' . $account->id,
            'currency' => 'required|string|size:3',
            'balance' => 'required|numeric|min:0|max:20000',
            'is_active' => 'required|boolean',
            //'is_active' => 'required|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }


        $account->account_number = $request->account_number;
        $account->currency = strtoupper($request->currency);
        $account->balance = $request->balance;
        $account->is_active = $request->is_active;

        $account->save();
        //$account->update(['is_active' => $request->is_active]);

        return response()->json([
            'message' => 'Account updated successfully.',
            'data' => new AccountResource($account),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Account $account)
    {
        $account->delete();
        return response()->json('Account is deleted successfully.');
    }
}
