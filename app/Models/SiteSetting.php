<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string|null $instagram_url
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['instagram_url'])]
class SiteSetting extends Model
{
    /**
     * The single row holding the settings for this site, created on first use.
     */
    public static function current(): self
    {
        return static::query()->firstOrCreate([]);
    }
}
