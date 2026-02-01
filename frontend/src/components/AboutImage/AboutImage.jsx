import React from 'react'
import FloatingBadge from '../FloatingBadge/FloatingBadge'

const AboutImage = ({
  imageUrl,
  imageAlt = "Barber cutting hair in a vintage modern barbershop setting",
  badgeProps = {},
  className = ""
}) => {
  return (
    <div className={`order-1 lg:order-2 relative group ${className}`}>
      {/* Decorative pattern */}
      <div className="absolute -right-4 -bottom-4 w-2/3 h-2/3 bg-gray-100 dark:bg-gray-800 rounded-2xl -z-10"></div>
      <div className="absolute -left-4 -top-4 w-1/3 h-1/3 bg-primary/20 rounded-2xl -z-10"></div>
      
      {/* Image Container */}
      <div className="relative overflow-hidden rounded-2xl shadow-2xl bg-gray-200 aspect-[4/5] lg:aspect-square">
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10"></div>
        <img
          alt={imageAlt}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          src={imageUrl}
          loading="lazy"
        />
        
        {/* Floating Badge */}
        <FloatingBadge {...badgeProps} />
      </div>
    </div>
  )
}

export default AboutImage

