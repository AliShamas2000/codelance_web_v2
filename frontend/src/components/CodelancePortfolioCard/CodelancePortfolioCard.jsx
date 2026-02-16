import React, { useState } from 'react'
import useScrollReveal from '../../hooks/useScrollReveal'

const CodelancePortfolioCard = ({
  id,
  title,
  imageUrl,
  imageAlt = "",
  tags = [],
  category = null,
  projectUrl = null,
  onClick = null,
  className = ""
}) => {
  const [isVisible, ref] = useScrollReveal({ threshold: 0.1 })
  const [isHovered, setIsHovered] = useState(false)

  const handleClick = () => {
    if (onClick) {
      onClick({ id, title, imageUrl, tags, category })
    }
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
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Fullscreen-style image preview on hover (desktop only) */}
      {imageUrl && (
        <div className={`pointer-events-none fixed inset-0 z-[70] hidden lg:flex items-center justify-center transition-all duration-500 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className={`absolute inset-0 bg-slate-950/45 backdrop-blur-md transition-opacity duration-500 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`} />
          <div className={`relative z-10 w-[min(92vw,1280px)] h-[min(86vh,820px)] rounded-3xl overflow-hidden shadow-[0_50px_120px_rgba(2,8,23,0.6)] border border-white/15 transition-all duration-500 ${
            isHovered ? 'scale-100 translate-y-0' : 'scale-95 translate-y-6'
          }`}>
            <img
              src={imageUrl}
              alt={imageAlt || title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/75 to-transparent">
              <p className="text-white/90 text-sm tracking-[0.15em] uppercase">Preview</p>
              <h4 className="text-white text-2xl font-bold mt-1">{title}</h4>
            </div>
          </div>
        </div>
      )}

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
    </article>
  )
}

export default CodelancePortfolioCard
