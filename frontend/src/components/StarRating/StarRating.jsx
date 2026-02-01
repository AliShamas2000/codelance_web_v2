import React from 'react'

const StarRating = ({
  value = 0,
  onChange,
  error,
  className = ""
}) => {
  const handleStarClick = (rating) => {
    if (onChange) {
      onChange(rating)
    }
  }

  return (
    <div className={`star-rating-wrapper group ${className}`}>
      {[5, 4, 3, 2, 1].map((starValue) => (
        <React.Fragment key={starValue}>
          <input
            type="radio"
            id={`star${starValue}`}
            name="rating"
            value={starValue}
            checked={value === starValue}
            onChange={() => handleStarClick(starValue)}
            className="hidden"
          />
          <label
            htmlFor={`star${starValue}`}
            className="px-1 transition-transform hover:scale-110 cursor-pointer"
            title={`${starValue} ${starValue === 1 ? 'star' : 'stars'}`}
          >
            <span
              className={`material-symbols-outlined text-[40px] md:text-[48px] transition-colors ${
                value >= starValue
                  ? 'text-yellow-400'
                  : 'text-gray-300 dark:text-gray-600'
              }`}
              style={{
                fontVariationSettings: value >= starValue ? "'FILL' 1" : "'FILL' 0"
              }}
            >
              star
            </span>
          </label>
        </React.Fragment>
      ))}
    </div>
  )
}

export default StarRating


