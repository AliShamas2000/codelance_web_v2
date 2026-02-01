import React from 'react'

const CodelanceReviewCard = ({
  quote,
  authorName,
  authorTitle,
  authorCompany,
  authorImage = null,
  isCenter = false,
  className = ""
}) => {
  return (
    <div
      className={`flex flex-col bg-white dark:bg-gray-900 rounded-lg shrink-0 transition-all duration-500 ${
        isCenter
          ? 'w-[400px] h-[320px] p-10 z-10 opacity-100 scale-100 shadow-[0_25px_50px_-12px_rgba(0,43,73,0.1)] dark:shadow-[0_25px_50px_-12px_rgba(0,176,240,0.1)]'
          : 'w-[340px] h-[280px] p-8 opacity-40 scale-90 blur-[1px]'
      } ${className}`}
    >
      <span className={`material-symbols-outlined text-primary mb-4 ${
        isCenter ? 'text-4xl' : 'text-3xl'
      }`}>
        format_quote
      </span>
      <p className={`text-navy-deep dark:text-white font-medium leading-relaxed mb-auto ${
        isCenter 
          ? 'text-base' 
          : 'text-sm line-clamp-4'
      }`}>
        {quote}
      </p>
      <div className={`flex items-center ${isCenter ? 'gap-4' : 'gap-3'} pt-6 border-t border-navy-deep/5 dark:border-white/5`}>
        {authorImage ? (
          <img
            alt={authorName}
            className={`rounded-full object-cover ${
              isCenter 
                ? 'w-12 h-12' 
                : 'w-10 h-10 grayscale'
            }`}
            src={authorImage}
            loading="lazy"
          />
        ) : (
          <div className={`rounded-full bg-navy-deep/5 dark:bg-white/5 flex items-center justify-center grayscale ${
            isCenter ? 'w-12 h-12' : 'w-10 h-10'
          }`}>
            <span className="material-symbols-outlined text-navy-deep/20 dark:text-white/20">
              person
            </span>
          </div>
        )}
        <div>
          <h4 className={`font-bold text-navy-deep dark:text-white ${
            isCenter ? 'text-base' : 'text-sm'
          }`}>
            {authorName}
          </h4>
          <p className="text-xs text-navy-deep/50 dark:text-white/50 font-bold uppercase tracking-wider">
            {authorTitle}
            {authorCompany && `, ${authorCompany}`}
          </p>
        </div>
      </div>
    </div>
  )
}

export default CodelanceReviewCard

