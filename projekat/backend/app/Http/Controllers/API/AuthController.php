<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use App\Models\Admin;
use App\Models\Manager;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful;
use App\Rules\UniqueAcrossTables;

class AuthController extends Controller
{
    /**
     * Create User
     * @param Request $request
     * @return User 
     */
    public function createUser(Request $request)
    {
        try {
            $validateUser = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'email' => ['required', 'email', new UniqueAcrossTables],
                'password' => 'required|min:7',
                'date_of_birth' => 'required|date',
                'gender' => 'required|in:male,female,other',
                'work_status' => 'required|in:underaged,unemployed,student,employed,retired',
                'street' => 'required|string|max:255',
                'city' => 'required|string|max:255',
                'country' => 'required|string|max:255',
                'postal_code' => 'required|string|max:20',
                'phone_number' => 'required|string|max:20',
            ]);

            if ($validateUser->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation error',
                    'errors' => $validateUser->errors(),
                ], 422);
            }

            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'date_of_birth' => $request->date_of_birth,
                'gender' => $request->gender,
                'work_status' => $request->work_status,
                'street' => $request->street,
                'city' => $request->city,
                'country' => $request->country,
                'postal_code' => $request->postal_code,
                'phone_number' => $request->phone_number,
                'role' => 'user',
            ]);

            return response()->json([
                'data' => $user,
                'success' => true,
                'message' => 'User Created Successfully',
                'token' => $user->createToken("API TOKEN")->plainTextToken,
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                'message' => $th->getMessage(),
            ], 500);
        }
    }

    // login function for EVERY ROLE in the system (user, admin and manager)

    public function login(Request $request)
    {
        try {
            $validateUser = Validator::make(
                $request->all(),
                [
                    'email' => 'required|email',
                    'password' => 'required'
                ]
            );

            if ($validateUser->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'validation error',
                    'errors' => $validateUser->errors()
                ], 401);
            }

            // checking user table first
            $user = User::where('email', $request->email)->first();
            if ($user && Auth::guard('web')->attempt($request->only(['email', 'password']))) {
                $token = $user->createToken("API TOKEN")->plainTextToken;
                return response()->json([
                    'data' => $user,
                    'success' => true,
                    'message' => 'User Logged In Successfully',
                    'role' => 'user',
                    'token' => $token
                ], 200);
            }
            // then admin table
            $admin = Admin::where('email', $request->email)->first();
            if ($admin && Auth::guard('admin')->attempt($request->only(['email', 'password']))) {
                $token = $admin->createToken("API TOKEN")->plainTextToken;
                return response()->json([
                    'data' => $admin,
                    'success' => true,
                    'message' => 'Admin Logged In Successfully',
                    'role' => 'admin',
                    'token' => $token
                ], 200);
            }

            // in the end managers table
            $manager = Manager::where('email', $request->email)->first();
            if ($manager && Auth::guard('manager')->attempt($request->only(['email', 'password']))) {
                $token = $manager->createToken("API TOKEN")->plainTextToken;
                return response()->json([
                    'data' => $manager,
                    'success' => true,
                    'message' => 'Manager Logged In Successfully',
                    'role' => 'manager',
                    'token' => $token
                ], 200);
            }

            // if there is no user, admin or manager
            return response()->json([
                'success' => false,
                'message' => 'Email & Password do not match our records.',
            ], 401);
        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                'message' => $th->getMessage()
            ], 500);
        }
    }


    /**
     * Logout the User
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function logoutUser(Request $request)
    {
        try {
            $request->user()->currentAccessToken()->delete();


            return response()->json([
                'success' => true,
                'message' => 'User logged out successfully.',
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                'message' => $th->getMessage()
            ], 500);
        }
    }

    public function forgotPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string',
            'email' => 'required|email',
            'password' => 'required|min:8',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error! Make sure new password is at least 8 characters long!',
                'errors' => $validator->errors(),
            ], 422);
        }

        $user = User::where('name', $request->name)
            ->where('email', $request->email)
            ->first();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not found or credentials do not match.',
            ], 404);
        }

        $user->password = Hash::make($request->password);
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Password updated successfully.',
        ], 200);
    }

    public function createAdmin(Request $request)
    {
        try {
            $validateAdmin = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'email' => ['required', 'email', new UniqueAcrossTables],
                'password' => 'required|min:8',
            ]);

            if ($validateAdmin->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation error',
                    'errors' => $validateAdmin->errors(),
                ], 422);
            }

            $admin = Admin::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => 'admin',
            ]);

            return response()->json([
                'data' => $admin,
                'success' => true,
                'message' => 'Admin created successfully',
                'token' => $admin->createToken("Admin API Token")->plainTextToken,
            ], 201);
        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                'message' => $th->getMessage(),
            ], 500);
        }
    }


    public function logoutAdmin(Request $request)
    {
        try {
            $request->user()->currentAccessToken()->delete();

            return response()->json([
                'success' => true,
                'message' => 'Admin logged out successfully.',
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                'message' => $th->getMessage()
            ], 500);
        }
    }


    public function createManager(Request $request)
    {
        try {
            $validateManager = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'email' => ['required', 'email', new UniqueAcrossTables],
                'password' => 'required|min:8',
            ]);

            if ($validateManager->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation error',
                    'errors' => $validateManager->errors(),
                ], 422);
            }

            $manager = Manager::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password), // hash facade automatically encrypts the password!
            ]);

            return response()->json([
                'data' => $manager,
                'success' => true,
                'message' => 'Manager created successfully',
                'token' => $manager->createToken("Manager API Token")->plainTextToken,
            ], 201);
        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                'message' => $th->getMessage(),
            ], 500);
        }
    }


    public function logoutManager(Request $request)
    {
        try {
            $request->user()->currentAccessToken()->delete();

            return response()->json([
                'success' => true,
                'message' => 'Manager logged out successfully.',
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                'message' => $th->getMessage()
            ], 500);
        }
    }
}
