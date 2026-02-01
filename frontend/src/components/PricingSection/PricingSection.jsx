import React, { useState, useEffect } from 'react'
import PricingFilters from '../PricingFilters/PricingFilters'
import PricingGrid from '../PricingGrid/PricingGrid'
import PricingCTA from '../PricingCTA/PricingCTA'

const PricingSection = ({
  // Header props
  title = "Precision Cuts & Styling",
  description = "Experience master barbering in a modern atmosphere. Choose from our curated list of premium services designed to help you look your absolute best.",
  
  // Data props
  pricingPlans = [],
  filters = [],
  
  // Behavior props
  onPlanClick,
  onFilterChange,
  onCTAClick,
  
  // Display props
  buttonText = "Book Now",
  ctaTitle = "Ready to look your best?",
  ctaDescription = "Our schedule fills up fast. Book your appointment today to secure your preferred time with our master barbers.",
  ctaButtonText = "Book Appointment",
  showCTA = true,
  columns = 3,
  
  // Loading state
  isLoading = false,
  
  // Styling
  className = ""
}) => {
  const [activeFilter, setActiveFilter] = useState("all")
  const [filteredPlans, setFilteredPlans] = useState(pricingPlans)

  // Filter plans when activeFilter or pricingPlans change
  useEffect(() => {
    if (activeFilter === "all") {
      setFilteredPlans(pricingPlans)
    } else {
      setFilteredPlans(
        pricingPlans.filter((plan) => 
          plan.category?.toLowerCase() === activeFilter.toLowerCase() ||
          plan.filterId === activeFilter
        )
      )
    }
  }, [activeFilter, pricingPlans])

  const handleFilterChange = (filterId) => {
    setActiveFilter(filterId)
    if (onFilterChange) {
      onFilterChange(filterId)
    }
  }

  const handlePlanClick = (plan) => {
    if (onPlanClick) {
      onPlanClick(plan)
    }
  }

  return (
    <section className={`w-full ${className}`}>
      {/* Hero / Header Section */}
      <div className="flex flex-col items-center pt-16 pb-8 text-center">
        <div className="max-w-[960px] w-full">
          {title && (
            <h1 className="text-4xl md:text-5xl font-black leading-tight tracking-tight mb-4">
              {title}
            </h1>
          )}
          {description && (
            <p className="text-gray-500 dark:text-gray-400 text-lg max-w-2xl mx-auto">
              {description}
            </p>
          )}
        </div>
      </div>

      {/* Filters */}
      <PricingFilters
        filters={filters}
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
      />

      {/* Pricing Grid */}
      <div className="flex justify-center pb-20">
        <div className="w-full">
          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <p>Loading pricing plans...</p>
            </div>
          )}

          {/* Pricing Grid */}
          {!isLoading && (
            <PricingGrid
              pricingPlans={filteredPlans}
              onPlanClick={handlePlanClick}
              buttonText={buttonText}
              columns={columns}
            />
          )}
        </div>
      </div>

      {/* CTA Section */}
      {showCTA && !isLoading && (
        <PricingCTA
          title={ctaTitle}
          description={ctaDescription}
          buttonText={ctaButtonText}
          onButtonClick={onCTAClick}
        />
      )}
    </section>
  )
}

export default PricingSection

