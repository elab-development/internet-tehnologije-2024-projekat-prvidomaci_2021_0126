<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use App\Models\User;
use App\Models\Admin;
use App\Models\Manager;

class UniqueAcrossTables implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        // check if email exists in any of the tables
        if (
            User::where('email', $value)->exists() ||
            Admin::where('email', $value)->exists() ||
            Manager::where('email', $value)->exists()
        ) {
            // if it does, return an error
            $fail('The :attribute has already been taken.');
        }
    }
}
