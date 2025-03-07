<?php

namespace App\Http\Controllers;

use App\Models\Card;
use Illuminate\Container\Attributes\Database;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Models\Account;

class AccountCardController extends Controller
{

    public function index(Request $request)
    {
        $user = $request->user();


        if (!$user) {
            return response()->json(['message' => 'User not authenticated'], 401);
        }

        $accounts = $user->accounts;

        Log::info('User accounts:', ['accounts' => $accounts]);

        if ($accounts === null) {
            return response()->json(['message' => 'Failed to retrieve accounts for the user'], 500);
        }

        if ($accounts->isEmpty()) {
            return response()->json(['message' => 'No accounts found for the user'], 404);
        }
        // extract account ids from users accounts
        $accountIds = $accounts->pluck('id');

        // query to fetch cards associated with the user's accounts
        $cards = DB::table('cards')
            ->join('accounts', 'cards.account_id', '=', 'accounts.id') // join cards with accounts
            ->join('users', 'accounts.user_id', '=', 'users.id') // join accounts with users
            ->whereIn('cards.account_id', $accountIds) // filter by the user's account IDs
            ->select(
                'cards.*', // select all card fields
                'accounts.account_number', // include account number
                'users.name as user_name' // include user name
            )
            ->get();

        if ($cards->isEmpty()) {
            return response()->json(['message' => 'No cards found for the user\'s accounts'], 404);
        }

        return response()->json([
            'message' => 'Cards retrieved successfully',
            'data' => $cards,
        ], 200);
    }


    public function index1(Request $request, $accountId)
    {
        $account = Account::find($accountId);

        if (!$account) {
            return response()->json(['message' => 'Account not found'], 404);
        }

        $cards = DB::table('cards')
            ->join('accounts', 'cards.account_id', '=', 'accounts.id')
            ->join('users', 'accounts.user_id', '=', 'users.id')
            ->where('cards.account_id', $accountId)
            ->select(
                'cards.*',
                'accounts.account_number',
                'users.name as user_name'
            )
            ->get();



        if ($cards->isEmpty()) {
            return response()->json(['message' => 'No cards found for this account'], 404);
        }
        return response()->json([
            'message' => 'Cards retrieved successfully',
            'data' => $cards,
        ], 200);
    }
}
