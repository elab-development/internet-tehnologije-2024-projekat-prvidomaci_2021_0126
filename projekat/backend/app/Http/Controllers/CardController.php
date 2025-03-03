<?php

namespace App\Http\Controllers;

use App\Models\Card;
use Illuminate\Http\Request;

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
}
