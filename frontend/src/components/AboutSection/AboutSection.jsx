import React from 'react'
import AboutContent from '../AboutContent/AboutContent'
import AboutImage from '../AboutImage/AboutImage'

const AboutSection = ({
  // Content props
  establishedYear,
  title,
  description,
  secondaryDescription,
  
  // Button props
  primaryButtonText,
  primaryButtonHref,
  primaryButtonOnClick,
  secondaryButtonText,
  secondaryButtonHref,
  secondaryButtonOnClick,
  
  // Stats props
  stats = [],
  
  // Image props
  imageUrl,
  imageAlt,
  badgeProps = {},
  
  // Styling
  className = ""
}) => {
  return (
    <section className={`mx-auto ${className}`}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* Text Column */}
        <AboutContent
          establishedYear={establishedYear}
          title={title}
          description={description}
          secondaryDescription={secondaryDescription}
          primaryButtonText={primaryButtonText}
          primaryButtonOnClick={primaryButtonOnClick}
          secondaryButtonText={secondaryButtonText}
          secondaryButtonOnClick={secondaryButtonOnClick}
          stats={stats}
        />

        {/* Image Column */}
        <AboutImage
          imageUrl={imageUrl}
          imageAlt={imageAlt}
          badgeProps={badgeProps}
        />
      </div>
    </section>
  )
}

export default AboutSection

