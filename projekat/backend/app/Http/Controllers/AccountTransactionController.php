<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;

class AccountTransactionController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $accounts = $user->accounts;

        if ($accounts->isEmpty()) {
            return response()->json(['message' => 'No accounts found for the user'], 404);
        }

        $transactions = $accounts->flatMap(function ($account) {
            return $account->cards;
        });

        if ($transactions->isEmpty()) {
            return response()->json(['message' => 'No transactions found for the account'], 404);
        }

        return response()->json(['message' => 'Transactions retrieved successfully', 'data' => $transactions], 200);
    }
}
