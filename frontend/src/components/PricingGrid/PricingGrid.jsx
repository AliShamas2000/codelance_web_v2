import React from 'react'
import PricingCard from '../PricingCard/PricingCard'

const PricingGrid = ({
  pricingPlans = [],
  onPlanClick,
  buttonText = "Book Now",
  columns = 3,
  className = ""
}) => {
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  }

  if (pricingPlans.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        <p>No pricing plans found.</p>
      </div>
    )
  }

  return (
    <div className={`grid ${gridCols[columns] || gridCols[3]} gap-6 ${className}`}>
      {pricingPlans.map((plan) => (
        <PricingCard
          key={plan.id}
          id={plan.id}
          title={plan.title}
          subtitle={plan.subtitle}
          price={plan.price}
          duration={plan.duration}
          features={plan.features || []}
          isFeatured={plan.isFeatured || false}
          featuredBadge={plan.featuredBadge}
          onBookClick={onPlanClick}
          buttonText={buttonText}
        />
      ))}
    </div>
  )
}

export default PricingGrid

