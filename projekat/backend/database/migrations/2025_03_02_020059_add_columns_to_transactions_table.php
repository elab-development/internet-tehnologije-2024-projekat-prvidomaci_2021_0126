<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->string('recipient_name')->nullable();
            $table->string('recipient_account')->nullable();
            $table->string('transaction_number', 36)->unique();
            $table->string('currency', 3)->nullable();
            $table->string('amount_in_domain')->nullable();
            $table->string('currency_domain', 3)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->dropColumn('recipient_name');
            $table->dropColumn('recipient_account');
            $table->dropColumn('transaction_number');
            $table->dropColumn('currency');
            $table->dropColumn('amount_in_domain');
            $table->dropColumn('currency_domain');
        });
    }
};
