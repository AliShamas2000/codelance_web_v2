import React from 'react'
import FeatureCard from '../FeatureCard/FeatureCard'

const FeaturesGrid = ({
  features = [],
  columns = 2,
  className = ""
}) => {
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  }

  if (features.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        <p>No features found.</p>
      </div>
    )
  }

  return (
    <div className={`grid ${gridCols[columns] || gridCols[2]} gap-5 ${className}`}>
      {features.map((feature, index) => (
        <FeatureCard
          key={feature.id || index}
          id={feature.id}
          icon={feature.icon}
          title={feature.title}
          description={feature.description}
          translateY={feature.translateY || (index % 2 === 1 && columns === 2)}
        />
      ))}
    </div>
  )
}

export default FeaturesGrid

