<?php

namespace App\Http\Controllers;

use App\Models\Card;
use Illuminate\Http\Request;

class AccountCardController extends Controller
{
    
    public function index(Request $request)
    {
        $user = $request->user();

        $accounts = $user->accounts;

        if ($accounts->isEmpty()) {
            return response()->json(['message' => 'No accounts found for the user'], 404);
        }

        $cards = $accounts->flatMap(function ($account) {
            return $account->cards;
        });

        if ($cards->isEmpty()) {
            return response()->json(['message' => 'No cards found for the account'], 404);
        }

        return response()->json(['message' => 'Cards retrieved successfully', 'data' => $cards], 200);
    }


}
