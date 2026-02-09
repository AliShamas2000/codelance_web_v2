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
        <p className="text-primary text-sm font-bold uppercase tracking-widest mb-2">
          {badge}
        </p>
      )}
      {title && (
        <h1 className="text-navy-deep dark:text-white text-4xl lg:text-5xl font-black text-center mb-4">
          {title}
        </h1>
      )}
      <div className="w-24 h-1 bg-primary rounded-full" style={{ width: '120px' }}></div>
      {description && (
        <p className="text-[#5e808d] dark:text-gray-400 text-lg font-normal leading-normal text-center mt-6 max-w-2xl">
          {description}
        </p>
      )}
    </div>
  )
}

export default CodelanceTeamHeader

