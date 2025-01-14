<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AccountResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public static $wrap = 'account';
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->resource->id,
            'user'=> new UserResource($this->resource->user),
            'account_number' => $this->resource->account_number,
            'currency' => $this->resource->currency,
            'balance' =>$this->resource->balance,
            'is_active'=>$this->resource->is_active,
        ];
    }
}
