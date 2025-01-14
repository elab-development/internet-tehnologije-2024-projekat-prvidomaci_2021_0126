<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Account;
use App\Models\Card;
use app\Models\Transaction;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;


class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(UserAccountCardTransactionSeeder::class);
        
    }
}
