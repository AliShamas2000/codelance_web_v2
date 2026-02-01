import React from 'react'

const GalleryItem = ({
  id,
  imageUrl,
  imageAlt,
  category,
  title,
  onClick,
  onEdit,
  onDelete,
  onView,
  className = ""
}) => {
  return (
    <div
      className={`group relative aspect-[3/4] overflow-hidden rounded-lg cursor-pointer bg-neutral-200 dark:bg-neutral-800 shadow-sm hover:shadow-xl transition-all duration-300 ${className}`}
    >
      {/* Image */}
      <img
        alt={imageAlt || title}
        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        src={imageUrl}
        loading="lazy"
        onClick={onClick}
      />

      {/* Overlay on Hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
        {category && (
          <span className="text-primary text-xs font-bold uppercase tracking-wider mb-1">
            {category}
          </span>
        )}
        {title && (
          <h3 className="text-white text-lg font-bold leading-tight">
            {title}
          </h3>
        )}
        <div className="h-0.5 w-12 bg-primary mt-3 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 delay-100"></div>
      </div>

      {/* Action Buttons (top right) */}
      <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
        {/* View/Fullscreen Icon */}
        {onView && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onView()
            }}
            className="bg-white/10 backdrop-blur-md rounded-full p-2 text-white hover:bg-white/20 transition-colors"
            title="View fullscreen"
          >
            <span className="material-symbols-outlined text-lg">fullscreen</span>
          </button>
        )}
        
        {/* Edit Icon */}
        {onEdit && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onEdit()
            }}
            className="bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 text-gray-700 dark:text-white rounded-full p-2 shadow-sm backdrop-blur-sm transition-colors"
            title="Edit"
          >
            <span className="material-symbols-outlined text-sm">edit</span>
          </button>
        )}
        
        {/* Delete Icon */}
        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
            className="bg-white/90 dark:bg-gray-800/90 hover:bg-red-50 dark:hover:bg-red-900/30 text-red-500 rounded-full p-2 shadow-sm backdrop-blur-sm transition-colors"
            title="Delete"
          >
            <span className="material-symbols-outlined text-sm">delete</span>
          </button>
        )}
      </div>
    </div>
  )
}

export default GalleryItem

