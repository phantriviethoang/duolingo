<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

/**
 * ⭐ PHẦN MỚI: LevelSelectionController
 *
 * 📋 Xử lý việc chọn trình độ của người dùng
 *
 * Routes:
 * - GET  /select-level              → create() → SelectTargetLevel.jsx
 * - POST /select-target-level        → store()  → Lưu target_level → Redirect /roadmap
 *
 * Flow:
 * 1. User truy cập /select-level
 * 3. User chọn 1 → POST /select-target-level {target_level: ...}
 * 4. Validate + lưu vào users.target_level
 * 5. Redirect /roadmap → LevelController@index
 */
class LevelSelectionController extends Controller
{
    /**
     * Hiển thị trang chọn trình độ
     */
    public function create()
    {
        return Inertia::render('SelectTargetLevel');
    }

    /**
     * Lưu trình độ được chọn vào database
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'target_level' => 'required|in:A1,A2,B1,B2,C1,C2',
        ]);

        // Cập nhật target_level của user
        $user = auth()->user();
        $user->update([
            'target_level' => $validated['target_level'],
        ]);

        // Redirect về Roadmap
        return redirect()->route('roadmap.index')
            ->with('success', [
                'message' => "✅ Bạn đã chọn trình độ: {$validated['target_level']}",
            ]);
    }
}
