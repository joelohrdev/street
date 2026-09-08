<?php

namespace App\Models;

use Database\Factories\PhotoFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Storage;

/**
 * @property int $id
 * @property string $path
 * @property string $original_name
 * @property int|null $width
 * @property int|null $height
 * @property int $lightbox_opens
 * @property int $sort_order
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['path', 'original_name', 'width', 'height', 'sort_order'])]
class Photo extends Model
{
    /** @use HasFactory<PhotoFactory> */
    use HasFactory;

    /**
     * The disk the uploaded photo files live on.
     */
    public const DISK = 'public';

    /**
     * Apply the running order the gallery is curated in.
     *
     * @param  Builder<Photo>  $query
     */
    #[Scope]
    protected function ordered(Builder $query): void
    {
        $query->orderBy('sort_order')->orderByDesc('id');
    }

    /**
     * The publicly accessible URL for the full size image.
     */
    public function url(): string
    {
        return Storage::disk(self::DISK)->url($this->path);
    }

    /**
     * Record a single lightbox open without reading the current count first.
     */
    public function recordLightboxOpen(): void
    {
        $this->increment('lightbox_opens');
    }
}
