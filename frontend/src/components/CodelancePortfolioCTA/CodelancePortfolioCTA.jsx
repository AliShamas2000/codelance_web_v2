import React from 'react'
import { useNavigate } from 'react-router-dom'
import useScrollReveal from '../../hooks/useScrollReveal'

const CodelancePortfolioCTA = ({
  title = "Have a visionary project in mind?",
  subtitle = "From concept to deployment, we build the digital future of your business with precision and passion.",
  primaryButtonText = "Get Started",
  primaryButtonAction = null,
  secondaryButtonText = "Our Process",
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
      navigate('/#process')
    }
  }

  return (
    <div 
      ref={ref}
      className={`mt-24 transition-all duration-1000 ease-out ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-8'
      } ${className}`}
    >
      <div className="bg-navy-deep dark:bg-gray-900 rounded-2xl p-12 lg:p-16 text-center text-white relative overflow-hidden group">
        <div className="absolute inset-0 bg-primary/10 group-hover:bg-primary/20 transition-all duration-700"></div>
        <div className="relative z-10">
          {title && (
            <h2 className="text-3xl lg:text-4xl font-black mb-6">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-gray-300 dark:text-gray-400 mb-10 max-w-xl mx-auto">
              {subtitle}
            </p>
          )}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {primaryButtonText && (
              <button
                onClick={handlePrimaryClick}
                className="w-full sm:w-auto bg-primary text-white text-base font-bold px-10 py-4 rounded-xl hover:shadow-xl hover:shadow-primary/40 transition-all active:scale-95"
              >
                {primaryButtonText}
              </button>
            )}
            {secondaryButtonText && (
              <button
                onClick={handleSecondaryClick}
                className="w-full sm:w-auto border-2 border-navy-deep dark:border-white/20 text-white text-base font-bold px-10 py-4 rounded-xl hover:bg-white hover:text-navy-deep transition-all active:scale-95"
              >
                {secondaryButtonText}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CodelancePortfolioCTA

