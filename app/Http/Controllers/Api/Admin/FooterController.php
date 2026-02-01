<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Footer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\URL;

class FooterController extends Controller
{
    /**
     * Get footer data (singleton - returns first record or creates one)
     */
    public function index()
    {
        // Get the first footer record, or create a default one if none exists
        $footer = Footer::first();
        
        if (!$footer) {
            $footer = Footer::create([]);
        }

        return response()->json([
            'success' => true,
            'data' => $this->formatFooter($footer),
        ]);
    }

    /**
     * Update footer data
     */
    public function update(Request $request)
    {
        // Get the first footer record, or create one if none exists
        $footer = Footer::first();
        
        if (!$footer) {
            $footer = Footer::create([]);
        }

        $validated = $request->validate([
            'about_en' => 'nullable|string',
            'about_ar' => 'nullable|string',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp|max:5120',
            'social_links' => 'nullable|string', // JSON string from frontend
            'phone' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'address' => 'nullable|string',
            'working_hours' => 'nullable|string', // JSON string from frontend
            'footer_links' => 'nullable|string', // JSON string from frontend
            'map_embed' => 'nullable|string',
            'remove_logo' => 'nullable|boolean',
        ]);

        // Handle logo update/removal
        if ($request->boolean('remove_logo') && $footer->logo) {
            Storage::disk('public')->delete($footer->logo);
            $footer->logo = null;
        } elseif ($request->hasFile('logo')) {
            // Delete old logo if exists
            if ($footer->logo) {
                Storage::disk('public')->delete($footer->logo);
            }
            $footer->logo = $request->file('logo')->store('footer', 'public');
        }

        // Update other fields
        if (isset($validated['about_en'])) {
            $footer->about_en = $validated['about_en'];
        }
        if (isset($validated['about_ar'])) {
            $footer->about_ar = $validated['about_ar'];
        }
        if (isset($validated['phone'])) {
            $footer->phone = $validated['phone'];
        }
        if (isset($validated['email'])) {
            $footer->email = $validated['email'];
        }
        if (isset($validated['address'])) {
            $footer->address = $validated['address'];
        }
        if (isset($validated['map_embed'])) {
            $footer->map_embed = $validated['map_embed'];
        }

        // Parse and update JSON fields
        if ($request->has('social_links')) {
            if ($request->social_links) {
                $socialLinks = json_decode($request->social_links, true);
                $footer->social_links = $socialLinks;
            } else {
                $footer->social_links = null;
            }
        }

        if ($request->has('working_hours')) {
            if ($request->working_hours) {
                $workingHours = json_decode($request->working_hours, true);
                $footer->working_hours = $workingHours;
            } else {
                $footer->working_hours = null;
            }
        }

        if ($request->has('footer_links')) {
            if ($request->footer_links) {
                $footerLinks = json_decode($request->footer_links, true);
                $footer->footer_links = $footerLinks;
            } else {
                $footer->footer_links = null;
            }
        }

        $footer->save();

        return response()->json([
            'success' => true,
            'message' => 'Footer data updated successfully',
            'data' => $this->formatFooter($footer),
        ]);
    }

    /**
     * Format footer data for API response
     */
    private function formatFooter(Footer $footer)
    {
        return [
            'id' => $footer->id,
            'logo' => $footer->logo ? URL::asset('storage/' . $footer->logo) : null,
            'logo_url' => $footer->logo ? URL::asset('storage/' . $footer->logo) : null,
            'aboutEn' => $footer->about_en,
            'about_en' => $footer->about_en,
            'about' => $footer->about_en,
            'aboutAr' => $footer->about_ar,
            'about_ar' => $footer->about_ar,
            'socialLinks' => $footer->social_links ?? [],
            'social_links' => $footer->social_links ?? [],
            'phone' => $footer->phone,
            'email' => $footer->email,
            'address' => $footer->address,
            'workingHours' => $footer->working_hours ?? [],
            'working_hours' => $footer->working_hours ?? [],
            'footerLinks' => $footer->footer_links ?? [],
            'footer_links' => $footer->footer_links ?? [],
            'mapEmbed' => $footer->map_embed,
            'map_embed' => $footer->map_embed,
            'created_at' => $footer->created_at,
            'updated_at' => $footer->updated_at,
        ];
    }
}
