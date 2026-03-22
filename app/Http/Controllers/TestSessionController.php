<?php

namespace App\Http\Controllers;

use App\Models\Test;
use App\Models\TestSession;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TestSessionController extends Controller
{
    public function sync(Request $request, string $level, Test $test)
    {
        if ($test->level !== $level) {
            abort(404);
        }

        $validated = $request->validate([
            'answers' => ['nullable', 'array'],
            'flagged' => ['nullable', 'array'],
            'current_question' => ['required', 'integer', 'min:0'],
            'time_left' => ['required', 'integer', 'min:0'],
        ]);

        $session = TestSession::query()
            ->where('user_id', Auth::id())
            ->where('test_id', $test->id)
            ->where('status', 'in_progress')
            ->latest('updated_at')
            ->first();

        if (! $session) {
            $session = new TestSession([
                'user_id' => Auth::id(),
                'test_id' => $test->id,
                'status' => 'in_progress',
            ]);
        }

        $session->answers = $validated['answers'] ?? [];
        $session->flagged = $validated['flagged'] ?? [];
        $session->current_question = (int) $validated['current_question'];
        $session->time_left = (int) $validated['time_left'];
        $session->last_synced_at = now();
        $session->save();

        return response()->json([
            'ok' => true,
            'session_id' => $session->id,
            'last_synced_at' => optional($session->last_synced_at)->toISOString(),
        ]);
    }
}
