import React from 'react'
import useScrollReveal from '../../hooks/useScrollReveal'

const CodelanceTeamHeader = ({
  badge = "Our Team",
  title = "Meet the Experts",
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
        <span className="text-primary text-sm font-extrabold tracking-[0.2em] uppercase mb-4">
          {badge}
        </span>
      )}
      {title && (
        <h1 className="text-navy-deep dark:text-white text-4xl md:text-5xl font-extrabold tracking-tight text-center">
          {title}
        </h1>
      )}
      <div className="w-16 h-1.5 bg-primary rounded-full mt-6"></div>
      {description && (
        <p className="text-[#5e808d] dark:text-gray-400 text-lg font-normal leading-normal text-center mt-6 max-w-2xl">
          {description}
        </p>
      )}
    </div>
  )
}

export default CodelanceTeamHeader

