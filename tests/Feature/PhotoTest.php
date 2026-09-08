<?php

use App\Models\Photo;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia;

describe('index', function () {
    test('guests are redirected to the login page', function () {
        $response = $this->get(route('photos.index'));

        $response->assertRedirect(route('login'));
    });

    test('lists every photo with its lightbox opens and the totals', function () {
        $this->actingAs(User::factory()->create());

        Photo::factory()->openedTimes(9)->create(['sort_order' => 0]);
        Photo::factory()->openedTimes(3)->create([
            'original_name' => 'crossing.jpg',
            'sort_order' => 1,
        ]);

        $response = $this->get(route('photos.index'));

        $response->assertOk();
        $response->assertInertia(fn (AssertableInertia $page) => $page
            ->component('photos/index')
            ->has('photos', 2)
            ->where('stats.photos', 2)
            ->where('stats.lightbox_opens', 12)
            ->where('photos.1.original_name', 'crossing.jpg')
            ->where('photos.1.lightbox_opens', 3)
        );
    });
});

describe('store', function () {
    test('guests cannot upload photos', function () {
        Storage::fake(Photo::disk());

        $response = $this->post(route('photos.store'), [
            'photos' => [UploadedFile::fake()->image('street.jpg')],
        ]);

        $response->assertRedirect(route('login'));
        expect(Photo::count())->toBe(0);
    });

    test('stores each uploaded file and records its dimensions', function () {
        Storage::fake(Photo::disk());
        $this->actingAs(User::factory()->create());

        $response = $this->post(route('photos.store'), [
            'photos' => [
                UploadedFile::fake()->image('corner.jpg', 1200, 800),
                UploadedFile::fake()->image('market.png', 900, 900),
            ],
        ]);

        $response->assertRedirect(route('photos.index'));
        expect(Photo::count())->toBe(2);

        $corner = Photo::where('original_name', 'corner.jpg')->sole();
        expect($corner->width)->toBe(1200)
            ->and($corner->height)->toBe(800)
            ->and($corner->lightbox_opens)->toBe(0);

        Storage::disk(Photo::disk())->assertExists($corner->path);
    });

    test('puts newly uploaded photos at the head of the gallery', function () {
        Storage::fake(Photo::disk());
        $this->actingAs(User::factory()->create());

        $existing = Photo::factory()->create(['sort_order' => 0]);

        $this->post(route('photos.store'), [
            'photos' => [
                UploadedFile::fake()->image('first.jpg'),
                UploadedFile::fake()->image('second.jpg'),
            ],
        ]);

        expect(Photo::query()->ordered()->pluck('original_name')->all())
            ->toBe(['first.jpg', 'second.jpg', $existing->original_name]);
    });

    test('stores a webp upload with its dimensions', function () {
        Storage::fake(Photo::disk());
        $this->actingAs(User::factory()->create());

        $response = $this->post(route('photos.store'), [
            'photos' => [UploadedFile::fake()->image('alley.webp', 2000, 1333)],
        ]);

        $response->assertRedirect(route('photos.index'));

        $photo = Photo::sole();
        expect($photo->original_name)->toBe('alley.webp')
            ->and($photo->width)->toBe(2000)
            ->and($photo->height)->toBe(1333);

        Storage::disk(Photo::disk())->assertExists($photo->path);
    });

    test('stores uploads on the configured photo disk', function () {
        config()->set('photos.disk', 's3');
        Storage::fake('s3');
        $this->actingAs(User::factory()->create());

        $this->post(route('photos.store'), [
            'photos' => [UploadedFile::fake()->image('bucket.jpg')],
        ]);

        Storage::disk('s3')->assertExists(Photo::sole()->path);
    });

    test('rejects an upload with no files', function () {
        $this->actingAs(User::factory()->create());

        $response = $this->from(route('photos.index'))->post(route('photos.store'), []);

        $response->assertSessionHasErrors([
            'photos' => 'Choose at least one photo to upload.',
        ]);
        expect(Photo::count())->toBe(0);
    });

    test('rejects a file that is not an image', function () {
        Storage::fake(Photo::disk());
        $this->actingAs(User::factory()->create());

        $response = $this->from(route('photos.index'))->post(route('photos.store'), [
            'photos' => [UploadedFile::fake()->create('notes.pdf', 100, 'application/pdf')],
        ]);

        $response->assertSessionHasErrors([
            'photos.0' => 'Each upload must be a JPG, PNG or WebP image.',
        ]);
        expect(Photo::count())->toBe(0);
    });

    test('rejects an image larger than 12 MB', function () {
        Storage::fake(Photo::disk());
        $this->actingAs(User::factory()->create());

        $response = $this->from(route('photos.index'))->post(route('photos.store'), [
            'photos' => [UploadedFile::fake()->image('huge.jpg')->size(12289)],
        ]);

        $response->assertSessionHasErrors([
            'photos.0' => 'Each photo must be 12 MB or smaller.',
        ]);
        expect(Photo::count())->toBe(0);
    });
});

describe('destroy', function () {
    test('guests cannot delete a photo', function () {
        $photo = Photo::factory()->create();

        $response = $this->delete(route('photos.destroy', $photo));

        $response->assertRedirect(route('login'));
        expect($photo->refresh())->not->toBeNull();
    });

    test('deletes the photo and the file behind it', function () {
        Storage::fake(Photo::disk());
        $this->actingAs(User::factory()->create());

        $path = UploadedFile::fake()->image('gone.jpg')->store('photos', Photo::disk());
        $photo = Photo::factory()->create(['path' => $path]);

        $response = $this->delete(route('photos.destroy', $photo));

        $response->assertRedirect(route('photos.index'));
        $this->assertDatabaseMissing('photos', ['id' => $photo->id]);
        Storage::disk(Photo::disk())->assertMissing($path);
    });
});
