<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Package;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\URL;

class PackageController extends Controller
{
    /**
     * Get active packages for public display.
     */
    public function index(Request $request)
    {
        $query = Package::where('is_active', true)
            ->orderBy('order', 'asc')
            ->orderBy('created_at', 'desc');

        // Optional: filter by billing period
        if ($request->has('billing_period') && $request->billing_period !== 'all') {
            $query->where('billing_period', $request->billing_period);
        }

        // Optional: filter by category
        if ($request->has('category') && $request->category !== 'all') {
            $query->where('category', $request->category);
        }

        // Optional: filter by featured
        if ($request->has('is_featured') && $request->boolean('is_featured')) {
            $query->where('is_featured', true);
        }

        // Optional: limit
        $limit = $request->get('limit');
        if ($limit) {
            $packages = $query->limit($limit)->get();
        } else {
            $packages = $query->get();
        }

        // Format packages for public API response
        $formattedPackages = $packages->map(function ($package) {
            return $this->formatPackage($package);
        });

        return response()->json([
            'success' => true,
            'data' => $formattedPackages,
        ]);
    }

    /**
     * Display the specified package.
     */
    public function show(string $id)
    {
        $package = Package::where('is_active', true)->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $this->formatPackage($package),
        ]);
    }

    /**
     * Format package data for public API response.
     */
    private function formatPackage(Package $package)
    {
        // Format price with currency
        $currency = $package->currency ?: 'USD';
        $price = number_format((float) $package->price, 2);
        
        // Format price period
        $billingPeriod = $package->billing_period ?: 'monthly';
        $pricePeriod = $this->formatBillingPeriod($billingPeriod);

        // Format features - convert array to format expected by frontend
        $features = [];
        if (is_array($package->features)) {
            foreach ($package->features as $feature) {
                if (is_string($feature)) {
                    $features[] = [
                        'text' => $feature,
                        'isBold' => false
                    ];
                } elseif (is_array($feature)) {
                    $features[] = [
                        'text' => $feature['text'] ?? $feature['name'] ?? '',
                        'isBold' => $feature['isBold'] ?? $feature['bold'] ?? false
                    ];
                }
            }
        }

        // Get icon URL
        $iconUrl = null;
        if ($package->icon) {
            $iconUrl = URL::asset('storage/' . $package->icon);
        }

        return [
            'id' => $package->id,
            'name' => $package->name,
            'description' => $package->description,
            'price' => $currency . ' ' . $price,
            'priceRaw' => (float) $package->price,
            'originalPrice' => $package->original_price ? (float) $package->original_price : null,
            'original_price' => $package->original_price ? (float) $package->original_price : null,
            'currency' => $currency,
            'category' => $package->category,
            'packageCategory' => $package->category,
            'billingPeriod' => $billingPeriod,
            'billing_period' => $billingPeriod,
            'pricePeriod' => $pricePeriod,
            'period' => $pricePeriod,
            'features' => $features,
            'badge' => $package->badge,
            'isFeatured' => (bool) $package->is_featured,
            'is_featured' => (bool) $package->is_featured,
            'isHighlighted' => (bool) $package->is_featured,
            'isPopular' => (bool) $package->is_featured,
            'icon' => $iconUrl,
            'icon_url' => $iconUrl,
            'order' => $package->order,
        ];
    }

    /**
     * Format billing period for display.
     */
    private function formatBillingPeriod(string $period): string
    {
        return match($period) {
            'monthly' => '/month',
            'yearly' => '/year',
            'one-time' => '/project',
            default => '/month'
        };
    }
}
