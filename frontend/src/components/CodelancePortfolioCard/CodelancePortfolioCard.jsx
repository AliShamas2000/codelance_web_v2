import React from 'react'
import useScrollReveal from '../../hooks/useScrollReveal'

const CodelancePortfolioCard = ({
  id,
  title,
  imageUrl,
  imageAlt = "",
  tags = [],
  category = null,
  onClick = null,
  className = ""
}) => {
  const [isVisible, ref] = useScrollReveal({ threshold: 0.1 })

  const handleClick = () => {
    if (onClick) {
      onClick({ id, title, imageUrl, tags, category })
    }
  }

  return (
    <article
      ref={ref}
      className={`relative overflow-hidden bg-white dark:bg-gray-900 rounded-xl transition-all duration-500 ease-out group cursor-pointer hover:-translate-y-2 hover:shadow-[0_25px_50px_-12px_rgba(0,43,73,0.15)] dark:hover:shadow-[0_25px_50px_-12px_rgba(0,176,240,0.15)] ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-8'
      } ${className}`}
      onClick={handleClick}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center p-8 transition-all duration-700">
        {imageUrl ? (
          <img
            alt={imageAlt || title}
            className={`w-full h-full object-cover rounded-lg shadow-2xl transition-transform duration-700 ${
              category === 'mobile' ? 'w-[60%] rounded-[2.5rem]' : ''
            } group-hover:scale-[1.03]`}
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
        
        {/* Overlay on Hover */}
        <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-500 backdrop-blur-[2px]">
          <div className="w-14 h-14 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center text-primary shadow-xl">
            <span className="material-symbols-outlined text-3xl font-bold">arrow_forward</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {title && (
          <h3 className="text-xl font-bold text-navy-deep dark:text-white mb-3">
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
    </article>
  )
}

export default CodelancePortfolioCard

