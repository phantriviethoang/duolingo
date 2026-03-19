<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UserManageController extends Controller
{
    public function index(Request $request): Response
    {
        $search = trim((string) $request->query('search', ''));
        $role = trim((string) $request->query('role', ''));

        $users = User::query()
            ->select([
                'id',
                'name',
                'email',
                'role',
                'current_level',
                'target_level',
                'email_verified_at',
                'created_at',
            ])
            ->withCount('results')
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->when(in_array($role, ['admin', 'student', 'teacher'], true), function ($query) use ($role) {
                $query->where('role', $role);
            })
            ->orderByDesc('created_at')
            ->paginate(12)
            ->withQueryString()
            ->through(function (User $user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'status' => $user->email_verified_at ? 'Đang hoạt động' : 'Chưa xác minh',
                    'current_level' => $user->current_level,
                    'target_level' => $user->target_level,
                    'results_count' => (int) $user->results_count,
                    'joined' => optional($user->created_at)->format('d/m/Y') ?? '',
                ];
            });

        return Inertia::render('Admin/Users', [
            'users' => $users,
            'filters' => [
                'search' => $search,
                'role' => $role,
            ],
        ]);
    }
}
