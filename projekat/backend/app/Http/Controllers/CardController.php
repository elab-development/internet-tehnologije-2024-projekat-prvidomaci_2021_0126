<?php

namespace App\Http\Controllers;

use App\Models\Card;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

class CardController extends Controller
{
    public function destroy(Request $request)
    {
        $card = Card::find($request->id);
        if (!$card) {
            return response()->json(['error' => 'Card not found'], 404);
        }

        $card->delete();
        return response()->json('Card is deleted successfully.');
    }

    public function store(Request $request, $accountId)
    {
        $request->validate([
            'card_type' => 'required|in:credit,debit,prepaid',
            'payment_type' => 'required|in:visa,mastercard',
        ]);

        $card = Card::create([
            'account_id' => $accountId,
            'card_type' => $request->card_type,
            'payment_type' => $request->payment_type,
            'card_number' => Str::random(16),
            'expiry_date' => Carbon::now()->addYears(3)->format('m/y'),
            'cvv' => rand(100, 999),
        ]);

        return response()->json([
            'message' => 'Card created successfully',
            'data' => $card,
        ], 201);
    }
}
