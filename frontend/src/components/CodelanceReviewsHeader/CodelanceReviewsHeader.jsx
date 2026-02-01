import React from 'react'
import useScrollReveal from '../../hooks/useScrollReveal'

const CodelanceReviewsHeader = ({
  title = "Client Success Stories",
  description = "Hear from the innovative teams we've partnered with to build the future of digital infrastructure.",
  className = ""
}) => {
  const [isVisible, ref] = useScrollReveal({ threshold: 0.2 })

  return (
    <div 
      ref={ref}
      className={`flex flex-col items-center text-center mb-12 transition-all duration-1000 ease-out ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-8'
      } ${className}`}
    >
      {title && (
        <h2 className="text-3xl font-extrabold text-navy-deep dark:text-white mb-3">
          {title}
        </h2>
      )}
      <div className="signature-line mb-4"></div>
      {description && (
        <p className="text-navy-deep/60 dark:text-gray-400 text-base max-w-lg">
          {description}
        </p>
      )}
    </div>
  )
}

export default CodelanceReviewsHeader

