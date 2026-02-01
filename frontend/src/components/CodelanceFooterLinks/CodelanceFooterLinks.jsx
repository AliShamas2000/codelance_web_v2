import React from 'react'
import useScrollReveal from '../../hooks/useScrollReveal'

const CodelanceFooterLinks = ({
  title,
  links = [],
  className = ""
}) => {
  const [isVisible, ref] = useScrollReveal({ threshold: 0.1 })

  return (
    <div 
      ref={ref}
      className={`transition-all duration-1000 ease-out delay-200 ${
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
      {links.length > 0 && (
        <ul className="flex flex-col gap-4">
          {links.map((link, index) => (
            <li key={index}>
              <a
                href={link.href || '#'}
                className="text-navy-deep/70 dark:text-white/60 hover:text-primary transition-colors text-sm hover-underline"
                onClick={(e) => {
                  if (link.href?.startsWith('#')) {
                    e.preventDefault()
                    const element = document.querySelector(link.href)
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' })
                    }
                  }
                }}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default CodelanceFooterLinks

