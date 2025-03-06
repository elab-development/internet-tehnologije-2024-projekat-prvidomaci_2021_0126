<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Account extends Model
{
    /** @use HasFactory<\Database\Factories\AccountFactory> */
    use HasFactory;

    protected $fillable = [
        'account_number',
        'user_id',
        'currency',
        'balance',
        'balance_in_usd',
        'is_active',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function cards()
    {
        return $this->hasMany(Card::class);
    }
    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }
}
