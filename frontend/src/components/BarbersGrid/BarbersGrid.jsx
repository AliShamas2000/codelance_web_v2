import React from 'react'
import BarberCard from '../BarberCard/BarberCard'

const BarbersGrid = ({
  barbers = [],
  onBarberClick,
  columns = 3,
  className = ""
}) => {
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  }

  if (barbers.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        <p>No barbers found.</p>
      </div>
    )
  }

  return (
    <div className={`grid ${gridCols[columns] || gridCols[3]} gap-x-8 gap-y-12 ${className}`}>
      {barbers.map((barber) => (
        <BarberCard
          key={barber.id}
          id={barber.id}
          name={barber.name}
          role={barber.role}
          imageUrl={barber.imageUrl}
          imageAlt={barber.imageAlt}
          socialLinks={barber.socialLinks || []}
          phone={barber.phone}
          onClick={() => onBarberClick && onBarberClick(barber)}
        />
      ))}
    </div>
  )
}

export default BarbersGrid

