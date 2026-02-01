import React from 'react'

const BarberCard = ({
  id,
  name,
  role,
  imageUrl,
  imageAlt,
  socialLinks = [],
  phone,
  onClick,
  className = ""
}) => {
  return (
    <div
      onClick={onClick}
      className={`group relative flex flex-col ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {/* Image Container */}
      <div className="relative w-full aspect-[3/4] overflow-hidden rounded-2xl bg-gray-200 dark:bg-surface-dark shadow-sm group-hover:shadow-lg transition-shadow duration-300">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center card-zoom-image"
          style={{
            backgroundImage: imageUrl ? `url(${imageUrl})` : 'none'
          }}
          aria-label={imageAlt || name}
        />

        {/* Dark Gradient Overlay for text readability on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Social Icons & Phone (Appear on Hover) */}
        {(socialLinks.length > 0 || phone) && (
          <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 flex justify-center gap-4">
            {/* Phone Number */}
            {phone && (
              <a
                href={`tel:${phone}`}
                aria-label={`Call ${name}`}
                className="h-10 w-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-primary hover:border-primary hover:text-white transition-all duration-200"
                title={`Call ${phone}`}
              >
                <span className="material-symbols-outlined text-[20px]">phone</span>
              </a>
            )}
            {/* Social Links */}
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.href}
                target={social.target || '_blank'}
                rel={social.rel || 'noopener noreferrer'}
                aria-label={social.label || social.platform}
                className="h-10 w-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-primary hover:border-primary hover:text-white transition-all duration-200"
              >
                {social.icon === 'instagram' && (
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.36-.201 6.78-2.618 6.98-6.98.058-1.28.072-1.689.072-4.948 0-3.259-.014-3.667-.072-4.947-.2-4.361-2.617-6.78-6.98-6.98-1.281-.059-1.689-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path>
                  </svg>
                )}
                {social.icon === 'twitter' && (
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                  </svg>
                )}
                {social.icon === 'facebook' && (
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                )}
                {social.icon === 'linkedin' && (
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                )}
                {social.icon === 'youtube' && (
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                )}
                {social.icon === 'tiktok' && (
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                )}
                {social.icon === 'email' && (
                  <span className="material-symbols-outlined text-[20px]">mail</span>
                )}
                {social.icon === 'calendar' && (
                  <span className="material-symbols-outlined text-[20px]">calendar_month</span>
                )}
                {social.customIcon && (
                  <span className="material-symbols-outlined text-[20px]">{social.customIcon}</span>
                )}
                {!['instagram', 'twitter', 'facebook', 'linkedin', 'youtube', 'tiktok', 'email', 'calendar'].includes(social.icon) && !social.customIcon && (
                  <span className="material-symbols-outlined text-[20px]">link</span>
                )}
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="mt-5 flex flex-col items-center">
        <h3 className="text-xl font-bold text-[#111816] dark:text-white group-hover:text-primary transition-colors">
          {name}
        </h3>
        {role && (
          <p className="text-primary font-medium text-sm mt-1 uppercase tracking-wide">
            {role}
          </p>
        )}
      </div>
    </div>
  )
}

export default BarberCard

