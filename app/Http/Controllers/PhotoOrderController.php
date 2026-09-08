<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdatePhotoOrderRequest;
use App\Models\Photo;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;

class PhotoOrderController extends Controller
{
    /**
     * Reorder the gallery, taking the submitted ids as the new running order.
     */
    public function update(UpdatePhotoOrderRequest $request): RedirectResponse
    {
        /** @var array<int, int> $ids */
        $ids = $request->validated('ids');

        DB::transaction(function () use ($ids): void {
            foreach ($ids as $position => $id) {
                Photo::query()->whereKey($id)->update(['sort_order' => $position]);
            }
        });

        return back();
    }
}
