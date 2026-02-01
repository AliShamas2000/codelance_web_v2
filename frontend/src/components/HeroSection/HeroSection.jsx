import React, { useState, useEffect } from 'react'
import bannersApi from '../../api/banners'

const HeroSection = ({
  onButtonClick,
  className = ""
}) => {
  const [banners, setBanners] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch active banners from API
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await bannersApi.getActiveBanners({ limit: 10 })
        const bannersData = response.data || response || []
        setBanners(bannersData)
        
        // If no banners, set default fallback
        if (bannersData.length === 0) {
          setBanners([{
            id: 'default',
            title: 'Elevate Your Style Today.',
            description: 'Experience premium grooming services in a modern, relaxing atmosphere designed for the contemporary gentleman.',
            buttonTextEn: 'Book Appointment',
            desktopImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBlbw5Y-GisMreZ_U4a9u5TxWYnQRy_1tIixvZk7ctdx4zRdVGniwJbK5cz0RRmBuPNLKe0UGMEirD_lcafuRLmajViNhH7bkvBGwa57qmPWDqkdMRK1qDS-wsJtk2vNTEJtczbPsni7UXcxiLgm07mumPmTMj-XDble9EJ-6iQQCTn2Sk8FN6CMfeHGzwPCTWdWhsrpM1Lfq4oATgyP1QRswi2OyzyVsNZ15KK3AU7uWr4v5cCZqn12B8zJQpQvvUU8aIW20Yggqg',
            mobileImage: null,
            buttonUrl: '#',
          }])
        }
      } catch (error) {
        console.error('Error fetching banners:', error)
        setError('Failed to load banners')
        // Set default fallback on error
        setBanners([{
          id: 'default',
          title: 'Elevate Your Style Today.',
          description: 'Experience premium grooming services in a modern, relaxing atmosphere designed for the contemporary gentleman.',
          buttonTextEn: 'Book Appointment',
          desktopImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBlbw5Y-GisMreZ_U4a9u5TxWYnQRy_1tIixvZk7ctdx4zRdVGniwJbK5cz0RRmBuPNLKe0UGMEirD_lcafuRLmajViNhH7bkvBGwa57qmPWDqkdMRK1qDS-wsJtk2vNTEJtczbPsni7UXcxiLgm07mumPmTMj-XDble9EJ-6iQQCTn2Sk8FN6CMfeHGzwPCTWdWhsrpM1Lfq4oATgyP1QRswi2OyzyVsNZ15KK3AU7uWr4v5cCZqn12B8zJQpQvvUU8aIW20Yggqg',
          mobileImage: null,
          buttonUrl: '#',
        }])
      } finally {
        setIsLoading(false)
      }
    }

    fetchBanners()
  }, [])

  // Auto-rotate banners if multiple exist
  useEffect(() => {
    if (banners.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length)
    }, 5000) // Change banner every 5 seconds

    return () => clearInterval(interval)
  }, [banners.length])

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + banners.length) % banners.length)
  }

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length)
  }

  const handleDotClick = (index) => {
    setCurrentIndex(index)
  }

  if (isLoading) {
    return (
      <section className={`mt-10 relative w-full h-[600px] rounded-2xl overflow-hidden bg-slate-900 flex items-center justify-center ${className}`}>
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-white text-sm">Loading banners...</p>
        </div>
      </section>
    )
  }

  if (error && banners.length === 0) {
    return (
      <section className={`mt-10 relative w-full h-[600px] rounded-2xl overflow-hidden bg-slate-900 flex items-center justify-center ${className}`}>
        <div className="text-center text-white">
          <p className="text-sm">{error}</p>
        </div>
      </section>
    )
  }

  const currentBanner = banners[currentIndex] || banners[0]
  if (!currentBanner) return null

  // Get button text (prefer English, fallback to Arabic, then default)
  const buttonText = currentBanner.buttonTextEn || currentBanner.buttonTextAr || 'Book Appointment'
  const imageUrl = currentBanner.desktopImage || currentBanner.mobileImage || ''
  const mobileImageUrl = currentBanner.mobileImage || currentBanner.desktopImage || ''
  
  // Handle button click - if buttonUrl exists, navigate to it, otherwise use onButtonClick
  const handleButtonClick = () => {
    if (currentBanner.buttonUrl && currentBanner.buttonUrl !== '#') {
      if (currentBanner.buttonUrl.startsWith('http')) {
        window.open(currentBanner.buttonUrl, '_blank')
      } else {
        window.location.href = currentBanner.buttonUrl
      }
    } else if (onButtonClick) {
      onButtonClick()
    }
  }

  return (
    <section className={`mt-10 relative w-full h-[600px] rounded-2xl overflow-hidden bg-slate-900 flex items-end p-10 group ${className}`}>
      {/* Background Images - Responsive */}
      {imageUrl && (
        <>
          {/* Desktop Image */}
          <img
            alt={currentBanner.title || 'Banner'}
            className="hidden md:block absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
            src={imageUrl}
            onError={(e) => {
              e.target.style.display = 'none'
            }}
          />
          {/* Mobile Image */}
          {mobileImageUrl && mobileImageUrl !== imageUrl && (
            <img
              alt={currentBanner.title || 'Banner'}
              className="md:hidden absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
              src={mobileImageUrl}
              onError={(e) => {
                e.target.style.display = 'none'
              }}
            />
          )}
        </>
      )}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

      {/* Navigation Arrows (if multiple banners) */}
      {banners.length > 1 && (
        <>
          <button
            onClick={handlePrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-colors"
            aria-label="Previous banner"
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-colors"
            aria-label="Next banner"
          >
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </>
      )}

      {/* Content */}
      <div className="relative z-10 max-w-2xl w-full">
        {/* Badge */}
        <span className="inline-block py-1 px-3 mb-4 rounded-full bg-primary/20 text-primary text-xs font-bold uppercase tracking-wider backdrop-blur-sm border border-primary/20">
          Welcome to The Studio
        </span>

        {/* Title */}
        <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          {currentBanner.title || (
            <>
              Elevate Your <br />
              <span className="text-primary">Style</span> Today.
            </>
          )}
        </h2>

        {/* Description */}
        {currentBanner.description && (
          <p className="text-lg text-slate-200 mb-8 max-w-lg">
            {currentBanner.description}
          </p>
        )}

        {/* CTA Button */}
        {buttonText && (
          <button
            onClick={handleButtonClick}
            className="px-8 py-4 bg-primary text-background-dark font-bold rounded-lg hover:bg-white hover:text-black transition-colors duration-300 flex items-center gap-2"
          >
            {buttonText}
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        )}
      </div>

      {/* Dots Indicator (if multiple banners) */}
      {banners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'w-8 bg-primary'
                  : 'w-2 bg-white/40 hover:bg-white/60'
              }`}
              aria-label={`Go to banner ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  )
}

export default HeroSection
