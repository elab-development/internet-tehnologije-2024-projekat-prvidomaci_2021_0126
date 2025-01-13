<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;
/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Account>
 */
class AccountFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'account_number'=>fake()->unique()->numerify('################'), //random popunjene cifre umesto #
            'user_id' => User::factory(),
            'currency' => 'USD',
            'balance' => fake()->randomFloat(2,0,1000000), //broj izmedju ova dva poslednja
            'is_active' => fake()->boolean(),
        ];
    }
}
