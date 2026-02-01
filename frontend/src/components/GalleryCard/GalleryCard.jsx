import React from 'react'

const GalleryCard = ({
  image,
  onEdit,
  onDelete,
  className = ""
}) => {
  const imageUrl = image.image || image.image_url || image.url || ''
  const title = image.title || image.name || 'Untitled'
  const category = image.category || 'other'
  const description = image.description || ''
  const createdAt = image.created_at || image.createdAt || image.dateAdded || ''

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Date unknown'
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      })
    } catch (error) {
      return dateString
    }
  }

  // Format category label
  const formatCategory = (cat) => {
    const categoryMap = {
      haircut: 'Haircut',
      beard: 'Beard',
      shave: 'Shave',
      interior: 'Shop Interior',
      kids: 'Kids',
      other: 'Other'
    }
    return categoryMap[cat] || cat.charAt(0).toUpperCase() + cat.slice(1)
  }

  return (
    <div className={`bg-white dark:bg-card-dark rounded-2xl shadow-soft border border-gray-100 dark:border-gray-700 overflow-hidden group flex flex-col ${className}`}>
      {/* Image Container */}
      <div className="relative aspect-[4/3] bg-gray-100 dark:bg-gray-700 overflow-hidden">
        {imageUrl ? (
          <img
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            src={imageUrl}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <span className="material-symbols-outlined text-4xl">image</span>
          </div>
        )}
        
        {/* Action Buttons (shown on hover) */}
        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onEdit && onEdit(image)
            }}
            className="p-2 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 text-gray-700 dark:text-white rounded-lg shadow-sm backdrop-blur-sm transition-colors"
            title="Edit"
          >
            <span className="material-symbols-outlined text-sm">edit</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete && onDelete(image)
            }}
            className="p-2 bg-white/90 dark:bg-gray-800/90 hover:bg-red-50 dark:hover:bg-red-900/30 text-red-500 rounded-lg shadow-sm backdrop-blur-sm transition-colors"
            title="Delete"
          >
            <span className="material-symbols-outlined text-sm">delete</span>
          </button>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1">
            {title}
          </h3>
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 ml-2 flex-shrink-0">
            {formatCategory(category)}
          </span>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
          Added on {formatDate(createdAt)}
        </p>
        {description && (
          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mt-auto">
            {description}
          </p>
        )}
      </div>
    </div>
  )
}

export default GalleryCard


