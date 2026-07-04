import React from 'react'

const Shimmer = ({ className = '', rounded = 'rounded-lg' }) => (
  <div
    className={`${rounded} bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 bg-[length:200%_100%] animate-shimmer ${className}`}
    aria-hidden="true"
  />
)

export default Shimmer
