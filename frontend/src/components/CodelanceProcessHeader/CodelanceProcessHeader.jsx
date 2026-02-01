import React from 'react'
import useScrollReveal from '../../hooks/useScrollReveal'

const CodelanceProcessHeader = ({
  badge = "Our Methodology",
  title = "How We Work",
  description = "We follow a structured, transparent process to turn your complex ideas into high-performance digital realities.",
  className = ""
}) => {
  const [isVisible, ref] = useScrollReveal({ threshold: 0.2 })

  return (
    <section 
      ref={ref}
      className={`pt-20 pb-10 transition-all duration-1000 ease-out ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-8'
      } ${className}`}
    >
      <div className="max-w-[800px] mx-auto text-center px-4">
        {badge && (
          <span className="text-primary font-bold tracking-[0.2em] uppercase text-sm mb-4 block">
            {badge}
          </span>
        )}
        {title && (
          <h1 className="text-navy-deep dark:text-white text-5xl md:text-6xl font-black tracking-tight mb-6">
            {title}
          </h1>
        )}
        {description && (
          <p className="text-lg text-[#5e808d] dark:text-gray-400 max-w-2xl mx-auto">
            {description}
          </p>
        )}
      </div>
    </section>
  )
}

export default CodelanceProcessHeader

