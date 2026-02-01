import React from 'react'

const ReviewStatsCards = ({
  stats,
  className = ""
}) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 ${className}`}>
      {/* Average Rating */}
      <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 card-hover">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 rounded-xl">
            <span className="material-symbols-outlined text-3xl">star</span>
          </div>
          <div>
            <h3 className="text-3xl font-bold mb-0.5">{stats.averageRating || 0}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Average Rating</p>
          </div>
        </div>
      </div>

      {/* Total Reviews */}
      <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 card-hover">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl">
            <span className="material-symbols-outlined text-3xl">comment</span>
          </div>
          <div>
            <h3 className="text-3xl font-bold mb-0.5">{stats.totalReviews || 0}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Reviews</p>
          </div>
        </div>
      </div>

      {/* Positive Feedback */}
      <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 card-hover">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-xl">
            <span className="material-symbols-outlined text-3xl">thumb_up</span>
          </div>
          <div>
            <h3 className="text-3xl font-bold mb-0.5">{stats.positiveFeedback || 0}%</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Positive Feedback</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReviewStatsCards


