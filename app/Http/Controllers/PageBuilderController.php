<?php

namespace App\Http\Controllers;

use App\Models\Page;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

class PageBuilderController extends Controller
{
    public function publish(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'schema'           => ['required', 'array'],
            'schema.version'   => ['required', 'integer', 'in:1'],
            'schema.sections'  => ['required', 'array'],
        ]);

        // Reject any payload containing script-bearing content (Req 15.4)
        $encoded = json_encode($validated['schema']);
        if ($encoded !== false && stripos($encoded, '<script') !== false) {
            throw ValidationException::withMessages([
                'schema' => ['The schema must not contain script-bearing content.'],
            ]);
        }

        $page = Page::create([
            'schema'       => $validated['schema'],
            'published_at' => now(),
        ]);

        return response()->json([
            'message' => 'Page published successfully.',
            'page_id' => $page->id,
        ], 201);
    }
}
