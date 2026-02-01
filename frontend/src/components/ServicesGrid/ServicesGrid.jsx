import React from 'react'
import ServiceCard from '../ServiceCard/ServiceCard'

const ServicesGrid = ({
  services = [],
  onServiceClick,
  buttonText = "Book Now",
  columns = 4,
  className = ""
}) => {
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  }

  if (services.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        <p>No services found.</p>
      </div>
    )
  }

  return (
    <div className={`grid ${gridCols[columns] || gridCols[4]} gap-6 ${className}`}>
      {services.map((service) => (
        <ServiceCard
          key={service.id}
          id={service.id}
          title={service.title || service.nameEn || service.name_en}
          description={service.description || service.descriptionEn || service.description_en}
          price={service.price}
          discountPercentage={service.discountPercentage || service.discount_percentage}
          duration={service.duration}
          imageUrl={service.imageUrl || service.icon || service.icon_url}
          imageAlt={service.imageAlt}
          onBookClick={onServiceClick}
          buttonText={buttonText}
        />
      ))}
    </div>
  )
}

export default ServicesGrid
