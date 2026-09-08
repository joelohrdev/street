<?php

use App\Models\Photo;
use App\Models\User;
use Inertia\Testing\AssertableInertia;

test('guests cannot reorder the gallery', function () {
    $photos = Photo::factory()->count(2)->create();

    $response = $this->put(route('photos.order.update'), [
        'ids' => $photos->pluck('id')->reverse()->values()->all(),
    ]);

    $response->assertRedirect(route('login'));
});

test('reordering stores the submitted running order', function () {
    $this->actingAs(User::factory()->create());

    $first = Photo::factory()->create(['sort_order' => 0]);
    $second = Photo::factory()->create(['sort_order' => 1]);
    $third = Photo::factory()->create(['sort_order' => 2]);

    $response = $this->from(route('photos.index'))->put(route('photos.order.update'), [
        'ids' => [$third->id, $first->id, $second->id],
    ]);

    $response->assertRedirect(route('photos.index'));
    expect(Photo::query()->ordered()->pluck('id')->all())
        ->toBe([$third->id, $first->id, $second->id]);
});

test('the gallery serves the reordered photos to visitors', function () {
    $this->actingAs(User::factory()->create());

    $first = Photo::factory()->create(['sort_order' => 0]);
    $last = Photo::factory()->create(['sort_order' => 1]);

    $this->put(route('photos.order.update'), ['ids' => [$last->id, $first->id]]);

    $this->get(route('home'))->assertInertia(fn (AssertableInertia $page) => $page
        ->where('photos.0.id', $last->id)
        ->where('photos.1.id', $first->id)
    );
});

test('rejects an order containing an unknown photo', function () {
    $this->actingAs(User::factory()->create());

    $photo = Photo::factory()->create(['sort_order' => 0]);

    $response = $this->from(route('photos.index'))
        ->put(route('photos.order.update'), ['ids' => [$photo->id, 999]]);

    $response->assertSessionHasErrors('ids.1');
    expect($photo->refresh()->sort_order)->toBe(0);
});

test('rejects an order that repeats a photo', function () {
    $this->actingAs(User::factory()->create());

    $photo = Photo::factory()->create(['sort_order' => 0]);

    $response = $this->from(route('photos.index'))
        ->put(route('photos.order.update'), ['ids' => [$photo->id, $photo->id]]);

    $response->assertSessionHasErrors('ids.0');
});

test('rejects an empty order', function () {
    $this->actingAs(User::factory()->create());

    $response = $this->from(route('photos.index'))
        ->put(route('photos.order.update'), ['ids' => []]);

    $response->assertSessionHasErrors('ids');
});
