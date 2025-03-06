<?php

namespace App\Http\Controllers;

use App\Models\Card;
use Illuminate\Container\Attributes\Database;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class AccountCardController extends Controller
{

    public function index(Request $request)
    {
        $user = $request->user();

        Log::info('Authenticated user:', ['user' => $user]);

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
        // Extract account IDs from the user's accounts
        $accountIds = $accounts->pluck('id');

        // Query to fetch cards associated with the user's accounts
        $cards = DB::table('cards')
            ->join('accounts', 'cards.account_id', '=', 'accounts.id') // Join cards with accounts
            ->join('users', 'accounts.user_id', '=', 'users.id') // Join accounts with users
            ->whereIn('cards.account_id', $accountIds) // Filter by the user's account IDs
            ->select(
                'cards.*', // Select all card fields
                'accounts.account_number', // Include account number
                'users.name as user_name' // Include user name
            )
            ->get();

        // Check if any cards were found
        if ($cards->isEmpty()) {
            return response()->json(['message' => 'No cards found for the user\'s accounts'], 404);
        }

        // Return the cards with a success message
        return response()->json([
            'message' => 'Cards retrieved successfully',
            'data' => $cards,
        ], 200);
    }
}


        // $cards = DB::table('cards')
        //     ->join('accounts', 'cards.account_id', '=', 'accounts.id') // join cards with accounts ON cards.account_id = accounts.id
        //     ->join('users', 'accounts.user_id', '=', 'users.id') // join accounts with users ON accounts.user_id = users.id
        //     ->whereIn('cards.account_id', $accounts->pluck('id')) // filter by LOGGED IN user's accounts
        //     ->select(
        //         'cards.*', // include every card field from card table
        //         'accounts.account_number', // include accounts_number from account table
        //         'users.name as user_name' // include user_name from user table
        //     )
        //     ->get(); //execute the query