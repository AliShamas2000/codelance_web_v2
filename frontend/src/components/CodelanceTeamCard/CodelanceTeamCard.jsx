import React from 'react'
import useScrollReveal from '../../hooks/useScrollReveal'

const CodelanceTeamCard = ({
  id,
  name,
  jobTitle,
  imageUrl,
  imageAlt = "",
  socialLinks = [],
  onClick = null,
  className = ""
}) => {
  const [isVisible, ref] = useScrollReveal({ threshold: 0.1 })

  const handleClick = () => {
    if (onClick) {
      onClick({ id, name, jobTitle, imageUrl, socialLinks })
    }
  }

  // Map social media platform to Material Symbol icon
  const getSocialIcon = (platform) => {
    const iconMap = {
      'linkedin': 'group',
      'linkedin.com': 'group',
      'twitter': 'share',
      'twitter.com': 'share',
      'x.com': 'share',
      'github': 'code',
      'github.com': 'code',
      'instagram': 'photo_camera',
      'instagram.com': 'photo_camera',
      'facebook': 'public',
      'facebook.com': 'public',
      'youtube': 'play_circle',
      'youtube.com': 'play_circle',
      'tiktok': 'video_library',
      'tiktok.com': 'video_library',
      'email': 'alternate_email',
      'mail': 'alternate_email',
      'website': 'language',
      'web': 'language'
    }

    const platformLower = (platform || '').toLowerCase()
    for (const [key, icon] of Object.entries(iconMap)) {
      if (platformLower.includes(key)) {
        return icon
      }
    }
    return 'share' // Default icon
  }

  return (
    <div
      ref={ref}
      className={`group relative bg-white dark:bg-navy-deep/40 rounded-xl overflow-hidden shadow-sm flex flex-col h-full border border-navy-deep/5 dark:border-white/5 transition-all duration-500 ease-out cursor-pointer hover:-translate-y-[10px] hover:shadow-[0_20px_40px_rgba(0,43,73,0.08)] dark:hover:shadow-[0_20px_40px_rgba(0,176,240,0.08)] ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-8'
      } ${className}`}
      onClick={handleClick}
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden m-4 rounded-lg">
        {imageUrl ? (
          <div
            className="parallax-img w-full h-full bg-center bg-cover transition-transform duration-700 group-hover:scale-105"
            style={{ backgroundImage: `url('${imageUrl}')` }}
            role="img"
            aria-label={imageAlt || name}
          />
        ) : (
          <div className="w-full h-full bg-primary/10 rounded-lg flex items-center justify-center">
            <span className="material-symbols-outlined text-6xl text-primary/30">
              person
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="px-6 pb-8 pt-2 flex flex-col grow">
        {name && (
          <h3 className="text-navy-deep dark:text-white text-xl font-bold mb-1">
            {name}
          </h3>
        )}
        {jobTitle && (
          <p className="text-[#5e808d] dark:text-[#5e808d]/80 text-sm font-medium mb-6">
            {jobTitle}
          </p>
        )}
        
        {/* Social Icons - Reveal on Hover */}
        {socialLinks && socialLinks.length > 0 && (
          <div className="social-reveal mt-auto flex gap-4">
            {socialLinks.map((link, index) => {
              const url = link.url || link.href || link.link || link
              const platform = link.platform || link.type || ''
              const icon = getSocialIcon(platform)

              // Skip if no valid URL
              if (!url || url === '#') return null

              return (
                <a
                  key={index}
                  href={url}
                  target={link.target || "_blank"}
                  rel={link.rel || "noopener noreferrer"}
                  className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all"
                  onClick={(e) => e.stopPropagation()}
                  aria-label={`${name}'s ${platform || link.label || 'social'} profile`}
                >
                  <span className="material-symbols-outlined text-[20px]">{icon}</span>
                </a>
              )
            })}
          </div>
        )}
      </div>

      {/* Animated Bottom Border */}
      <div className="accent-border absolute bottom-0 left-0 h-[3px] bg-primary transition-all duration-400 ease-out"></div>
    </div>
  )
}

export default CodelanceTeamCard

