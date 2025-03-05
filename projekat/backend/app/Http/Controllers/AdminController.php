<?php

namespace App\Http\Controllers;

use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class AdminController extends Controller
{
    public function index()
    {
        return response()->json(Admin::all());
    }

    public function destroy(Request $request)
    {
        $admin = Admin::find($request->id);
        if (!$admin) {
            return response()->json(['error' => 'Admin not found'], 404);
        }

        $admin->delete();
        return response()->json('Card is deleted successfully.');
    }

    public function store(Request $request)
    {
        Log::info('Admin creation request received:', $request->all());

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:admins,email',
            'password' => 'required|string|min:8',
        ]);

        if ($validator->fails()) {
            Log::error('Validation failed:', $validator->errors()->toArray());
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $admin = Admin::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => bcrypt($request->password),
                'role' => 'admin',
            ]);

            Log::info('Admin created successfully:', $admin->toArray());

            return response()->json([
                'success' => true,
                'message' => 'Admin created successfully.',
                'data' => $admin,
            ], 201);
        } catch (\Exception $e) {
            Log::error('Error creating admin:', ['error' => $e->getMessage()]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to create admin.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
