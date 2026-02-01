import React from 'react'
import StatsGrid from '../StatsGrid/StatsGrid'

const AboutContent = ({
  establishedYear = "2015",
  title = "Refined Grooming for the Modern Man",
  description = "At Blade & Co, we believe a haircut is more than just a routine—it's a ritual. We've created a sanctuary where old-school craftsmanship meets contemporary aesthetics.",
  secondaryDescription = "Our barbers are master artisans dedicated to the preservation of traditional barbering while embracing the nuances of modern style. Sit back, relax, and let us refine your look with precision and care.",
  primaryButtonText = "Meet the Team",
  primaryButtonHref = "#",
  primaryButtonOnClick,
  secondaryButtonText = "View Services",
  secondaryButtonHref = "#",
  secondaryButtonOnClick,
  stats = [],
  className = ""
}) => {
  return (
    <div className={`flex flex-col gap-8 order-2 lg:order-1 ${className}`}>
      {/* Text Content */}
      <div className="space-y-4">
        {/* Established Badge */}
        <div className="flex items-center gap-3">
          <span className="h-px w-8 bg-primary"></span>
          <span className="text-sm font-bold uppercase tracking-widest text-primary">
            Est. {establishedYear}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-text-main dark:text-white leading-[1.1] tracking-tight">
          {title}
        </h1>

        {/* Descriptions */}
        <p className="text-lg text-text-muted dark:text-gray-400 leading-relaxed max-w-xl">
          {description}
        </p>
        {secondaryDescription && (
          <p className="text-base text-text-muted dark:text-gray-400 leading-relaxed max-w-xl">
            {secondaryDescription}
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        {primaryButtonText && (
          <button
            onClick={primaryButtonOnClick}
            className="flex min-w-[140px] items-center justify-center rounded-lg bg-primary px-6 py-3.5 text-base font-bold text-text-main transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20"
          >
            {primaryButtonText}
          </button>
        )}
        {secondaryButtonText && (
          <button
            onClick={secondaryButtonOnClick}
            className="flex min-w-[140px] items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-transparent px-6 py-3.5 text-base font-bold text-text-main dark:text-white transition-all hover:bg-gray-50 dark:hover:bg-white/5"
          >
            {secondaryButtonText}
          </button>
        )}
      </div>

      {/* Quick Stats */}
      <StatsGrid stats={stats} />
    </div>
  )
}

export default AboutContent

