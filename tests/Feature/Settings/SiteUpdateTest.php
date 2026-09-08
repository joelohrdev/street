<?php

use App\Models\SiteSetting;
use App\Models\User;
use Inertia\Testing\AssertableInertia;

test('guests are redirected away from the site settings page', function () {
    $response = $this->get(route('site.edit'));

    $response->assertRedirect(route('login'));
});

test('the instagram url is saved', function () {
    $this->actingAs(User::factory()->create());

    $response = $this->patch(route('site.update'), [
        'instagram_url' => 'https://instagram.com/jlstreet',
    ]);

    $response->assertRedirect(route('site.edit'));
    expect(SiteSetting::current()->instagram_url)->toBe('https://instagram.com/jlstreet');
});

test('the instagram url can be cleared', function () {
    $this->actingAs(User::factory()->create());
    SiteSetting::current()->update(['instagram_url' => 'https://instagram.com/jlstreet']);

    $this->patch(route('site.update'), ['instagram_url' => '']);

    expect(SiteSetting::current()->instagram_url)->toBeNull();
});

test('rejects a url that is not https', function () {
    $this->actingAs(User::factory()->create());

    $response = $this->from(route('site.edit'))->patch(route('site.update'), [
        'instagram_url' => 'instagram.com/jlstreet',
    ]);

    $response->assertSessionHasErrors([
        'instagram_url' => 'Enter the full https address of your Instagram profile.',
    ]);
    expect(SiteSetting::current()->instagram_url)->toBeNull();
});

test('the gallery shares the instagram url with visitors', function () {
    SiteSetting::current()->update(['instagram_url' => 'https://instagram.com/jlstreet']);

    $response = $this->get(route('home'));

    $response->assertInertia(fn (AssertableInertia $page) => $page
        ->where('site.instagram_url', 'https://instagram.com/jlstreet')
    );
});

test('the gallery shares no instagram url until one is set', function () {
    $response = $this->get(route('home'));

    $response->assertInertia(fn (AssertableInertia $page) => $page
        ->where('site.instagram_url', null)
    );
});
