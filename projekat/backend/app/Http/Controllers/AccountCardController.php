<?php

namespace App\Http\Controllers;

use App\Models\Card;
use Illuminate\Container\Attributes\Database;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AccountCardController extends Controller
{

    public function index(Request $request)
    {
        $user = $request->user();

        $accounts = $user->accounts;

        if ($accounts->isEmpty()) {
            return response()->json(['message' => 'No accounts found for the user'], 404);
        }

        // double join
        // laravel (parameterized) query builder -> safe from SQL injection

        $cards = DB::table('cards')
            ->join('accounts', 'cards.account_id', '=', 'accounts.id') // join cards with accounts ON cards.account_id = accounts.id
            ->join('users', 'accounts.user_id', '=', 'users.id') // join accounts with users ON accounts.user_id = users.id
            ->whereIn('cards.account_id', $accounts->pluck('id')) // filter by LOGGED IN user's accounts
            ->select(
                'cards.*', // include every card field from card table
                'accounts.account_number', // include accounts_number from account table
                'users.name as user_name' // include user_name from user table
            )
            ->get(); //execute the query

        if ($cards->isEmpty()) {
            return response()->json(['message' => 'No cards found for the account'], 404);
        }

        return response()->json(['message' => 'Cards retrieved successfully', 'data' => $cards], 200);
    }
}
