<?php

namespace App\Http\Controllers;

use App\Models\Photo;
use Illuminate\Http\JsonResponse;

class LightboxOpenController extends Controller
{
    /**
     * Record that a visitor opened the photo in the lightbox.
     */
    public function store(Photo $photo): JsonResponse
    {
        $photo->recordLightboxOpen();

        return response()->json([
            'lightbox_opens' => $photo->lightbox_opens,
        ]);
    }
}
