import React from 'react'

const ServiceCard = ({
  id,
  title,
  description,
  price,
  discountPercentage,
  duration,
  imageUrl,
  imageAlt,
  onBookClick,
  buttonText = "Book Now",
  className = ""
}) => {
  // Calculate discounted price if discount exists
  const calculateDiscountedPrice = () => {
    if (!discountPercentage || !price) return null
    const priceValue = parseFloat(price.replace('$', '').replace(',', ''))
    if (isNaN(priceValue)) return null
    const discount = (priceValue * discountPercentage) / 100
    const discountedPrice = priceValue - discount
    return '$' + discountedPrice.toFixed(2)
  }

  const discountedPrice = calculateDiscountedPrice()
  return (
    <div
      className={`group relative overflow-hidden rounded-xl bg-white dark:bg-[#1a2e26] shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${className}`}
    >
      {/* Background Image with Gradient Overlay */}
      <div
        className="bg-cover bg-center flex flex-col items-stretch justify-end pt-[200px] h-full"
        style={{
          backgroundImage: imageUrl
            ? `linear-gradient(0deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.2) 50%, rgba(0, 0, 0, 0) 100%), url(${imageUrl})`
            : 'linear-gradient(0deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.2) 50%, rgba(0, 0, 0, 0) 100%)'
        }}
        aria-label={imageAlt || title}
      >
        {/* Content */}
        <div className="flex w-full flex-col justify-end gap-3 p-5">
          {/* Price and Title */}
          <div className="flex justify-between items-start w-full">
            <div className="flex flex-col gap-1">
              {price && (
                <div className="flex items-center gap-2 flex-wrap">
                  {discountedPrice ? (
                    <>
                      <p className="text-gray-400 text-xs font-medium line-through">
                        {price}
                      </p>
                      <p className="text-primary text-sm font-bold leading-normal uppercase tracking-wider">
                        {discountedPrice}
                      </p>
                      {discountPercentage && (
                        <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded">
                          -{discountPercentage}%
                        </span>
                      )}
                    </>
                  ) : (
                    <p className="text-primary text-sm font-bold leading-normal uppercase tracking-wider">
                      {price}
                    </p>
                  )}
                </div>
              )}
              <h3 className="text-white text-2xl font-bold leading-tight">
                {title}
              </h3>
            </div>
          </div>

          {/* Description */}
          {description && (
            <p className="text-gray-200 text-sm font-medium leading-relaxed opacity-90">
              {description}
            </p>
          )}

          {/* Duration */}
          {duration && (
            <div className="flex items-center gap-1.5 text-gray-300 text-xs font-medium">
              <span className="material-symbols-outlined text-sm">schedule</span>
              <span>{duration} min</span>
            </div>
          )}

          {/* Book Button */}
          {buttonText && (
            <button
              onClick={() => onBookClick && onBookClick({ id, title, price })}
              className="mt-2 flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary hover:bg-[#0eb37d] text-[#111816] text-sm font-bold leading-normal tracking-[0.015em] transition-colors"
            >
              <span className="truncate">{buttonText}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default ServiceCard
