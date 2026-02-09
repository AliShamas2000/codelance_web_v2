<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Service;
use Illuminate\Support\Facades\DB;

class ServiceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Clear existing services (optional - comment out if you want to keep existing data)
        // Service::truncate();

        $services = [
            [
                'name_en' => 'Website Development',
                'name_ar' => 'تطوير المواقع الإلكترونية',
                'description_en' => 'Scalable, high-performance web solutions built with modern frameworks.',
                'description_ar' => 'حلول ويب قابلة للتوسع وعالية الأداء مبنية بإطارات عمل حديثة.',
                'price' => 0.00,
                'duration' => 0,
                'category' => 'web',
                'icon' => 'language', // Material Symbol icon name
                'svg' => '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95c-.32-1.25-.78-2.45-1.38-3.56 1.84.63 3.37 1.91 4.33 3.56zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2 0 .68.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56-1.84-.63-3.37-1.9-4.33-3.56zm2.95-8H4.26c.96-1.66 2.49-2.93 4.33-3.56C8.03 5.55 7.57 6.75 7.25 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2 0-.68.07-1.35.16-2h4.68c.09.65.16 1.32.16 2 0 .68-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95c-.96 1.65-2.49 2.93-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2 0-.68-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z"/></svg>',
                'is_active' => true,
                'order' => 1,
            ],
            [
                'name_en' => 'Mobile Apps',
                'name_ar' => 'تطبيقات الجوال',
                'description_en' => 'Cross-platform excellence with Flutter and React Native specialists.',
                'description_ar' => 'تميز عبر المنصات مع متخصصي Flutter و React Native.',
                'price' => 0.00,
                'duration' => 0,
                'category' => 'mobile',
                'icon' => 'smartphone', // Material Symbol icon name
                'svg' => '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z"/></svg>',
                'is_active' => true,
                'order' => 2,
            ],
            [
                'name_en' => 'POS & ERP Systems',
                'name_ar' => 'أنظمة نقاط البيع و ERP',
                'description_en' => 'Streamlined business operations and comprehensive management tools.',
                'description_ar' => 'عمليات تجارية مبسطة وأدوات إدارة شاملة.',
                'price' => 0.00,
                'duration' => 0,
                'category' => 'pos',
                'icon' => 'point_of_sale', // Material Symbol icon name
                'svg' => '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/></svg>',
                'is_active' => true,
                'order' => 3,
            ],
            [
                'name_en' => 'Custom Software',
                'name_ar' => 'برمجيات مخصصة',
                'description_en' => 'Tailored enterprise tools precisely built for your specific needs.',
                'description_ar' => 'أدوات مؤسسية مصممة خصيصًا لاحتياجاتك المحددة.',
                'price' => 0.00,
                'duration' => 0,
                'category' => 'software',
                'icon' => 'developer_mode_tv', // Material Symbol icon name
                'svg' => '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14zM8 15h2v2H8v-2zm0-4h2v2H8v-2zm0-4h2v2H8V7zm4 8h2v2h-2v-2zm0-4h2v2h-2v-2zm0-4h2v2h-2V7zm4 8h2v2h-2v-2zm0-4h2v2h-2v-2zm0-4h2v2h-2V7z"/></svg>',
                'is_active' => true,
                'order' => 4,
            ],
            [
                'name_en' => 'AI & Automation',
                'name_ar' => 'الذكاء الاصطناعي والأتمتة',
                'description_en' => 'Smart workflows and intelligent data processing for future-proof growth.',
                'description_ar' => 'سير عمل ذكي ومعالجة بيانات ذكية للنمو المستقبلي.',
                'price' => 0.00,
                'duration' => 0,
                'category' => 'ai',
                'icon' => 'psychology', // Material Symbol icon name
                'svg' => '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>',
                'is_active' => true,
                'order' => 5,
            ],
            [
                'name_en' => 'UI/UX & Branding',
                'name_ar' => 'واجهة المستخدم والهوية التجارية',
                'description_en' => 'Human-centric design meets powerful visual identity and brand story.',
                'description_ar' => 'تصميم يركز على الإنسان يجتمع مع هوية بصرية قوية وقصة العلامة التجارية.',
                'price' => 0.00,
                'duration' => 0,
                'category' => 'design',
                'icon' => 'palette', // Material Symbol icon name
                'svg' => '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>',
                'is_active' => true,
                'order' => 6,
            ],
            [
                'name_en' => 'Cloud & API',
                'name_ar' => 'السحابة وواجهات برمجة التطبيقات',
                'description_en' => 'Seamless connectivity, robust APIs and cloud-native architecture.',
                'description_ar' => 'اتصال سلس، واجهات برمجة تطبيقات قوية وهندسة معمارية سحابية أصلية.',
                'price' => 0.00,
                'duration' => 0,
                'category' => 'cloud',
                'icon' => 'cloud_sync', // Material Symbol icon name
                'svg' => '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-4-4v3H9v2h4v3l4-4z"/></svg>',
                'is_active' => true,
                'order' => 7,
            ],
            [
                'name_en' => 'Maintenance',
                'name_ar' => 'الصيانة',
                'description_en' => '24/7 reliability, proactive monitoring, and expert technical support.',
                'description_ar' => 'موثوقية على مدار الساعة، مراقبة استباقية، ودعم فني متخصص.',
                'price' => 0.00,
                'duration' => 0,
                'category' => 'maintenance',
                'icon' => 'support_agent', // Material Symbol icon name
                'svg' => '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>',
                'is_active' => true,
                'order' => 8,
            ],
        ];

        foreach ($services as $service) {
            Service::updateOrCreate(
                ['name_en' => $service['name_en']], // Use name_en as unique identifier
                $service
            );
        }

        $this->command->info('Services seeded successfully!');
    }
}

