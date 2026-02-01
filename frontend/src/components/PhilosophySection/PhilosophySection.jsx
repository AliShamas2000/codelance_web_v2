import React from 'react'
import FeaturesGrid from '../FeaturesGrid/FeaturesGrid'

const PhilosophySection = ({
  // Badge props
  badge = "Our Philosophy",
  badgeIcon = "w-2 h-2 rounded-full bg-primary animate-pulse",
  
  // Content props
  title = "Refining the Art of Modern Grooming.",
  titleHighlight = "Modern Grooming.",
  description = "We don't just cut hair; we cultivate confidence. Our philosophy is rooted in the belief that every detail matters. From the moment you walk in, to the final hot towel finish, we are dedicated to providing an experience that transcends the ordinary.",
  
  // Team props
  teamAvatars = [],
  teamTitle = "Master Barbers",
  teamSubtitle = "15+ Years Combined",
  
  // Features props
  features = [],
  
  // Loading state
  isLoading = false,
  
  // Styling
  className = ""
}) => {
  return (
    <section className={`w-full ${className}`}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left Column: Content */}
        <div className="space-y-8">
          {/* Badge */}
          {badge && (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 w-fit">
              {badgeIcon && (
                <span className={badgeIcon}></span>
              )}
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                {badge}
              </span>
            </div>
          )}

          {/* Title */}
          {title && (
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white leading-[1.1]">
              {title.split(titleHighlight || 'Modern Grooming.')[0]}
              {titleHighlight && (
                <span className="text-slate-400 dark:text-slate-500">
                  {titleHighlight}
                </span>
              )}
            </h2>
          )}

          {/* Description */}
          {description && (
            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
              {description}
            </p>
          )}

          {/* Team Info */}
          {(teamAvatars.length > 0 || teamTitle) && (
            <div className="pt-4 flex items-center gap-6">
              {/* Avatars */}
              {teamAvatars.length > 0 && (
                <>
                  <div className="flex -space-x-3">
                    {teamAvatars.map((avatar, index) => (
                      <div
                        key={index}
                        className={`size-10 rounded-full ${
                          avatar.bgColor || 'bg-slate-200'
                        } border-2 border-white dark:border-background-dark flex items-center justify-center text-xs font-bold ${
                          avatar.textColor || 'text-slate-600'
                        }`}
                      >
                        {avatar.initials || '??'}
                      </div>
                    ))}
                  </div>
                  <div className="h-10 border-l border-slate-200 dark:border-white/10"></div>
                </>
              )}
              
              {/* Team Info */}
              {(teamTitle || teamSubtitle) && (
                <div>
                  {teamTitle && (
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      {teamTitle}
                    </p>
                  )}
                  {teamSubtitle && (
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">
                      {teamSubtitle}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Features Grid */}
        <div>
          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <p>Loading features...</p>
            </div>
          )}

          {/* Features Grid */}
          {!isLoading && (
            <FeaturesGrid
              features={features}
              columns={2}
            />
          )}
        </div>
      </div>
    </section>
  )
}

export default PhilosophySection

