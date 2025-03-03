<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


class Transaction extends Model
{
    /** @use HasFactory<\Database\Factories\TransactionFactory> */
    use HasFactory;

    protected $fillable = [
        'account_id',
        'recipient_name',
        'recipient_account',
        'amount',
        'amount_in_usd',
        'currency',
        'status',
        'transaction_number',
    ];

    public function account()
    {
        return $this->belongsTo(Account::class);
    }
}
