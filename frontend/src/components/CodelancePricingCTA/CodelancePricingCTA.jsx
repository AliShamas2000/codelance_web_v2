import React from 'react'
import { useNavigate } from 'react-router-dom'
import useScrollReveal from '../../hooks/useScrollReveal'

const CodelancePricingCTA = ({
  title = "Need a custom solution?",
  description = "Our team can build a tailor-made package specifically for your enterprise requirements, including specialized integrations and dedicated server architecture.",
  primaryButtonText = "Schedule a Discovery Call",
  primaryButtonAction = null,
  secondaryButtonText = "View Full Services",
  secondaryButtonAction = null,
  className = ""
}) => {
  const navigate = useNavigate()
  const [isVisible, ref] = useScrollReveal({ threshold: 0.2 })

  const handlePrimaryClick = () => {
    if (primaryButtonAction) {
      primaryButtonAction()
    } else {
      navigate('/contact')
    }
  }

  const handleSecondaryClick = () => {
    if (secondaryButtonAction) {
      secondaryButtonAction()
    } else {
      navigate('/services')
    }
  }

  return (
    <section 
      ref={ref}
      className={`max-w-[1200px] mx-auto px-6 py-20 transition-all duration-1000 ease-out ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-8'
      } ${className}`}
    >
      <div className="rounded-xl bg-navy-deep dark:bg-gray-900 px-10 py-16 text-center relative overflow-hidden">
        {/* Abstract Background Decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full -ml-20 -mb-20 blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col items-center gap-6">
          {title && (
            <h2 className="text-white text-3xl md:text-4xl font-black tracking-tight max-w-2xl">
              {title}
            </h2>
          )}
          {description && (
            <p className="text-gray-300 dark:text-gray-400 text-base md:text-lg max-w-xl mx-auto">
              {description}
            </p>
          )}
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {primaryButtonText && (
              <button
                onClick={handlePrimaryClick}
                className="flex items-center justify-center rounded-xl h-14 px-8 bg-primary text-white text-base font-black transition-all hover:scale-105 shadow-lg"
              >
                {primaryButtonText}
              </button>
            )}
            {secondaryButtonText && (
              <button
                onClick={handleSecondaryClick}
                className="flex items-center justify-center rounded-xl h-14 px-8 border border-white/20 text-white text-base font-bold transition-all hover:bg-white/10"
              >
                {secondaryButtonText}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default CodelancePricingCTA

