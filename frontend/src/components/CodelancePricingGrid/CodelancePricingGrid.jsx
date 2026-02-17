import React, { useEffect, useMemo, useState } from 'react'
import CodelancePricingCard from '../CodelancePricingCard/CodelancePricingCard'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, A11y } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

const CodelancePricingGrid = ({
  packages = [],
  onPackageSelect = null,
  className = ""
}) => {
  const categoryLabels = {
    all: 'All',
    website: 'Websites',
    mobile: 'Mobile',
    pos: 'POS',
    dashboard: 'Dashboards',
    other: 'Other',
  }

  const detectCategory = (pkg) => {
    const rawCategory = (pkg.category || pkg.packageCategory || pkg.type || '').toString().toLowerCase().trim()
    if (rawCategory) {
      if (rawCategory.includes('mobile')) return 'mobile'
      if (rawCategory.includes('pos')) return 'pos'
      if (rawCategory.includes('dash')) return 'dashboard'
      if (rawCategory.includes('web') || rawCategory.includes('site') || rawCategory.includes('ecom') || rawCategory.includes('store')) return 'website'
      return 'other'
    }

    const content = `${pkg.name || ''} ${pkg.description || ''}`.toLowerCase()
    if (/(mobile|android|ios|\bapp\b)/.test(content)) return 'mobile'
    if (/(^|\s)pos(\s|$)|point of sale/.test(content)) return 'pos'
    if (/(dashboard|admin panel|erp|crm)/.test(content)) return 'dashboard'
    if (/(website|web site|web|ecommerce|e-commerce|store|shop)/.test(content)) return 'website'
    return 'other'
  }

  // Default packages if none provided
  const defaultPackages = [
    {
      id: 1,
      name: "Starter",
      price: "$999",
      pricePeriod: "/project",
      description: "Perfect for single landings and MVP launches.",
      features: [
        { text: "5 Core Features", isBold: false },
        { text: "Email Support", isBold: false },
        { text: "Basic GSAP Animations", isBold: false },
        { text: "48h Response Time", isBold: false },
        { text: "Standard Security", isBold: false }
      ],
      category: "website",
      buttonText: "Get Started"
    },
    {
      id: 2,
      name: "Business",
      price: "$2,499",
      pricePeriod: "/month",
      description: "Scalable solutions for growing tech brands.",
      badge: "Most Popular",
      isHighlighted: true,
      features: [
        { text: "All Starter Features", isBold: true },
        { text: "Priority Slack Support", isBold: false },
        { text: "Advanced GSAP Interactivity", isBold: false },
        { text: "24h Response Time", isBold: false },
        { text: "Premium Security Audits", isBold: false },
        { text: "Custom API Integration", isBold: false }
      ],
      category: "mobile",
      buttonText: "Choose Business"
    },
    {
      id: 3,
      name: "Enterprise",
      price: "Custom",
      pricePeriod: "quote",
      description: "Bespoke infrastructure for high-traffic apps.",
      features: [
        { text: "Unlimited Features", isBold: false },
        { text: "Dedicated Project Manager", isBold: false },
        { text: "24/7 Priority Support", isBold: false },
        { text: "Custom Infrastructure", isBold: false },
        { text: "SLA Guarantee", isBold: false }
      ],
      category: "pos",
      buttonText: "Contact Sales"
    }
  ]

  const displayPackages = packages.length > 0 ? packages : defaultPackages
  const normalizedPackages = useMemo(
    () => displayPackages.map((pkg) => ({ ...pkg, normalizedCategory: detectCategory(pkg) })),
    [displayPackages]
  )
  const availableTabs = useMemo(() => {
    const orderedCategories = ['website', 'mobile', 'pos', 'dashboard', 'other']
    const existing = new Set(normalizedPackages.map((pkg) => pkg.normalizedCategory))
    const tabs = [{ id: 'all', label: categoryLabels.all }]
    orderedCategories.forEach((categoryId) => {
      if (existing.has(categoryId)) {
        tabs.push({ id: categoryId, label: categoryLabels[categoryId] })
      }
    })
    return tabs
  }, [normalizedPackages])
  const [activeTab, setActiveTab] = useState('all')
  useEffect(() => {
    if (!availableTabs.some((tab) => tab.id === activeTab)) {
      setActiveTab('all')
    }
  }, [activeTab, availableTabs])
  const filteredPackages = useMemo(() => {
    if (activeTab === 'all') return normalizedPackages
    return normalizedPackages.filter((pkg) => pkg.normalizedCategory === activeTab)
  }, [normalizedPackages, activeTab])

  if (displayPackages.length === 0) {
    return (
      <div className="text-center py-12 text-gray-600 dark:text-gray-400">
        <p>No packages available at the moment.</p>
      </div>
    )
  }

  return (
    <div className={className}>
      <div className="mb-8 flex flex-wrap items-center justify-center gap-2">
        {availableTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors ${
              activeTab === tab.id
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {filteredPackages.length === 0 ? (
        <div className="text-center py-12 text-gray-600 dark:text-gray-400">
          <p>No packages found in this category.</p>
        </div>
      ) : (
        <Swiper
          modules={[Navigation, Pagination, A11y]}
          slidesPerView={1}
          spaceBetween={24}
          navigation
          pagination={{ clickable: true }}
          breakpoints={{
            1024: {
              slidesPerView: 3
            }
          }}
          className="pricing-swiper"
        >
          {filteredPackages.map((pkg, index) => (
            <SwiperSlide key={pkg.id || index} className="h-auto pb-12">
              <CodelancePricingCard
                id={pkg.id}
                name={pkg.name || pkg.title}
                price={pkg.price}
                originalPrice={pkg.originalPrice}
                originalPriceFormatted={pkg.originalPriceFormatted}
                pricePeriod={pkg.pricePeriod || pkg.period}
                description={pkg.description}
                features={pkg.features || []}
                badge={pkg.badge}
                isHighlighted={pkg.isHighlighted || pkg.isPopular || false}
                buttonText={pkg.buttonText || "Get Started"}
                buttonAction={onPackageSelect}
                className="h-full"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  )
}

export default CodelancePricingGrid
