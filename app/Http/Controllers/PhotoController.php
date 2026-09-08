<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePhotoRequest;
use App\Models\Photo;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class PhotoController extends Controller
{
    /**
     * Show every uploaded photo alongside its lightbox statistics.
     */
    public function index(): Response
    {
        $photos = Photo::query()->ordered()->get();

        return Inertia::render('photos/index', [
            'photos' => $photos->map(fn (Photo $photo): array => [
                'id' => $photo->id,
                'url' => $photo->url(),
                'original_name' => $photo->original_name,
                'lightbox_opens' => $photo->lightbox_opens,
                'uploaded_at' => $photo->created_at?->toDayDateTimeString(),
            ]),
            'stats' => [
                'photos' => $photos->count(),
                'lightbox_opens' => (int) $photos->sum('lightbox_opens'),
            ],
        ]);
    }

    /**
     * Store the uploaded photos on the public disk.
     */
    public function store(StorePhotoRequest $request): RedirectResponse
    {
        /** @var array<int, UploadedFile> $files */
        $files = $request->file('photos');

        DB::transaction(function () use ($files): void {
            // New work leads the gallery, so push everything already there down.
            Photo::query()->increment('sort_order', count($files));

            foreach ($files as $position => $file) {
                [$width, $height] = $this->dimensions($file);

                Photo::create([
                    'path' => $file->store('photos', Photo::DISK),
                    'original_name' => $file->getClientOriginalName(),
                    'width' => $width,
                    'height' => $height,
                    'sort_order' => $position,
                ]);
            }
        });

        Inertia::flash('toast', ['type' => 'success', 'message' => trans_choice(':count photo uploaded.|:count photos uploaded.', count($files), ['count' => count($files)])]);

        return to_route('photos.index');
    }

    /**
     * Delete the photo and the file backing it.
     */
    public function destroy(Photo $photo): RedirectResponse
    {
        Storage::disk(Photo::DISK)->delete($photo->path);

        $photo->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Photo deleted.')]);

        return to_route('photos.index');
    }

    /**
     * Read the pixel dimensions of the upload, which the gallery uses to size the lightbox.
     *
     * @return array{0: int|null, 1: int|null}
     */
    private function dimensions(UploadedFile $file): array
    {
        $size = @getimagesize($file->getRealPath());

        return $size === false ? [null, null] : [$size[0], $size[1]];
    }
}
