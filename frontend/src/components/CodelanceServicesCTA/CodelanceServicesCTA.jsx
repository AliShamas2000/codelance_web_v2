import React from 'react'
import { useNavigate } from 'react-router-dom'

const CodelanceServicesCTA = ({
  title = "Ready to transform your digital presence?",
  subtitle = "Let's build something amazing together.",
  primaryButtonText = "Start a Project",
  primaryButtonAction = null,
  secondaryButtonText = "Contact Us",
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
      navigate('/contact')
    }
  }

  return (
    <div className={`mt-24 @container ${className}`}>
      <div className="bg-navy-deep dark:bg-background-dark/50 rounded-xl overflow-hidden shadow-2xl reveal stagger-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 px-10 py-16">
          <div className="flex flex-col gap-4 text-center lg:text-left">
            {title && (
              <h2 className="text-white text-3xl lg:text-4xl font-black leading-tight tracking-tight max-w-[500px]">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-primary text-base font-medium">{subtitle}</p>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            {primaryButtonText && (
              <button
                onClick={handlePrimaryClick}
                className="min-w-[180px] cursor-pointer bg-primary text-white text-base font-bold px-10 py-4 rounded-xl hover:shadow-xl hover:shadow-primary/40 transition-all active:scale-95"
              >
                {primaryButtonText}
              </button>
            )}
            {secondaryButtonText && (
              <button
                onClick={handleSecondaryClick}
                className="min-w-[180px] cursor-pointer border-2 border-navy-deep dark:border-white/20 text-white text-base font-bold px-10 py-4 rounded-xl hover:bg-white hover:text-navy-deep transition-all active:scale-95"
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

export default CodelanceServicesCTA

