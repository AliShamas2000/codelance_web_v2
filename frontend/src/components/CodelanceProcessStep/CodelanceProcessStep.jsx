import React, { useState, useEffect, useRef } from 'react'

const CodelanceProcessStep = ({
  stepNumber,
  title,
  description,
  icon = "code",
  position = "left", // "left" or "right"
  isActive = false,
  className = ""
}) => {
  const isLeft = position === "left"
  const [isVisible, setIsVisible] = useState(false)
  const cardRef = useRef(null)
  const markerRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            // Once visible, we can disconnect to prevent re-triggering
            observer.disconnect()
          }
        })
      },
      {
        threshold: 0.2, // Trigger when 20% of the element is visible
        rootMargin: '0px 0px -100px 0px' // Trigger slightly before fully in view
      }
    )

    if (cardRef.current) {
      observer.observe(cardRef.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <div className={`flex flex-col md:flex-row items-center justify-center w-full group ${className}`}>
      {/* Left Content */}
      {isLeft ? (
        <>
          <div 
            ref={cardRef}
            className={`w-full md:w-5/12 text-center md:text-right pr-0 md:pr-12 order-2 md:order-1 transition-all duration-1000 ease-out ${
              isVisible 
                ? 'opacity-100 translate-x-0' 
                : 'opacity-0 -translate-x-8'
            }`}
          >
            <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-xl border border-transparent hover:border-primary/30 transition-all duration-500 hover:-translate-y-2">
              <h3 className="text-2xl font-bold text-navy-deep dark:text-white mb-3">
                {stepNumber && <span className="text-primary">{stepNumber}. </span>}
                {title}
              </h3>
              {description && (
                <p className="text-[#5e808d] dark:text-gray-400 leading-relaxed">
                  {description}
                </p>
              )}
            </div>
          </div>
          {/* Marker */}
          <div 
            ref={markerRef}
            className={`relative flex items-center justify-center w-12 h-12 md:order-2 mt-0 mb-[4.5rem] md:my-0 transition-all duration-1000 ease-out delay-500 ${
              isVisible 
                ? 'opacity-100 scale-100' 
                : 'opacity-0 scale-0'
            }`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-background-light dark:border-background-dark shadow-md transition-colors duration-300 ${
              isActive 
                ? 'bg-primary text-white shadow-[0_0_20px_rgba(0,176,240,0.5)]' 
                : 'bg-white dark:bg-gray-800 text-primary group-hover:bg-primary group-hover:text-white'
            }`}>
              <span className="material-symbols-outlined text-xl">{icon}</span>
            </div>
          </div>
          <div className="w-full md:w-5/12 order-3"></div>
        </>
      ) : (
        <>
          <div className="w-full md:w-5/12 order-1 md:order-1"></div>
          {/* Marker */}
          <div 
            ref={markerRef}
            className={`relative flex items-center justify-center w-12 h-12 md:order-2 mt-0 mb-[4.5rem] md:my-0 transition-all duration-1000 ease-out delay-500 ${
              isVisible 
                ? 'opacity-100 scale-100' 
                : 'opacity-0 scale-0'
            }`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-background-light dark:border-background-dark shadow-md transition-colors duration-300 ${
              isActive 
                ? 'bg-primary text-white shadow-[0_0_20px_rgba(0,176,240,0.5)]' 
                : 'bg-white dark:bg-gray-800 text-primary group-hover:bg-primary group-hover:text-white'
            }`}>
              <span className="material-symbols-outlined text-xl">{icon}</span>
            </div>
          </div>
          <div 
            ref={cardRef}
            className={`w-full md:w-5/12 text-center md:text-left pl-0 md:pl-12 order-3 md:order-3 transition-all duration-1000 ease-out ${
              isVisible 
                ? 'opacity-100 translate-x-0' 
                : 'opacity-0 translate-x-8'
            }`}
          >
            <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-xl border border-transparent hover:border-primary/30 transition-all duration-500 hover:-translate-y-2">
              <h3 className="text-2xl font-bold text-navy-deep dark:text-white mb-3">
                {stepNumber && <span className="text-primary">{stepNumber}. </span>}
                {title}
              </h3>
              {description && (
                <p className="text-[#5e808d] dark:text-gray-400 leading-relaxed">
                  {description}
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default CodelanceProcessStep

