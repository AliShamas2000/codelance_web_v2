import React from 'react'
import SectionHeader from '../SectionHeader/SectionHeader'
import BarbersGrid from '../BarbersGrid/BarbersGrid'

const BarbersSection = ({
  // Header props
  badge = "Our Experts",
  title = "Master Barbers",
  description = "Experience the art of grooming with our top-tier professionals. Dedicated to precision, style, and your personal confidence.",
  
  // Data props
  barbers = [],
  
  // Behavior props
  onBarberClick,
  
  // Loading state
  isLoading = false,
  
  // Styling
  className = ""
}) => {
  return (
    <section className={`mt-10 mb-20 ${className}`}>
      {/* Section Header */}
      <SectionHeader
        badge={badge}
        title={title}
        description={description}
        showDecoration={true}
      />

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <p>Loading barbers...</p>
        </div>
      )}

      {/* Barbers Grid */}
      {!isLoading && (
        <BarbersGrid
          barbers={barbers}
          onBarberClick={onBarberClick}
          columns={3}
        />
      )}

    </section>
  )
}

export default BarbersSection

