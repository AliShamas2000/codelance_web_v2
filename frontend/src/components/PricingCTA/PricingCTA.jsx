import React from 'react'

const PricingCTA = ({
  title = "Ready to look your best?",
  description = "Our schedule fills up fast. Book your appointment today to secure your preferred time with our master barbers.",
  buttonText = "Book Appointment",
  onButtonClick,
  className = ""
}) => {
  return (
    <div className={`bg-white dark:bg-card-dark py-20 ${className}`}>
      <div className="max-w-[960px] mx-auto text-center flex flex-col gap-8 items-center">
        {title && (
          <h2 className="text-3xl md:text-4xl font-black tracking-tight max-w-[720px]">
            {title}
          </h2>
        )}
        {description && (
          <p className="text-gray-500 dark:text-gray-400 max-w-lg text-lg">
            {description}
          </p>
        )}
        {buttonText && (
          <button
            onClick={onButtonClick}
            className="flex min-w-[200px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-14 px-8 bg-primary text-gray-900 text-base font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
          >
            {buttonText}
          </button>
        )}
      </div>
    </div>
  )
}

export default PricingCTA

