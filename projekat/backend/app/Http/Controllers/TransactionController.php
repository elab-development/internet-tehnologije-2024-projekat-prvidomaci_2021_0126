<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Account;
use App\Models\Transaction;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Cache;

class TransactionController extends Controller
{

    public function index(Request $request)
    {
        $user = $request->user();
        $transactions = $user->accounts()->with('transactions')->get()->pluck('transactions')->flatten();

        return response()->json([
            'success' => true,
            'data' => $transactions,
        ]);
    }


    public function store(Request $request)
    {
        // I
        // I
        // V cmd command for log info and debugging
        // tail -f storage/logs/laravel.log

        Log::info('Transaction request received:', $request->all());

        $validator = Validator::make($request->all(), [
            'account_id' => 'required|exists:accounts,id',
            'recipient_account' => 'required|string',
            'recipient_name' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0.5',
            'amount_in_usd' => 'required|numeric',
            'currency' => 'required|string|size:3',
        ]);

        if ($validator->fails()) {
            Log::error('Validation failed:', $validator->errors()->toArray());
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors(),
            ], 422);
        }

        DB::beginTransaction();

        try {
            // account which is making a transaction
            Log::info('Fetching sender account:', ['account_id' => $request->account_id]);
            $fromAccount = Account::findOrFail($request->account_id);

            // sufficient fund check
            if ($fromAccount->balance < $request->amount_in_usd) {
                Log::error('Insufficient funds:', ['account_id' => $request->account_id, 'balance' => $fromAccount->balance, 'amount' => $request->amount]);
                return response()->json([
                    'success' => false,
                    'message' => 'Insufficient funds.',
                ], 400);
            }

            //subtracting money if theres sufficient funds
            $fromAccount->balance -= $request->amount_in_usd;
            $fromAccount->save();
            Log::info('Sender account updated:', ['account_id' => $request->account_id, 'new_balance' => $fromAccount->balance]);


            // account which is receiving funds
            Log::info('Fetching recipient account:', ['recipient_account' => $request->recipient_account]);
            $recipient_account = Account::where('account_number', $request->recipient_account)->first();

            if ($recipient_account) {
                $recipient_account->balance += $request->amount_in_usd;
                $recipient_account->save();
                Log::info('Recipient account updated:', ['account_id' => $recipient_account->id, 'new_balance' => $recipient_account->balance]);
            }

            $transaction = Transaction::create([
                'account_id' => $request->account_id,
                'recipient_name' => $request->recipient_name,
                'recipient_account' => $request->recipient_account,
                'amount' => $request->amount,
                'amount_in_usd' => $request->amount_in_usd,
                'currency' => $request->currency,
                'status' => $recipient_account ? 'completed' : 'pending',
                'transaction_number' => Str::uuid(),
            ]);
            Log::info('Transaction created:', $transaction->toArray());


            $cacheKey = 'user_profile_' . auth()->id();
            Cache::forget($cacheKey);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Transaction successful.',
                'data' => $transaction,
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Transaction failed:', ['error' => $e->getMessage()]);

            return response()->json([
                'success' => false,
                'message' => 'Transaction failed.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
