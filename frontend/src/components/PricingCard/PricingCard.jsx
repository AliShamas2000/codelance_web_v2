import React from 'react'

const PricingCard = ({
  id,
  title,
  subtitle,
  price,
  duration,
  features = [],
  isFeatured = false,
  featuredBadge = "Most Popular",
  onBookClick,
  buttonText = "Book Now",
  className = ""
}) => {
  return (
    <div
      className={`group relative flex flex-col gap-6 rounded-xl border ${
        isFeatured
          ? 'border-primary bg-white dark:bg-card-dark shadow-md'
          : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-card-dark shadow-sm hover:border-primary/50'
      } p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${className}`}
    >
      {/* Featured Badge */}
      {isFeatured && featuredBadge && (
        <div className="absolute top-0 right-0 -mt-3 mr-4 bg-primary text-gray-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          {featuredBadge}
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-1">
          <h3
            className={`text-xl font-bold leading-tight transition-colors ${
              isFeatured
                ? 'text-primary'
                : 'group-hover:text-primary'
            }`}
          >
            {title}
          </h3>
          {subtitle && (
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
              {subtitle}
            </p>
          )}
        </div>
        {duration && (
          <span className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs font-bold px-2 py-1 rounded">
            {duration}
          </span>
        )}
      </div>

      {/* Price */}
      {price && (
        <div className="flex items-baseline gap-1 mt-2">
          <span className="text-4xl font-black tracking-tight">
            {price}
          </span>
        </div>
      )}

      {/* Divider */}
      <div className="w-full h-px bg-gray-100 dark:bg-gray-800"></div>

      {/* Features List */}
      {features.length > 0 && (
        <div className="flex flex-col gap-3 flex-1">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300"
            >
              <span className="material-symbols-outlined text-primary text-[20px]">
                check_circle
              </span>
              <span>{feature}</span>
            </div>
          ))}
        </div>
      )}

      {/* Book Button */}
      {buttonText && (
        <button
          onClick={() => onBookClick && onBookClick({ id, title, price })}
          className={`w-full mt-4 flex items-center justify-center rounded-lg h-12 text-sm font-bold transition-colors ${
            isFeatured
              ? 'bg-primary text-gray-900 shadow-md hover:brightness-105'
              : 'bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-primary hover:text-gray-900 group-hover:bg-primary group-hover:text-gray-900'
          }`}
        >
          {buttonText}
        </button>
      )}
    </div>
  )
}

export default PricingCard

