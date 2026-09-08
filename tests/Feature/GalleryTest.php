<?php

use App\Models\Photo;
use Inertia\Testing\AssertableInertia;

test('the gallery is public and lists photos in their curated order', function () {
    $second = Photo::factory()->create(['sort_order' => 1]);
    $first = Photo::factory()->create(['sort_order' => 0]);

    $response = $this->get(route('home'));

    $response->assertOk();
    $response->assertInertia(fn (AssertableInertia $page) => $page
        ->component('gallery')
        ->has('photos', 2)
        ->where('photos.0.id', $first->id)
        ->where('photos.1.id', $second->id)
        ->where('photos.0.url', $first->url())
    );
});

test('the gallery does not expose lightbox statistics to visitors', function () {
    Photo::factory()->openedTimes(17)->create();

    $response = $this->get(route('home'));

    $response->assertInertia(fn (AssertableInertia $page) => $page
        ->component('gallery')
        ->missing('photos.0.lightbox_opens')
    );
});
