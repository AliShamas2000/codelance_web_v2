<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactSubmission;
use App\Models\NewsletterSubscription;
use App\Models\Project;
use App\Models\Review;
use App\Models\Service;
use App\Models\Package;
use App\Models\ProcessStep;
use App\Models\AboutUsContent;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /**
     * Get dashboard statistics and overview data.
     */
    public function index(Request $request)
    {
        try {
            // Get date range filters (optional)
            $fromDate = $request->get('from_date');
            $toDate = $request->get('to_date');

            // Contact Submissions Statistics (respect date filters)
            $contactSubmissionsBase = ContactSubmission::query();
            if ($fromDate) {
                $contactSubmissionsBase->whereDate('created_at', '>=', $fromDate);
            }
            if ($toDate) {
                $contactSubmissionsBase->whereDate('created_at', '<=', $toDate);
            }
            $contactSubmissionsTotal = (clone $contactSubmissionsBase)->count();
            $contactSubmissionsNew = (clone $contactSubmissionsBase)->where('status', 'new')->count();
            $contactSubmissionsRead = (clone $contactSubmissionsBase)->where('status', 'read')->count();
            $contactSubmissionsReplied = (clone $contactSubmissionsBase)->where('status', 'replied')->count();
            $contactSubmissionsRecent = (clone $contactSubmissionsBase)->orderBy('created_at', 'desc')->limit(5)->get();

            // Newsletter Subscriptions Statistics (respect date filters)
            $newsletterBase = NewsletterSubscription::query();
            if ($fromDate) {
                $newsletterBase->whereDate('subscribed_at', '>=', $fromDate);
            }
            if ($toDate) {
                $newsletterBase->whereDate('subscribed_at', '<=', $toDate);
            }
            $newsletterTotal = (clone $newsletterBase)->count();
            $newsletterActive = (clone $newsletterBase)->where('status', 'active')->count();
            $newsletterUnsubscribed = (clone $newsletterBase)->where('status', 'unsubscribed')->count();
            $newsletterRecent = (clone $newsletterBase)->orderBy('subscribed_at', 'desc')->limit(5)->get();

            // Projects Statistics (respect date filters)
            $projectsBase = Project::query();
            if ($fromDate) {
                $projectsBase->whereDate('created_at', '>=', $fromDate);
            }
            if ($toDate) {
                $projectsBase->whereDate('created_at', '<=', $toDate);
            }
            $projectsTotal = (clone $projectsBase)->count();
            $projectsActive = (clone $projectsBase)->where('is_active', true)->count();
            $projectsFeatured = (clone $projectsBase)->where('is_featured', true)->count();
            $projectsRecent = (clone $projectsBase)->orderBy('created_at', 'desc')->limit(5)->get();

            // Reviews Statistics (respect date filters)
            $reviewsBase = Review::query();
            if ($fromDate) {
                $reviewsBase->whereDate('created_at', '>=', $fromDate);
            }
            if ($toDate) {
                $reviewsBase->whereDate('created_at', '<=', $toDate);
            }
            $reviewsTotal = (clone $reviewsBase)->count();
            $reviewsActive = (clone $reviewsBase)->where('is_active', true)->count();
            $reviewsFeatured = (clone $reviewsBase)->where('is_featured', true)->count();
            $reviewsRecent = (clone $reviewsBase)->orderBy('created_at', 'desc')->limit(5)->get();

            // Services Statistics
            $servicesTotal = Service::count();
            $servicesActive = Service::where('is_active', true)->count();

            // Packages Statistics
            $packagesTotal = Package::count();
            $packagesActive = Package::where('is_active', true)->count();
            $packagesFeatured = Package::where('is_featured', true)->count();

            // Process Steps Statistics
            $processStepsTotal = ProcessStep::count();
            $processStepsActive = ProcessStep::where('is_active', true)->count();

            // About Us Content Statistics
            $aboutUsContentTotal = AboutUsContent::count();
            $aboutUsContentActive = AboutUsContent::where('is_active', true)->count();

            // Team Members Statistics
            // Users table uses 'status' column with values 'active'/'inactive', not 'is_active'
            $teamMembersTotal = User::where(function($q) {
                $q->where('role', 'barber')->orWhere('role', 'team');
            })->count();
            $teamMembersActive = User::where(function($q) {
                $q->where('role', 'barber')->orWhere('role', 'team');
            })->where('status', 'active')->count();

            // Recent Activity (last 10 items across different sections)
            $recentActivity = collect()
                ->merge(
                    ContactSubmission::orderBy('created_at', 'desc')->limit(3)->get()->map(function($item) {
                        return [
                            'type' => 'contact_submission',
                            'title' => 'New Contact Submission',
                            'description' => "From: {$item->name} ({$item->email})",
                            'timestamp' => $item->created_at,
                            'url' => '/admin/contact-submissions'
                        ];
                    })
                )
                ->merge(
                    NewsletterSubscription::orderBy('subscribed_at', 'desc')->limit(3)->get()->map(function($item) {
                        return [
                            'type' => 'newsletter_subscription',
                            'title' => 'New Newsletter Subscription',
                            'description' => "Email: {$item->email}",
                            'timestamp' => $item->subscribed_at,
                            'url' => '/admin/newsletter-subscriptions'
                        ];
                    })
                )
                ->merge(
                    Project::orderBy('created_at', 'desc')->limit(2)->get()->map(function($item) {
                        return [
                            'type' => 'project',
                            'title' => 'New Project Added',
                            'description' => "Project: {$item->title}",
                            'timestamp' => $item->created_at,
                            'url' => '/admin/projects'
                        ];
                    })
                )
                ->merge(
                    Review::orderBy('created_at', 'desc')->limit(2)->get()->map(function($item) {
                        return [
                            'type' => 'review',
                            'title' => 'New Review Added',
                            'description' => "By: {$item->author_name}",
                            'timestamp' => $item->created_at,
                            'url' => '/admin/reviews'
                        ];
                    })
                )
                ->sortByDesc('timestamp')
                ->take(10)
                ->values();

            // Format data for response
            return response()->json([
                'success' => true,
                'data' => [
                    'statistics' => [
                        'contact_submissions' => [
                            'total' => $contactSubmissionsTotal,
                            'new' => $contactSubmissionsNew,
                            'read' => $contactSubmissionsRead,
                            'replied' => $contactSubmissionsReplied,
                            'recent' => $contactSubmissionsRecent->map(function($item) {
                                return [
                                    'id' => $item->id,
                                    'name' => $item->name,
                                    'email' => $item->email,
                                    'status' => $item->status,
                                    'created_at' => $item->created_at,
                                ];
                            }),
                        ],
                        'newsletter_subscriptions' => [
                            'total' => $newsletterTotal,
                            'active' => $newsletterActive,
                            'unsubscribed' => $newsletterUnsubscribed,
                            'recent' => $newsletterRecent->map(function($item) {
                                return [
                                    'id' => $item->id,
                                    'email' => $item->email,
                                    'status' => $item->status,
                                    'subscribed_at' => $item->subscribed_at,
                                ];
                            }),
                        ],
                        'projects' => [
                            'total' => $projectsTotal,
                            'active' => $projectsActive,
                            'featured' => $projectsFeatured,
                        ],
                        'reviews' => [
                            'total' => $reviewsTotal,
                            'active' => $reviewsActive,
                            'featured' => $reviewsFeatured,
                        ],
                        'services' => [
                            'total' => $servicesTotal,
                            'active' => $servicesActive,
                        ],
                        'packages' => [
                            'total' => $packagesTotal,
                            'active' => $packagesActive,
                            'featured' => $packagesFeatured,
                        ],
                        'process_steps' => [
                            'total' => $processStepsTotal,
                            'active' => $processStepsActive,
                        ],
                        'about_us_content' => [
                            'total' => $aboutUsContentTotal,
                            'active' => $aboutUsContentActive,
                        ],
                        'team_members' => [
                            'total' => $teamMembersTotal,
                            'active' => $teamMembersActive,
                        ],
                    ],
                    'recent_activity' => $recentActivity->map(function($item) {
                        return [
                            'type' => $item['type'],
                            'title' => $item['title'],
                            'description' => $item['description'],
                            'timestamp' => $item['timestamp'],
                            'url' => $item['url'],
                        ];
                    }),
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch dashboard data',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
