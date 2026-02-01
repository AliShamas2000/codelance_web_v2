import React from 'react'
import GalleryItem from '../GalleryItem/GalleryItem'

const GalleryGrid = ({
  items = [],
  images = [], // For backward compatibility
  onItemClick,
  onEdit,
  onDelete,
  onView,
  columns = 4,
  className = ""
}) => {
  // Use items if provided, otherwise fall back to images for backward compatibility
  const galleryItems = items.length > 0 ? items : images

  if (galleryItems.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-600 mb-4">
          collections
        </span>
        <p className="text-gray-500 dark:text-gray-400">No gallery items found</p>
      </div>
    )
  }

  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  }

  return (
    <div className={`grid ${gridCols[columns] || gridCols[4]} gap-6 ${className}`}>
      {galleryItems.map((item, index) => (
        <GalleryItem
          key={item.id}
          id={item.id}
          imageUrl={item.imageUrl || item.image || item.image_url || item.url}
          imageAlt={item.imageAlt || item.title || item.name || 'Gallery image'}
          category={item.category}
          title={item.title || item.name}
          onClick={() => onItemClick && onItemClick(item)}
          onEdit={onEdit ? () => onEdit(item) : undefined}
          onDelete={onDelete ? () => onDelete(item) : undefined}
          onView={onView ? () => onView(item, index) : undefined}
        />
      ))}
    </div>
  )
}

export default GalleryGrid
