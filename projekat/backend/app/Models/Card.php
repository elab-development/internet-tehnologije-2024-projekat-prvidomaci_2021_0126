<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Card extends Model
{
    /** @use HasFactory<\Database\Factories\CardFactory> */
    use HasFactory;

    protected $fillable = [
        'card_number',
        'expiry_date',
        'cvv',
        'account_id',
    ];

    public function account(){
        return $this->belongsTo(Account::class);
    }

}
