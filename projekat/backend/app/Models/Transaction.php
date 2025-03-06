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
        'amount_in_domain',
        'currency',
        'currency_domain',
        'status',
        'transaction_number',
    ];

    protected $dates = ['created_at'];

    public function getCreatedAtAttribute($value)
    {
        return \Carbon\Carbon::parse($value)->format('Y-m-d'); // format yyyy-mm-dd
    }

    public function account()
    {
        return $this->belongsTo(Account::class);
    }
}
