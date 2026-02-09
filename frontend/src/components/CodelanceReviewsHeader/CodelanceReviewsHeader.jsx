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
        <h1 className="text-navy-deep dark:text-white text-4xl lg:text-5xl font-black text-center mb-4">
          {title}
        </h1>
      )}
      <div className="w-24 h-1 bg-primary rounded-full mb-4" style={{ width: '120px' }}></div>
      {description && (
        <p className="text-[#5e808d] dark:text-gray-400 text-lg font-normal leading-normal text-center max-w-2xl">
          {description}
        </p>
      )}
    </div>
  )
}

export default CodelanceReviewsHeader

