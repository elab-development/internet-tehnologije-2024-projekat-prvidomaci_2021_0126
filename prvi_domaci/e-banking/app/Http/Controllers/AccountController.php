<?php

namespace App\Http\Controllers;

use App\Http\Resources\AccountResource;
use App\Models\Account;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;

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
        $query = Account::query();
        //kesiranje 
        $accounts = Cache::remember('accounts', 10, function () use ($query) {
            return $query->paginate(20);
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
        $validator = Validator::make($request->all(), [
            'account_number' => 'required|string|size:16|unique:accounts,account_number',
            'currency' => 'required|string|size:3',
            'balance' => 'required|numeric|min:0|max:20000',
            'is_active' => 'required|boolean',
            'user_id' => 'required|exists:users,id',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422); // 422 
        }

        $account = Account::create([
            'account_number' => $request->account_number,
            'currency' => strtoupper($request->currency), 
            'balance' => $request->balance,
            'is_active' => $request->is_active,
            'user_id' => Auth::user()->id,
        ]);
    
        
        return response()->json([
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
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422); 
        }

        $account->account_number = $request->account_number;
        $account->currency = strtoupper($request->currency); 
        $account->balance = $request->balance;
        $account->is_active = $request->is_active;

        $account->save();    
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
