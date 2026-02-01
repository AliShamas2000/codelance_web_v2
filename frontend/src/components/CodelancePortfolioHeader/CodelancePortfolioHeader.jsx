import React from 'react'
import useScrollReveal from '../../hooks/useScrollReveal'

const CodelancePortfolioHeader = ({
  badge = "Showcase",
  title = "Our Portfolio",
  description = null,
  className = ""
}) => {
  const [isVisible, ref] = useScrollReveal({ threshold: 0.2 })

  return (
    <div 
      ref={ref}
      className={`flex flex-col items-center mb-16 transition-all duration-1000 ease-out ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-8'
      } ${className}`}
    >
      {badge && (
        <span className="text-primary text-xs font-black uppercase tracking-[0.3em] mb-4">
          {badge}
        </span>
      )}
      {title && (
        <h2 className="text-4xl lg:text-5xl font-black text-navy-deep dark:text-white text-center">
          {title}
        </h2>
      )}
      <div className="mt-6 w-20 h-1.5 bg-primary rounded-full"></div>
      {description && (
        <p className="text-[#5e808d] dark:text-gray-400 text-lg font-normal leading-normal text-center mt-6 max-w-2xl">
          {description}
        </p>
      )}
    </div>
  )
}

export default CodelancePortfolioHeader

