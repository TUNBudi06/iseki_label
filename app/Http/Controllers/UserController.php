<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        $users = User::select('id', 'name', 'username', 'role', 'created_at')
            ->orderBy('name')
            ->get();

        return Inertia::render('User/index', [
            'users' => $users,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users,username',
            'role' => 'required|in:admin,user',
            'password' => 'required|string|min:4',
        ]);

        User::create([
            'name' => $request->name,
            'username' => $request->username,
            'role' => $request->role,
            'password' => $request->password,
        ]);

        return back()->with('success', 'User berhasil ditambahkan.');
    }

    public function update(Request $request)
    {
        debugbar()->info('Update user request received', $request->all());
        $request->validate([
            'id' => 'required|exists:users,id',
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:255',
            'role' => 'required|in:admin,user',
            'password' => 'nullable|string|min:4',
        ]);

        $data = [
            'name' => $request->name,
            'username' => $request->username,
            'role' => $request->role,
        ];

        $user = User::find($request->id);

        if ($request->filled('password')) {
            $data['password'] = $request->password;
        }

        $user->update($data);

        return back()->with('success', 'User berhasil diperbarui.');
    }

    public function destroy(Request $request)
    {
        $request->validate([
            'id' => 'required|exists:users,id',
        ]);

        $user = User::find($request->id);
        $user->delete();

        return back()->with('success', 'User berhasil dihapus.');
    }
}
