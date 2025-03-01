<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use app\Models\Account;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Card>
 */
class CardFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'card_number' => fake()->unique()->creditCardNumber,
            'expiry_date' => fake()->creditCardExpirationDateString,
            'cvv' => fake()->numberBetween(100,999),
            'account_id' => Account::factory(),
        ];
    }
}
