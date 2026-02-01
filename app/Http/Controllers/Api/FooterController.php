<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Footer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\URL;

class FooterController extends Controller
{
    /**
     * Get footer data for public display.
     */
    public function index()
    {
        // Get the first footer record, or return empty data if none exists
        $footer = Footer::first();

        if (!$footer) {
            // Return empty structure if no footer data exists
            return response()->json([
                'success' => true,
                'data' => $this->formatFooterForPublic(null),
            ]);
        }

        return response()->json([
            'success' => true,
            'data' => $this->formatFooterForPublic($footer),
        ]);
    }

    /**
     * Format footer data for public API response.
     */
    private function formatFooterForPublic($footer)
    {
        if (!$footer) {
            return [
                'logo' => null,
                'aboutEn' => '',
                'aboutAr' => '',
                'socialLinks' => [],
                'phone' => '',
                'email' => '',
                'address' => '',
                'workingHours' => [],
                'footerLinks' => [],
                'mapEmbed' => null,
            ];
        }

        // Format social links for FooterBrand component
        $socialLinks = [];
        if ($footer->social_links && is_array($footer->social_links)) {
            foreach ($footer->social_links as $link) {
                $platform = strtolower($link['platform'] ?? $link['platform'] ?? '');
                $icon = $this->getSocialIcon($platform);
                
                $socialLinks[] = [
                    'icon' => $icon,
                    'href' => $link['url'] ?? $link['href'] ?? '#',
                    'label' => $link['platform'] ?? $link['label'] ?? '',
                ];
            }
        }

        // Format working hours for FooterHours component
        $formattedHours = [];
        if ($footer->working_hours && is_array($footer->working_hours)) {
            foreach ($footer->working_hours as $hour) {
                if (isset($hour['enabled']) && !$hour['enabled']) {
                    $formattedHours[] = [
                        'day' => $hour['label'] ?? $hour['day'] ?? '',
                        'time' => 'Closed',
                        'isClosed' => true,
                    ];
                } else {
                    $startTime = $hour['startTime'] ?? '';
                    $endTime = $hour['endTime'] ?? '';
                    $formattedHours[] = [
                        'day' => $hour['label'] ?? $hour['day'] ?? '',
                        'time' => $startTime && $endTime ? "{$startTime} - {$endTime}" : ($startTime ?: 'Closed'),
                        'isClosed' => false,
                    ];
                }
            }
        }

        // Format footer links for FooterLinks component
        $formattedFooterLinks = [];
        if ($footer->footer_links && is_array($footer->footer_links)) {
            foreach ($footer->footer_links as $column) {
                $links = [];
                if (isset($column['links']) && is_array($column['links'])) {
                    foreach ($column['links'] as $link) {
                        $links[] = [
                            'label' => $link['text'] ?? $link['label'] ?? '',
                            'href' => $link['url'] ?? $link['href'] ?? '#',
                            'icon' => 'chevron_right',
                        ];
                    }
                }
                
                $formattedFooterLinks[] = [
                    'title' => $column['title'] ?? '',
                    'links' => $links,
                ];
            }
        }

        return [
            'logo' => $footer->logo ? URL::asset('storage/' . $footer->logo) : null,
            'logo_url' => $footer->logo ? URL::asset('storage/' . $footer->logo) : null,
            'aboutEn' => $footer->about_en,
            'about_en' => $footer->about_en,
            'about' => $footer->about_en,
            'aboutAr' => $footer->about_ar,
            'about_ar' => $footer->about_ar,
            'socialLinks' => $socialLinks,
            'social_links' => $socialLinks,
            'phone' => $footer->phone,
            'email' => $footer->email,
            'address' => $footer->address,
            'workingHours' => $formattedHours,
            'working_hours' => $formattedHours,
            'footerLinks' => $formattedFooterLinks,
            'footer_links' => $formattedFooterLinks,
            'mapEmbed' => $footer->map_embed,
            'map_embed' => $footer->map_embed,
        ];
    }

    /**
     * Get Material Icons icon name for social platform.
     */
    private function getSocialIcon($platform)
    {
        $platform = strtolower($platform);
        
        $iconMap = [
            'facebook' => 'thumb_up',
            'instagram' => 'photo_camera',
            'twitter' => 'chat_bubble',
            'linkedin' => 'work',
            'youtube' => 'play_circle',
            'tiktok' => 'video_library',
            'whatsapp' => 'chat',
            'snapchat' => 'camera_alt',
            'pinterest' => 'bookmark',
        ];

        return $iconMap[$platform] ?? 'share';
    }
}

