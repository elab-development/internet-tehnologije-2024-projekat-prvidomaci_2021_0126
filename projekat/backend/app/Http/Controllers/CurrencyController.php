<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class CurrencyController extends Controller
{
    protected $apiUrl = 'https://api.exchangerate-api.com/v4/latest/USD';

    public function fetchExchangeRates()
    {
        $response = Http::get($this->apiUrl);

        if ($response->successful()) {
            return $response->json()['rates'];
        }

        return null;
    }

    public function getExchangeRates(Request $request)
    {
        $currencyService = new CurrencyController();
        $rates = $currencyService->fetchExchangeRates();

        if ($rates) {
            return response()->json([
                'success' => true,
                'rates' => $rates,
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Failed to fetch exchange rates.',
        ], 500);
    }
}
