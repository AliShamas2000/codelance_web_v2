import React from 'react'
import useScrollReveal from '../../hooks/useScrollReveal'

const CodelanceFooterSocial = ({
  title = "Follow Us",
  socialLinks = [
    { icon: 'language', href: '#', label: 'Website' },
    { icon: 'terminal', href: '#', label: 'GitHub' },
    { icon: 'alternate_email', href: '#', label: 'Email' },
    { icon: 'camera', href: '#', label: 'Instagram' }
  ],
  className = ""
}) => {
  const [isVisible, ref] = useScrollReveal({ threshold: 0.1 })

  return (
    <div 
      ref={ref}
      className={`transition-all duration-1000 ease-out delay-300 ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-8'
      } ${className}`}
    >
      {title && (
        <h3 className="text-navy-deep dark:text-white font-bold text-base mb-6">
          {title}
        </h3>
      )}
      <div className="flex gap-5 text-navy-deep dark:text-white">
        {socialLinks.map((link, index) => (
          <a
            key={index}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon-hover"
            aria-label={link.label || link.icon}
          >
            <span className="material-symbols-outlined text-[28px]">{link.icon}</span>
          </a>
        ))}
      </div>
    </div>
  )
}

export default CodelanceFooterSocial

