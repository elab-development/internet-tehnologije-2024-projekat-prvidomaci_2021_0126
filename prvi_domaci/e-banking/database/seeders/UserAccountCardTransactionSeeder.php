<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Account;
use App\Models\Card;
use App\Models\Transaction;

class UserAccountCardTransactionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
             
        User::factory(10)->create()->each(function ($user) {
            // Create 2 accounts for each user
            $user->accounts()->createMany(
                Account::factory(2)->make()->toArray()
            )->each(function ($account) {
                // For each account, create 1 transaction
                $account->transactions()->create(
                    Transaction::factory()->make()->toArray()
                );
        
                // For each account, create 2 cards
                $account->cards()->createMany(
                    Card::factory(2)->make()->toArray()
                );
            });
        });

    }
}
