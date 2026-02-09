import React from 'react'
import { useNavigate } from 'react-router-dom'
import useScrollReveal from '../../hooks/useScrollReveal'

const CodelanceProcessCTA = ({
  title = "Ready to build something amazing?",
  subtitle = "Join dozens of successful companies scaling with our proven process.",
  primaryButtonText = "Contact Us Today",
  primaryButtonAction = null,
  secondaryButtonText = "View Portfolio",
  secondaryButtonAction = null,
  className = ""
}) => {
  const navigate = useNavigate()

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
      navigate('/portfolio')
    }
  }

  const [isVisible, ref] = useScrollReveal({ threshold: 0.2 })

  return (
    <section 
      ref={ref}
      className={`max-w-[1200px] mx-auto px-6 py-24 transition-all duration-1000 ease-out ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-8'
      } ${className}`}
    >
      <div className="relative bg-navy-deep dark:bg-gray-900 rounded-2xl p-10 md:p-20 overflow-hidden">
        {/* Abstract Background Pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-gradient-to-br from-primary to-transparent"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="max-w-[600px] text-center md:text-left">
            {title && (
              <h2 className="text-white text-3xl md:text-5xl font-black mb-4">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-white/70 text-lg">
                {subtitle}
              </p>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            {primaryButtonText && (
              <button
                onClick={handlePrimaryClick}
                className="bg-primary text-white text-base font-bold px-10 py-4 rounded-xl hover:shadow-xl hover:shadow-primary/40 transition-all active:scale-95 whitespace-nowrap"
              >
                {primaryButtonText}
              </button>
            )}
            {secondaryButtonText && (
              <button
                onClick={handleSecondaryClick}
                className="border-2 border-navy-deep/20 dark:border-white/20 text-white text-base font-bold px-10 py-4 rounded-xl hover:bg-white hover:text-navy-deep transition-all active:scale-95 whitespace-nowrap"
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

export default CodelanceProcessCTA

