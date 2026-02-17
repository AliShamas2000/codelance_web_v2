import React, { useState } from 'react'
import useScrollReveal from '../../hooks/useScrollReveal'
import Lightbox from 'yet-another-react-lightbox'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'
import 'yet-another-react-lightbox/styles.css'

const CodelancePortfolioCard = ({
  id,
  title,
  imageUrl,
  imageUrls = [],
  imageAlt = "",
  tags = [],
  category = null,
  projectUrl = null,
  onClick = null,
  className = ""
}) => {
  const [isVisible, ref] = useScrollReveal({ threshold: 0.1 })
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const galleryImages = Array.isArray(imageUrls) && imageUrls.length > 0
    ? imageUrls
    : (imageUrl ? [imageUrl] : [])

  const handleClick = () => {
    if (onClick) {
      onClick({ id, title, imageUrl, imageUrls: galleryImages, tags, category })
    }
  }

  const handleOpenPreview = (event) => {
    event.stopPropagation()
    setIsPreviewOpen(true)
  }

  const handleClosePreview = () => {
    setIsPreviewOpen(false)
  }

  return (
    <article
      ref={ref}
      className={`relative overflow-visible bg-white dark:bg-gray-900 rounded-xl transition-all duration-500 ease-out group ${
        projectUrl ? 'hover:-translate-y-2 hover:shadow-[0_25px_50px_-12px_rgba(0,43,73,0.15)] dark:hover:shadow-[0_25px_50px_-12px_rgba(0,176,240,0.15)]' : ''
      } ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-8'
      } ${className}`}
      onClick={handleClick}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center transition-all duration-700">
        {imageUrl ? (
          <img
            alt={imageAlt || title}
            className={`w-full h-full object-cover rounded-lg shadow-2xl transition-transform duration-700 ${
              category === 'mobile' ? 'w-[60%] rounded-[2.5rem]' : ''
            } group-hover:scale-110`}
            src={imageUrl}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-primary/10 rounded-lg flex items-center justify-center">
            <span className="material-symbols-outlined text-6xl text-primary/30">
              image
            </span>
          </div>
        )}

        {imageUrl && (
          <button
            type="button"
            aria-label={`Expand preview for ${title}`}
            onClick={handleOpenPreview}
            className="absolute bottom-3 right-3 w-11 h-11 rounded-full bg-white/85 dark:bg-slate-900/85 text-navy-deep dark:text-white backdrop-blur-md border border-white/40 dark:border-white/20 shadow-lg transition-all duration-300 hover:scale-110 hover:bg-white dark:hover:bg-slate-800"
          >
            <span className="material-symbols-outlined text-[22px] leading-none">
              open_in_full
            </span>
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-end justify-between gap-4">
          <div className="min-w-0">
            {title && (
              <h3 className="text-xl font-bold text-navy-deep dark:text-white mb-3 truncate">
                {title}
              </h3>
            )}
            {tags && tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 text-[10px] font-bold border border-navy-deep/20 dark:border-white/20 rounded-full text-navy-deep/70 dark:text-white/70 uppercase"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {projectUrl && (
            <a
              href={projectUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(event) => event.stopPropagation()}
              aria-label={`Open project: ${title}`}
              className="group/link shrink-0 w-11 h-11 rounded-full bg-navy-deep dark:bg-white text-white dark:text-navy-deep flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 hover:bg-primary dark:hover:bg-primary dark:hover:text-white"
            >
              <span className="material-symbols-outlined text-[22px] transition-transform duration-300 group-hover/link:translate-x-0.5">
                arrow_forward
              </span>
            </a>
          )}
        </div>
      </div>

      {/* Lightbox-style preview */}
      {galleryImages.length > 0 && (
        <Lightbox
          open={isPreviewOpen}
          close={handleClosePreview}
          slides={galleryImages.map((src) => ({
            src,
            alt: imageAlt || title || 'Portfolio preview',
          }))}
          plugins={[Zoom]}
          carousel={{ finite: galleryImages.length <= 1 }}
          controller={{ closeOnBackdropClick: true }}
          zoom={{
            maxZoomPixelRatio: 3,
            zoomInMultiplier: 2,
            wheelZoomDistanceFactor: 140,
          }}
          render={galleryImages.length <= 1 ? {
            buttonPrev: () => null,
            buttonNext: () => null,
          } : undefined}
          styles={{
            container: { backgroundColor: 'rgba(2, 8, 23, 0.90)' },
          }}
        />
      )}
    </article>
  )
}

export default CodelancePortfolioCard
