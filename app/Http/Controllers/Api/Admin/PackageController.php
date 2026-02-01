<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Package;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\URL;

class PackageController extends Controller
{
    /**
     * Display a listing of packages.
     */
    public function index(Request $request)
    {
        $query = Package::query();

        // Search
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('badge', 'like', "%{$search}%");
            });
        }

        // Filter by billing period
        if ($request->has('billing_period') && $request->billing_period !== 'all') {
            $query->where('billing_period', $request->billing_period);
        }

        // Filter by active status
        if ($request->has('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        // Filter by featured
        if ($request->has('is_featured')) {
            $query->where('is_featured', $request->boolean('is_featured'));
        }

        // Sort
        $sortBy = $request->get('sort', 'order');
        $sortOrder = $request->get('order', 'asc');
        $query->orderBy($sortBy, $sortOrder);

        // Pagination
        $perPage = $request->get('per_page', 10);
        $packages = $query->paginate($perPage);

        // Format packages for API response
        $formattedPackages = $packages->map(function ($package) {
            return $this->formatPackage($package);
        });

        return response()->json([
            'success' => true,
            'data' => $formattedPackages,
            'total' => $packages->total(),
            'per_page' => $packages->perPage(),
            'current_page' => $packages->currentPage(),
            'total_pages' => $packages->lastPage(),
        ]);
    }

    /**
     * Store a newly created package.
     */
    public function store(Request $request)
    {
        // Handle features - can be JSON string or array
        $features = [];
        if ($request->has('features')) {
            if (is_string($request->features)) {
                $decoded = json_decode($request->features, true);
                $features = is_array($decoded) ? $decoded : [];
            } elseif (is_array($request->features)) {
                $features = $request->features;
            }
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'original_price' => 'nullable|numeric|min:0',
            'currency' => 'nullable|string|max:3',
            'billing_period' => 'nullable|string|in:monthly,yearly,one-time',
            'badge' => 'nullable|string|max:255',
            'is_featured' => 'nullable|boolean',
            'is_active' => 'nullable|boolean',
            'order' => 'nullable|integer|min:0',
            'icon' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        $iconPath = null;

        // Handle icon upload
        if ($request->hasFile('icon')) {
            $iconPath = $request->file('icon')->store('packages/icons', 'public');
        }

        $package = Package::create([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'price' => $validated['price'],
            'original_price' => $validated['original_price'] ?? null,
            'currency' => $validated['currency'] ?? 'USD',
            'billing_period' => $validated['billing_period'] ?? 'monthly',
            'features' => $features,
            'badge' => $validated['badge'] ?? null,
            'is_featured' => $validated['is_featured'] ?? false,
            'is_active' => $validated['is_active'] ?? true,
            'order' => $validated['order'] ?? 0,
            'icon' => $iconPath,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Package created successfully',
            'data' => $this->formatPackage($package),
        ], 201);
    }

    /**
     * Display the specified package.
     */
    public function show(string $id)
    {
        $package = Package::findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $this->formatPackage($package),
        ]);
    }

    /**
     * Update the specified package.
     */
    public function update(Request $request, string $id)
    {
        $package = Package::findOrFail($id);

        // Handle features - can be JSON string or array
        $features = null;
        if ($request->has('features')) {
            if (is_string($request->features)) {
                $decoded = json_decode($request->features, true);
                $features = is_array($decoded) ? $decoded : [];
            } elseif (is_array($request->features)) {
                $features = $request->features;
            }
        }

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'sometimes|required|numeric|min:0',
            'original_price' => 'nullable|numeric|min:0',
            'currency' => 'nullable|string|max:3',
            'billing_period' => 'nullable|string|in:monthly,yearly,one-time',
            'badge' => 'nullable|string|max:255',
            'is_featured' => 'nullable|boolean',
            'is_active' => 'nullable|boolean',
            'order' => 'nullable|integer|min:0',
            'icon' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'remove_icon' => 'nullable|boolean',
        ]);

        // Handle icon update/removal
        if ($request->boolean('remove_icon') && $package->icon) {
            Storage::disk('public')->delete($package->icon);
            $package->icon = null;
        } elseif ($request->hasFile('icon')) {
            // Delete old icon if exists
            if ($package->icon) {
                Storage::disk('public')->delete($package->icon);
            }
            $package->icon = $request->file('icon')->store('packages/icons', 'public');
        }

        // Update other fields
        if (isset($validated['name'])) {
            $package->name = $validated['name'];
        }
        if (isset($validated['description'])) {
            $package->description = $validated['description'];
        }
        if (isset($validated['price'])) {
            $package->price = $validated['price'];
        }
        if (isset($validated['original_price'])) {
            $package->original_price = $validated['original_price'] ?: null;
        } elseif ($request->has('original_price') && $request->original_price === '') {
            $package->original_price = null;
        }
        if (isset($validated['currency'])) {
            $package->currency = $validated['currency'];
        }
        if (isset($validated['billing_period'])) {
            $package->billing_period = $validated['billing_period'];
        }
        if ($features !== null) {
            $package->features = $features;
        }
        if (isset($validated['badge'])) {
            $package->badge = $validated['badge'] ?: null;
        } elseif ($request->has('badge') && $request->badge === '') {
            $package->badge = null;
        }
        if (isset($validated['is_featured'])) {
            $package->is_featured = $validated['is_featured'];
        }
        if (isset($validated['is_active'])) {
            $package->is_active = $validated['is_active'];
        }
        if (isset($validated['order'])) {
            $package->order = $validated['order'];
        }

        $package->save();

        return response()->json([
            'success' => true,
            'message' => 'Package updated successfully',
            'data' => $this->formatPackage($package),
        ]);
    }

    /**
     * Update package order (for drag and drop reordering).
     */
    public function updateOrder(Request $request)
    {
        $validated = $request->validate([
            'packages' => 'required|array',
            'packages.*.id' => 'required|exists:packages,id',
            'packages.*.order' => 'required|integer|min:0',
        ]);

        foreach ($validated['packages'] as $packageData) {
            Package::where('id', $packageData['id'])
                ->update(['order' => $packageData['order']]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Package order updated successfully',
        ]);
    }

    /**
     * Remove the specified package.
     */
    public function destroy(string $id)
    {
        $package = Package::findOrFail($id);

        // Delete icon if exists
        if ($package->icon) {
            Storage::disk('public')->delete($package->icon);
        }

        $package->delete();

        return response()->json([
            'success' => true,
            'message' => 'Package deleted successfully',
        ]);
    }

    /**
     * Format package data for API response.
     */
    private function formatPackage(Package $package)
    {
        return [
            'id' => $package->id,
            'name' => $package->name,
            'description' => $package->description,
            'price' => (float) $package->price,
            'originalPrice' => $package->original_price ? (float) $package->original_price : null,
            'original_price' => $package->original_price ? (float) $package->original_price : null, // Keep for backward compatibility
            'currency' => $package->currency,
            'billingPeriod' => $package->billing_period,
            'billing_period' => $package->billing_period, // Keep for backward compatibility
            'features' => $package->features ?? [],
            'badge' => $package->badge,
            'isFeatured' => $package->is_featured,
            'is_featured' => $package->is_featured, // Keep for backward compatibility
            'isActive' => $package->is_active,
            'is_active' => $package->is_active, // Keep for backward compatibility
            'order' => $package->order,
            'icon' => $package->icon ? URL::asset('storage/' . $package->icon) : null,
            'icon_url' => $package->icon ? URL::asset('storage/' . $package->icon) : null,
            'createdAt' => $package->created_at,
            'updatedAt' => $package->updated_at,
            'created_at' => $package->created_at, // Keep for backward compatibility
            'updated_at' => $package->updated_at, // Keep for backward compatibility
        ];
    }
}

