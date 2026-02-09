import React from 'react'
import ReviewsGrid from '../ReviewsGrid/ReviewsGrid'

const ReviewsSection = ({
  // Header props
  badge = "Client Reviews",
  title = "What Our Clients Say",
  description = "Join hundreds of happy clients who trust Codelance to design, build, and maintain their digital products.",
  
  // Data props
  reviews = [],
  
  // Display props
  columns = 3,
  
  // Loading state
  isLoading = false,
  
  // Styling
  className = ""
}) => {
  return (
    <section className={`w-full ${className}`}>
      {/* Header */}
      <div className="flex flex-col items-center justify-center text-center mb-12">
        {badge && (
          <span className="inline-block py-1 px-3 mb-4 rounded-full bg-slate-100 dark:bg-white/5 text-primary text-xs font-bold uppercase tracking-wider">
            {badge}
          </span>
        )}
        {title && (
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            {title}
          </h2>
        )}
        {description && (
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl">
            {description}
          </p>
        )}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <p>Loading reviews...</p>
        </div>
      )}

      {/* Reviews Grid */}
      {!isLoading && (
        <ReviewsGrid
          reviews={reviews}
          columns={columns}
        />
      )}
    </section>
  )
}

export default ReviewsSection

