<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Test;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TestManageController extends Controller
{
    public function index(): Response
    {
        $tests = Test::query()
            ->orderByDesc('created_at')
            ->get(['id', 'title', 'description', 'duration', 'total_questions', 'created_at'])
            ->map(function (Test $test) {
                return [
                    'id' => $test->id,
                    'title' => $test->title,
                    'description' => $test->description,
                    'duration' => $test->configuredDuration(),
                    'total_questions' => $test->total_questions,
                    'created_at' => optional($test->created_at)->format('d/m/Y'),
                ];
            })
            ->values()
            ->toArray();

        return Inertia::render('Admin/Tests', [
            'tests' => $tests,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'duration' => ['required', 'integer', 'min:1'],
        ]);

        Test::create([
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'duration' => $validated['duration'],
            'total_questions' => 0,
            'attempts' => 0,
            'is_active' => true,
        ]);

        return redirect()->back()->with('success', 'Đã tạo đề thi mới.');
    }

    public function destroy(Test $test): RedirectResponse
    {
        $test->delete();

        return redirect()->back()->with('success', 'Đã xóa đề thi.');
    }
}
