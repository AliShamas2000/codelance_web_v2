import React from 'react'

const ReviewCard = ({
  review,
  // Individual props (for backward compatibility)
  id,
  rating,
  quote,
  customerName,
  customerInitials,
  customerType,
  serviceType,
  avatarUrl,
  date,
  text,
  service,
  clientName,
  clientAvatar,
  initials,
  isVerified,
  onDelete,
  className = ""
}) => {
  // Merge individual props into review object if review is not provided
  const reviewData = review || {
    id,
    rating,
    quote,
    text: text || quote,
    customerName: customerName || clientName,
    customerInitials: customerInitials || initials,
    customerType,
    serviceType,
    service,
    avatarUrl: avatarUrl || clientAvatar,
    clientAvatar: avatarUrl || clientAvatar,
    clientName: customerName || clientName,
    date,
    isVerified
  }
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    } catch (error) {
      return dateString
    }
  }


  const renderStars = (rating) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(
          <span key={i} className="material-symbols-outlined text-[20px] fill-current text-yellow-400">
            star
          </span>
        )
      } else {
        stars.push(
          <span key={i} className="material-symbols-outlined text-[20px] text-gray-300 dark:text-gray-600">
            star
          </span>
        )
      }
    }
    return stars
  }

  const getInitials = (name) => {
    if (!name) return '??'
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const getAvatarColor = (name) => {
    if (!name) return 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
    const colors = [
      'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300',
      'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300',
      'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-300',
      'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-300',
      'bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-300'
    ]
    const index = name.charCodeAt(0) % colors.length
    return colors[index]
  }

  return (
    <div className={`bg-surface-light dark:bg-surface-dark p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 transition-all hover:shadow-md ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
        <div className="flex items-center gap-4">
          {reviewData.clientAvatar || reviewData.avatarUrl ? (
            <img
              alt="Client"
              className="w-12 h-12 rounded-full object-cover border border-gray-100"
              src={reviewData.clientAvatar || reviewData.avatarUrl}
            />
          ) : (
            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${getAvatarColor(reviewData.clientName || reviewData.customerName)}`}>
              {reviewData.initials || reviewData.customerInitials || getInitials(reviewData.clientName || reviewData.customerName)}
            </div>
          )}
          <div>
            <h4 className="font-bold text-lg text-[#111816] dark:text-white">
              {reviewData.clientName || reviewData.customerName || 'Unknown Client'}
            </h4>
            <div className="flex items-center gap-2">
              <div className="flex text-yellow-400">
                {renderStars(reviewData.rating || 5)}
              </div>
              {reviewData.isVerified && (
                <span className="text-xs text-gray-400 font-medium">Verified Client</span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500 whitespace-nowrap bg-gray-50 dark:bg-white/5 px-3 py-1 rounded-lg">
            {formatDate(reviewData.date)}
          </span>
          {onDelete && (
            <button
              onClick={() => onDelete(reviewData)}
              className="p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
              title="Delete review"
            >
              <span className="material-symbols-outlined text-xl">delete</span>
            </button>
          )}
        </div>
      </div>

      {/* Review Text */}
      <div className="mb-6">
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
          "{reviewData.text || reviewData.review || reviewData.quote || 'No review text available.'}"
        </p>
      </div>

      {/* Footer */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Service:</span>
          <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
            {reviewData.service || reviewData.serviceType || 'N/A'}
          </span>
        </div>
      </div>
    </div>
  )
}

export default ReviewCard