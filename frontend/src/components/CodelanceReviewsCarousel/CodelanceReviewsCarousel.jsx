import React, { useState, useEffect } from 'react'
import CodelanceReviewCard from '../CodelanceReviewCard/CodelanceReviewCard'
import useScrollReveal from '../../hooks/useScrollReveal'

const CodelanceReviewsCarousel = ({
  reviews = [],
  autoPlay = true,
  autoPlayInterval = 5000,
  className = ""
}) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isVisible, ref] = useScrollReveal({ threshold: 0.2 })

  // Default reviews if none provided
  const defaultReviews = [
    {
      id: 1,
      quote: "CODELANCE transformed our digital presence with unparalleled precision. Their team delivered a robust solution that exceeded our expectations in every way. The scale of innovation was truly remarkable.",
      authorName: "Sarah Jenkins",
      authorTitle: "CTO",
      authorCompany: "TechVision Global",
      authorImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuAlFmbf_O6sK7pOPnQbnPvKonNDCsRTHEeqiyfFJ3uxlpoDp6no0Uc9o5uxccVzerziireucx_k_eP2iAaA3QuevxvjpIRfwTPqknS7otWfgYxoWFtm7Csr6cGGngWonHS2JqspojqehRFj8ZgDZBQ5K9fk4xH4WAA41cmUUHLLFh4Ir_5FnLUl5U8H2uJcps8JWTm8_EFLjdZIOGjfcsEC6RiteasDbkwDcgMffLkRPnaN5eulBQ8R2X5sh4HC76_DvUGX97cLFig"
    },
    {
      id: 2,
      quote: "The engineering prowess at CODELANCE is unmatched. They don't just build software; they build competitive advantages.",
      authorName: "Marcus Thorne",
      authorTitle: "Founder",
      authorCompany: "InnovateHQ",
      authorImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuBkPu-sl24UYHT9kkMsExmIOCLvjJonehqAdI_mir9q5OYs-2ZyBEef72ZKL0a1uXGACqNwA4b5O9bnOYG2mhTvRuR4XnvaaW2KRbaSsdw754REp56pw6t6cKhxkuqVAkErmgBuJ4K4VSIBmgQJynGGjSQc6Y_TFV70hURq1mBtQYa_mM6R2T6efygeHCUzO9-jnlduQgD2rYrz5cCrCnVcWG3stvLf-yAZoQkJw3G9YwuRcBAfX9hj3K3B98-6WPvDvGTkXKdOeC4"
    },
    {
      id: 3,
      quote: "The transition to our new platform was seamless. Codelance's attention to detail ensured zero downtime during the entire migration process.",
      authorName: "David Chen",
      authorTitle: "VP Ops",
      authorCompany: "NexaCore",
      authorImage: null
    }
  ]

  const displayReviews = reviews.length > 0 ? reviews : defaultReviews

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay || displayReviews.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayReviews.length)
    }, autoPlayInterval)

    return () => clearInterval(interval)
  }, [autoPlay, autoPlayInterval, displayReviews.length])

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + displayReviews.length) % displayReviews.length)
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % displayReviews.length)
  }

  const handleDotClick = (index) => {
    setCurrentIndex(index)
  }

  // Get visible reviews (previous, current, next)
  const getVisibleReviews = () => {
    const prevIndex = (currentIndex - 1 + displayReviews.length) % displayReviews.length
    const nextIndex = (currentIndex + 1) % displayReviews.length

    return [
      { ...displayReviews[prevIndex], isCenter: false },
      { ...displayReviews[currentIndex], isCenter: true },
      { ...displayReviews[nextIndex], isCenter: false }
    ]
  }

  const visibleReviews = getVisibleReviews()

  return (
    <div 
      ref={ref}
      className={`relative transition-all duration-1000 ease-out ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-8'
      } ${className}`}
    >
      <div className="relative flex items-center justify-center testimonial-container">
        {/* Navigation Buttons */}
        {displayReviews.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-4 z-20 w-10 h-10 rounded-full bg-white dark:bg-gray-900 border border-navy-deep/5 dark:border-white/5 flex items-center justify-center text-navy-deep dark:text-white hover:text-primary hover:border-primary transition-all shadow-sm"
              aria-label="Previous review"
            >
              <span className="material-symbols-outlined text-xl">chevron_left</span>
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 z-20 w-10 h-10 rounded-full bg-white dark:bg-gray-900 border border-navy-deep/5 dark:border-white/5 flex items-center justify-center text-navy-deep dark:text-white hover:text-primary hover:border-primary transition-all shadow-sm"
              aria-label="Next review"
            >
              <span className="material-symbols-outlined text-xl">chevron_right</span>
            </button>
          </>
        )}

        {/* Reviews Container */}
        <div className="flex items-center gap-6 py-8">
          {visibleReviews.map((review, index) => (
            <CodelanceReviewCard
              key={`${review.id ?? 'review'}-${index}`}
              quote={review.quote}
              authorName={review.authorName}
              authorTitle={review.authorTitle}
              authorCompany={review.authorCompany}
              authorImage={review.authorImage}
              isCenter={review.isCenter}
              className={index === 0 || index === 2 ? 'hidden lg:flex' : ''}
            />
          ))}
        </div>
      </div>

      {/* Dots Indicator */}
      {displayReviews.length > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {displayReviews.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`w-1.5 h-1.5 rounded-full transition-all ${
                index === currentIndex
                  ? 'bg-primary'
                  : 'bg-navy-deep/10 dark:bg-white/10 hover:bg-navy-deep/30 dark:hover:bg-white/30'
              }`}
              aria-label={`Go to review ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default CodelanceReviewsCarousel

