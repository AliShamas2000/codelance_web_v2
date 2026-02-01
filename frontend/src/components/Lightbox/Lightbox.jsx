import React, { useEffect } from 'react'

const Lightbox = ({
  isOpen,
  onClose,
  items = [],
  currentIndex = 0,
  onNavigate
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return

      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
        onNavigate(currentIndex - 1)
      } else if (e.key === 'ArrowRight' && currentIndex < items.length - 1) {
        onNavigate(currentIndex + 1)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, currentIndex, items.length, onClose, onNavigate])

  if (!isOpen || !items[currentIndex]) return null

  const currentItem = items[currentIndex]
  const hasPrevious = currentIndex > 0
  const hasNext = currentIndex < items.length - 1

  // Get image URL from various possible property names
  const imageUrl = currentItem.imageUrl || currentItem.image || currentItem.image_url || currentItem.url || ''
  const imageAlt = currentItem.imageAlt || currentItem.title || currentItem.name || 'Gallery image'

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white transition-colors"
        aria-label="Close lightbox"
      >
        <span className="material-symbols-outlined text-2xl">close</span>
      </button>

      {/* Previous Button */}
      {hasPrevious && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onNavigate(currentIndex - 1)
          }}
          className="absolute left-4 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white transition-colors"
          aria-label="Previous image"
        >
          <span className="material-symbols-outlined text-2xl">chevron_left</span>
        </button>
      )}

      {/* Next Button */}
      {hasNext && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onNavigate(currentIndex + 1)
          }}
          className="absolute right-4 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white transition-colors"
          aria-label="Next image"
        >
          <span className="material-symbols-outlined text-2xl">chevron_right</span>
        </button>
      )}

      {/* Image Container */}
      <div
        className="relative max-w-7xl w-full h-full flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full h-full flex flex-col items-center justify-center">
          {/* Image */}
          {imageUrl && (
            <img
              src={imageUrl}
              alt={imageAlt}
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
            />
          )}

          {/* Image Info */}
          <div className="mt-6 text-center text-white max-w-2xl">
            {currentItem.category && (
              <span className="text-primary text-xs font-bold uppercase tracking-wider mb-2 block">
                {currentItem.category}
              </span>
            )}
            {currentItem.title && (
              <h3 className="text-2xl md:text-3xl font-bold mb-2">
                {currentItem.title}
              </h3>
            )}
            {items.length > 1 && (
              <p className="text-sm text-white/70 mt-2">
                {currentIndex + 1} of {items.length}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Image Counter (Bottom) */}
      {items.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation()
                onNavigate(index)
              }}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'bg-primary w-8'
                  : 'bg-white/30 w-2 hover:bg-white/50'
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default Lightbox

