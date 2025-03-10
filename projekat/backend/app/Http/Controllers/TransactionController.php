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
use Illuminate\Support\Facades\Http;

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

        //validator
        Log::info('Transaction request received:', $request->all());

        $validator = Validator::make($request->all(), [
            'account_id' => 'required|exists:accounts,id',
            'recipient_account' => 'required|string',
            'recipient_name' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0.5',
            'amount_in_domain' => 'required|numeric',
            'currency' => 'required|string|size:3',
            'currency_domain' => 'required|string|size:3',
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
            // fetch sender account
            Log::info('Fetching sender account:', ['account_id' => $request->account_id]);
            $fromAccount = Account::findOrFail($request->account_id);

            // sufficient fund check
            if ($fromAccount->balance < $request->amount_in_domain) {
                Log::error('Insufficient funds:', ['account_id' => $request->account_id, 'balance' => $fromAccount->balance, 'amount' => $request->amount]);
                return response()->json([
                    'success' => false,
                    'message' => 'Insufficient funds.',
                ], 400);
            }

            // fetch recipient account
            Log::info('Fetching recipient account:', ['recipient_account' => $request->recipient_account]);
            $recipientAccount = Account::where('account_number', $request->recipient_account)->first();

            if ($recipientAccount == $fromAccount) {

                return response()->json([
                    'success' => false,
                    'message' => 'You cannot send money to yourself!',
                    'error' => 'You cannot send money to yourself!',
                ], 500);
            }
            // convert the transaction amount to the recipient's currency
            $exchangeRates = $this->fetchExchangeRates();
            $amountInUSD = $request->amount / $exchangeRates[$request->currency];
            $amountInRecipientCurrency = $amountInUSD *
                ($recipientAccount ? $exchangeRates[$recipientAccount->currency] : $exchangeRates[$request->currency_domain]);

            // updating user's balance
            $fromAccount->balance -= $request->amount_in_domain;
            $fromAccount->balance_in_usd -= $amountInUSD;
            $fromAccount->save();
            Log::info('Sender account updated:', ['account_id' => $fromAccount->id, 'new_balance' => $fromAccount->balance, 'new_balance_in_usd' => $fromAccount->balance_in_usd]);

            // if recipient account exists in DB, update its balance
            if ($recipientAccount) {
                $recipientAccount->balance += $amountInRecipientCurrency;
                $recipientAccount->balance_in_usd += $amountInUSD;
                $recipientAccount->save();

                // clear the recipient's cache
                $recipientCacheKey = 'user_profile_' . $recipientAccount->user_id;
                Cache::forget($recipientCacheKey);

                Log::info('Recipient account updated:', ['account_id' => $recipientAccount->id, 'new_balance' => $recipientAccount->balance, 'new_balance_in_usd' => $recipientAccount->balance_in_usd]);
            } else {
                Log::info('Recipient account not found in local database. Proceeding with transaction.');
            }

            $transaction = Transaction::create([
                'account_id' => $request->account_id,
                'recipient_name' => $request->recipient_name,
                'recipient_account' => $request->recipient_account,
                'amount' => $request->amount,
                'amount_in_domain' => $request->amount_in_domain,
                'currency' => $request->currency,
                'currency_domain' => $request->currency_domain,
                'status' => 'completed',
                'transaction_number' => Str::uuid(),
            ]);
            Log::info('Transaction created:', $transaction->toArray());

            // removing cached data
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

    protected function fetchExchangeRates()
    {
        $response = Http::get('https://api.exchangerate-api.com/v4/latest/USD');
        if ($response->successful()) {
            return $response->json()['rates'];
        }
        throw new \Exception('Failed to fetch exchange rates.');
    }
}
