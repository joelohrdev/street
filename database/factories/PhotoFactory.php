<?php

namespace Database\Factories;

use App\Models\Photo;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Photo>
 */
class PhotoFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'path' => 'photos/'.Str::random(40).'.jpg',
            'original_name' => fake()->word().'-'.fake()->word().'.jpg',
            'width' => 1600,
            'height' => 1067,
            'lightbox_opens' => 0,
        ];
    }

    /**
     * Indicate how many times the photo has been opened in the lightbox.
     */
    public function openedTimes(int $times): static
    {
        return $this->state(fn (array $attributes) => [
            'lightbox_opens' => $times,
        ]);
    }
}
