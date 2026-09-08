<?php

namespace App\Http\Controllers;

use App\Models\Photo;
use Inertia\Inertia;
use Inertia\Response;

class GalleryController extends Controller
{
    /**
     * Show the public street photography gallery.
     */
    public function index(): Response
    {
        return Inertia::render('gallery', [
            'photos' => Photo::query()
                ->ordered()
                ->get()
                ->map(fn (Photo $photo): array => [
                    'id' => $photo->id,
                    'url' => $photo->url(),
                    'width' => $photo->width,
                    'height' => $photo->height,
                ]),
        ]);
    }
}
