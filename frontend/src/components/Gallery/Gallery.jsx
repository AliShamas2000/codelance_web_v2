import React, { useState, useEffect } from 'react'
import GalleryFilterChips from '../GalleryFilterChips/GalleryFilterChips'
import GalleryGrid from '../GalleryGrid/GalleryGrid'
import Lightbox from '../Lightbox/Lightbox'

const Gallery = ({
  // Data props (from API)
  items = [],
  filters = [],
  
  // Display props
  title = "Masterpieces",
  description = "A curation of our finest cuts, styling, and grooming excellence. Explore the standard of Studio 11.",
  
  // Behavior props
  onItemClick,
  onFilterChange,
  onLoadMore,
  
  // Loading state
  isLoading = false,
  hasMore = false,
  
  // Styling
  className = ""
}) => {
  const [activeFilter, setActiveFilter] = useState("all")
  const [filteredItems, setFilteredItems] = useState(items)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  // Filter items when activeFilter or items change
  useEffect(() => {
    if (activeFilter === "all") {
      setFilteredItems(items)
    } else {
      setFilteredItems(
        items.filter((item) => 
          item.service_id === parseInt(activeFilter) ||
          String(item.service_id) === activeFilter ||
          item.filterId === activeFilter ||
          item.category?.toLowerCase() === activeFilter.toLowerCase()
        )
      )
    }
  }, [activeFilter, items])

  const handleFilterChange = (filterId) => {
    setActiveFilter(filterId)
    if (onFilterChange) {
      onFilterChange(filterId)
    }
  }

  const handleItemClick = (item) => {
    // Find the index of the clicked item
    const itemIndex = filteredItems.findIndex(i => i.id === item.id)
    if (itemIndex !== -1) {
      setLightboxIndex(itemIndex)
      setLightboxOpen(true)
    }
    
    // Also call the custom onClick handler if provided
    if (onItemClick) {
      onItemClick(item)
    }
  }

  const handleLightboxClose = () => {
    setLightboxOpen(false)
  }

  const handleLightboxNavigate = (index) => {
    if (index >= 0 && index < filteredItems.length) {
      setLightboxIndex(index)
    }
  }

  return (
    <div className={className}>
      {/* Page Heading & Intro */}
      <div className="mt-10 mb-10 animate-fade-in-down">
        <div className="flex flex-col gap-3">
          <h1 className="text-text-main dark:text-text-main-dark text-4xl md:text-5xl font-black tracking-tighter uppercase">
            {title}
          </h1>
          {description && (
            <p className="text-text-secondary dark:text-text-secondary-dark text-lg md:text-xl font-normal max-w-2xl">
              {description}
            </p>
          )}
        </div>
      </div>

      {/* Filter Chips */}
      <GalleryFilterChips
        filters={filters}
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
      />

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-12 text-text-secondary dark:text-text-secondary-dark">
          <p>Loading gallery items...</p>
        </div>
      )}

      {/* Image Grid */}
      {!isLoading && (
        <GalleryGrid
          items={filteredItems}
          onItemClick={handleItemClick}
          columns={4}
        />
      )}

      {/* Load More Button */}
      {hasMore && !isLoading && (
        <div className="flex justify-center mt-8 pb-10">
          <button
            onClick={onLoadMore}
            className="group flex items-center justify-center gap-2 rounded-lg px-8 h-12 border border-[#e5e7eb] dark:border-[#2a3833] bg-background-light dark:bg-background-dark text-text-main dark:text-text-main-dark font-bold text-sm tracking-wide hover:bg-neutral-200 dark:hover:bg-[#1c2e28] transition-colors"
          >
            <span className="uppercase">Load More Styles</span>
            <span className="material-symbols-outlined text-lg group-hover:translate-y-0.5 transition-transform">
              expand_more
            </span>
          </button>
        </div>
      )}

      {/* Lightbox Modal */}
      <Lightbox
        isOpen={lightboxOpen}
        onClose={handleLightboxClose}
        items={filteredItems}
        currentIndex={lightboxIndex}
        onNavigate={handleLightboxNavigate}
      />
    </div>
  )
}

export default Gallery

