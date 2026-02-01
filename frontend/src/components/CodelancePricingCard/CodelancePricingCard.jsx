import React from 'react'
import useScrollReveal from '../../hooks/useScrollReveal'

const CodelancePricingCard = ({
  id,
  name,
  price,
  originalPrice = null, // Original price (numeric) for calculation
  originalPriceFormatted = null, // Original price (formatted string) for display
  pricePeriod = "/project",
  description,
  features = [],
  badge = null, // e.g., "Most Popular"
  isHighlighted = false,
  buttonText = "Get Started",
  buttonAction = null,
  className = ""
}) => {
  // Calculate discount percentage if original price exists
  // Extract numeric value from price string (remove currency symbols and formatting)
  const currentPrice = parseFloat(price.toString().replace(/[^0-9.]/g, '')) || 0
  const hasDiscount = originalPrice && typeof originalPrice === 'number' && originalPrice > currentPrice
  const discountPercentage = hasDiscount && originalPrice > 0
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    : 0
  const [isVisible, ref] = useScrollReveal({ threshold: 0.1 })

  const handleButtonClick = () => {
    if (buttonAction) {
      buttonAction({ id, name, price })
    }
  }

  return (
    <div
      ref={ref}
      className={`pricing-card flex flex-col gap-8 rounded-lg p-8 shadow-sm transition-all ${
        isHighlighted
          ? 'border-2 border-primary bg-white dark:bg-gray-900 scale-105 z-10 relative'
          : 'border border-transparent bg-white dark:bg-gray-900'
      } ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-8'
      } ${className}`}
    >
      {/* Badges */}
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex flex-col gap-2 items-center">
        {hasDiscount && discountPercentage > 0 && (
          <span className="inline-flex items-center rounded-full bg-red-500 px-3 py-1 text-xs font-black uppercase tracking-wider text-white shadow-lg">
            {discountPercentage}% OFF
          </span>
        )}
        {badge && (
          <span className="badge-pulse inline-flex items-center rounded-full bg-primary px-4 py-1.5 text-xs font-black uppercase tracking-widest text-white shadow-lg">
            {badge}
          </span>
        )}
      </div>

      {/* Header */}
      <div className="flex flex-col gap-2">
        {name && (
          <h3 className="text-gray-500 dark:text-gray-400 text-sm font-bold uppercase tracking-widest">
            {name}
          </h3>
        )}
        <div className="flex flex-col gap-1">
          {hasDiscount && originalPriceFormatted && (
            <div className="flex items-baseline gap-2">
              <span className="text-gray-400 dark:text-gray-500 text-xl font-bold line-through">
                {originalPriceFormatted}
              </span>
            </div>
          )}
          <div className="flex items-baseline gap-1">
            <span className="text-primary text-5xl font-black leading-tight tracking-tighter">
              {price}
            </span>
            {pricePeriod && (
              <span className="text-gray-400 dark:text-gray-500 text-base font-bold">
                {pricePeriod}
              </span>
            )}
          </div>
        </div>
        {description && (
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
            {description}
          </p>
        )}
      </div>

      {/* Features */}
      {features.length > 0 && (
        <div className="flex flex-col gap-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`flex items-center gap-3 text-navy-deep dark:text-gray-200 text-sm ${
                feature.isBold ? 'font-bold' : 'font-medium'
              }`}
            >
              <span className="material-symbols-outlined text-primary">check_circle</span>
              <span>{feature.text || feature}</span>
            </div>
          ))}
        </div>
      )}

      {/* CTA Button */}
      <button
        onClick={handleButtonClick}
        className={`mt-auto group flex items-center justify-center gap-2 rounded-xl h-14 w-full text-base font-bold tracking-tight transition-all ${
          isHighlighted
            ? 'bg-primary text-white hover:shadow-[0_0_20px_rgba(0,176,240,0.4)]'
            : 'bg-navy-deep text-white hover:bg-navy-deep/90'
        }`}
      >
        <span>{buttonText}</span>
        <span className="material-symbols-outlined cta-btn-arrow transition-transform text-[20px]">
          arrow_forward
        </span>
      </button>
    </div>
  )
}

export default CodelancePricingCard

