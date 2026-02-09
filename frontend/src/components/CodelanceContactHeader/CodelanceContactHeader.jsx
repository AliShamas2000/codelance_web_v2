import React from 'react'
import useScrollReveal from '../../hooks/useScrollReveal'

const CodelanceContactHeader = ({
  title = "Let's Build",
  titleHighlight = "Something Great",
  description = "Have a vision for the next big thing? Our team of experts is ready to transform your ideas into world-class digital solutions.",
  className = ""
}) => {
  const [isVisible, ref] = useScrollReveal({ threshold: 0.2 })

  return (
    <div 
      ref={ref}
      className={`space-y-6 transition-all duration-1000 ease-out ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-8'
      } ${className}`}
    >
      {title && (
        <div>
          <h1 className="text-navy-deep dark:text-white text-4xl lg:text-5xl font-black">
            {title}{' '}
            {titleHighlight && (
              <span className="text-primary">{titleHighlight}</span>
            )}
          </h1>
          <div className="mt-4 w-24 h-1 bg-primary rounded-full" style={{ width: '120px' }}></div>
        </div>
      )}
      {description && (
        <p className="text-[#5e808d] dark:text-gray-400 text-lg font-normal leading-normal max-w-md">
          {description}
        </p>
      )}
    </div>
  )
}

export default CodelanceContactHeader

