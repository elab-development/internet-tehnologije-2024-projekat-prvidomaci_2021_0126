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

            // Convert the transaction amount to the recipient's currency
            $exchangeRates = $this->fetchExchangeRates(); // Fetch exchange rates
            $amountInUSD = $request->amount / $exchangeRates[$request->currency]; // Convert to USD
            $amountInRecipientCurrency = $amountInUSD *     // Convert to recipient's currency or use sender's currency if recipient account not found
                ($recipientAccount ? $exchangeRates[$recipientAccount->currency] : $exchangeRates[$request->currency_domain]);

            // Update sender's balance
            $fromAccount->balance -= $request->amount_in_domain;
            $fromAccount->balance_in_usd -= $amountInUSD;
            $fromAccount->save();
            Log::info('Sender account updated:', ['account_id' => $fromAccount->id, 'new_balance' => $fromAccount->balance, 'new_balance_in_usd' => $fromAccount->balance_in_usd]);

            // Update recipient's balance if the account exists in your database
            if ($recipientAccount) {
                $recipientAccount->balance += $amountInRecipientCurrency;
                $recipientAccount->balance_in_usd += $amountInUSD;
                $recipientAccount->save();
                Log::info('Recipient account updated:', ['account_id' => $recipientAccount->id, 'new_balance' => $recipientAccount->balance, 'new_balance_in_usd' => $recipientAccount->balance_in_usd]);
            } else {
                Log::info('Recipient account not found in local database. Proceeding with transaction.');
            }

            // Create the transaction
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

            // Invalidate the cache for the user profile
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
