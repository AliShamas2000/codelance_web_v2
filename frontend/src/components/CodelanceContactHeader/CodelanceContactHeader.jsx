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
        <h2 className="text-5xl md:text-6xl font-extrabold leading-[1.1] text-navy-deep dark:text-white">
          {title} <br/>
          {titleHighlight && (
            <span className="text-primary">{titleHighlight}</span>
          )}
        </h2>
      )}
      {description && (
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-md">
          {description}
        </p>
      )}
    </div>
  )
}

export default CodelanceContactHeader

