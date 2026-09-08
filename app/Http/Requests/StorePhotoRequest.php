<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StorePhotoRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'photos' => ['required', 'array', 'max:20'],
            'photos.*' => ['file', 'image', 'mimes:jpg,jpeg,png,webp', 'max:12288'],
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'photos.required' => 'Choose at least one photo to upload.',
            'photos.*.image' => 'Each upload must be a JPG, PNG or WebP image.',
            'photos.*.mimes' => 'Each upload must be a JPG, PNG or WebP image.',
            'photos.*.max' => 'Each photo must be 12 MB or smaller.',
        ];
    }
}
