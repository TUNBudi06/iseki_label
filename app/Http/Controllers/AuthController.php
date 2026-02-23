<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AuthController extends Controller
{
    //
    public function authUser()
    {
        return Inertia::render('User/LoginPage');
    }

    public function authUserPost(Request $request)
    {
        $data = $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        $user = \App\Models\User::where('username', $data['username'])->first();
        if (! $user) {
            return back()->withErrors([
                'username' => 'User tidak ditemukan atau password salah.',
            ])->onlyInput('username');
        }

        if ($user->password === $data['password']) {
            Auth::login($user);

            return redirect()->route('home');
        } else {
            return back()->withErrors([
                'username' => 'User tidak ditemukan atau password salah.',
            ])->onlyInput('username');
        }
    }

    public function logoutUser(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('home');
    }
}
