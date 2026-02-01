import React from 'react'
import ServicesGrid from '../ServicesGrid/ServicesGrid'

const ServicesSection = ({
  // Header props
  title = "Refined Grooming",
  description = "Experience the art of traditional barbering with modern precision. Choose from our curated selection of premium services.",
  
  // Data props
  services = [],
  
  // Behavior props
  onServiceClick,
  
  // Display props
  buttonText = "Book Now",
  columns = 4,
  
  // Loading state
  isLoading = false,
  
  // Styling
  className = ""
}) => {
  return (
    <section className={`mt-10 w-full ${className}`}>
      {/* Header Section */}
      <div className="flex flex-col items-center justify-center pb-12 md:pb-16">
        <div className="flex flex-col max-w-[960px] w-full text-center">
          {title && (
            <h2 className="text-[#111816] dark:text-white text-3xl md:text-4xl font-bold leading-tight tracking-[-0.015em] pb-3">
              {title}
            </h2>
          )}
          {description && (
            <p className="text-[#61897c] dark:text-[#a0c4b6] text-base md:text-lg font-normal leading-normal max-w-2xl mx-auto">
              {description}
            </p>
          )}
        </div>
      </div>

      {/* Service Grid Section */}
      <div className="flex flex-1 justify-center pb-20">
        <div className="flex flex-col w-full flex-1">
          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <p>Loading services...</p>
            </div>
          )}

          {/* Services Grid */}
          {!isLoading && (
            <ServicesGrid
              services={services}
              onServiceClick={onServiceClick}
              buttonText={buttonText}
              columns={columns}
            />
          )}
        </div>
      </div>
    </section>
  )
}

export default ServicesSection

