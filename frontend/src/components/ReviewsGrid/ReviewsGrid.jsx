import React from 'react'
import ReviewCard from '../ReviewCard/ReviewCard'

const ReviewsGrid = ({
  reviews = [],
  columns = 3,
  className = ""
}) => {
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        <p>No reviews found.</p>
      </div>
    )
  }

  return (
    <div className={`grid ${gridCols[columns] || gridCols[3]} gap-8 ${className}`}>
      {reviews.map((review) => (
        <ReviewCard
          key={review.id}
          review={review}
        />
      ))}
    </div>
  )
}

export default ReviewsGrid

