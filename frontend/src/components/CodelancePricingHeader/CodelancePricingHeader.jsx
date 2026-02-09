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
        <h1 className="text-navy-deep dark:text-white text-4xl md:text-5xl font-black text-center mb-4">
          {title}
        </h1>
      )}
      <div className="mx-auto w-24 h-1 bg-primary rounded-full" style={{ width: '120px' }}></div>
      {description && (
        <p className="text-[#5e808d] dark:text-gray-400 text-lg font-normal leading-normal text-center mt-6 max-w-2xl mx-auto">
          {description}
        </p>
      )}
    </section>
  )
}

export default CodelancePricingHeader

