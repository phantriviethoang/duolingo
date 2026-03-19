<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Result;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ResultManageController extends Controller
{
    public function index(Request $request): Response
    {
        $search = trim((string) $request->query('search', ''));
        $level = trim((string) $request->query('level', ''));

        $results = Result::query()
            ->with([
                'user:id,name,email',
                'test:id,title,level,part,duration',
            ])
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->whereHas('user', function ($uq) use ($search) {
                        $uq->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    })->orWhereHas('test', function ($tq) use ($search) {
                        $tq->where('title', 'like', "%{$search}%");
                    });
                });
            })
            ->when(in_array($level, ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'], true), function ($query) use ($level) {
                $query->whereHas('test', fn ($q) => $q->where('level', $level));
            })
            ->orderByDesc('completed_at')
            ->paginate(15)
            ->withQueryString()
            ->through(function (Result $result) {
                return [
                    'id' => $result->id,
                    'user_name' => $result->user?->name ?? 'N/A',
                    'user_email' => $result->user?->email ?? '',
                    'test_title' => $result->test?->title ?? 'N/A',
                    'level' => $result->test?->level,
                    'part' => $result->test?->part,
                    'score' => (int) $result->score,
                    'correct' => (int) $result->correct,
                    'total' => (int) $result->total,
                    'duration' => $result->test?->duration,
                    'completed_at' => optional($result->completed_at)->format('d/m/Y H:i') ?? '',
                ];
            });

        return Inertia::render('Admin/Results', [
            'results' => $results,
            'filters' => [
                'search' => $search,
                'level' => $level,
            ],
        ]);
    }
}
