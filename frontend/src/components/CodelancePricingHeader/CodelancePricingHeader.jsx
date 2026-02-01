import React from 'react'
import useScrollReveal from '../../hooks/useScrollReveal'

const CodelancePricingHeader = ({
  title = "Pricing Packages",
  description = "Choose the perfect plan for your technical needs. Our flexible packages are designed to scale with your business and deliver premium GSAP-powered experiences.",
  className = ""
}) => {
  const [isVisible, ref] = useScrollReveal({ threshold: 0.2 })

  return (
    <section 
      ref={ref}
      className={`max-w-[1200px] mx-auto px-6 pt-16 pb-8 text-center transition-all duration-1000 ease-out ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-8'
      } ${className}`}
    >
      {title && (
        <h1 className="text-navy-deep dark:text-white text-4xl md:text-5xl font-black leading-tight tracking-tighter mb-4">
          {title}
        </h1>
      )}
      {description && (
        <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
          {description}
        </p>
      )}
    </section>
  )
}

export default CodelancePricingHeader

