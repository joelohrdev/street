<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\SiteUpdateRequest;
use App\Models\SiteSetting;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class SiteController extends Controller
{
    /**
     * Show the public site settings.
     */
    public function edit(): Response
    {
        return Inertia::render('settings/site');
    }

    /**
     * Update the public site settings.
     */
    public function update(SiteUpdateRequest $request): RedirectResponse
    {
        SiteSetting::current()->update($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Site settings updated.')]);

        return to_route('site.edit');
    }
}
