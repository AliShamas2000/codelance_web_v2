import React from 'react'

const FooterBrand = ({
  logoIcon = "content_cut",
  logoUrl = null,
  brandName = "Barber Studio",
  description = "Premium cuts for the modern gentleman. We combine traditional techniques with modern style to give you the best look.",
  socialLinks = [],
  className = ""
}) => {
  const defaultSocialLinks = [
    { icon: "public", href: "#", label: "Website" },
    { icon: "thumb_up", href: "#", label: "Facebook" },
    { icon: "share", href: "#", label: "Share" },
  ]

  const socials = socialLinks.length > 0 ? socialLinks : defaultSocialLinks

  return (
    <div className={`flex flex-col gap-6 ${className}`}>
      {/* Brand Logo & Name */}
      <div className="flex items-center gap-2">
        {logoUrl ? (
          <img
            src={logoUrl}
            alt={brandName}
            className="h-10 w-auto object-contain"
          />
        ) : (
          <div className="bg-primary/20 p-2 rounded-lg">
            <span className="material-symbols-outlined text-primary text-2xl">
              {logoIcon}
            </span>
          </div>
        )}
        <span className="text-xl font-bold tracking-tight text-text-main dark:text-white">
          {brandName}
        </span>
      </div>

      {/* Description */}
      {description && (
        <p className="text-text-muted dark:text-gray-400 text-sm leading-relaxed">
          {description}
        </p>
      )}

      {/* Social Icons */}
      <div className="flex gap-4 mt-2">
        {socials.map((social, index) => (
          <a
            key={index}
            href={social.href}
            className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-white/5 text-text-muted hover:bg-primary hover:text-white dark:hover:bg-primary transition-all duration-300 group"
            aria-label={social.label || social.icon}
          >
            <span className="material-symbols-outlined text-xl group-hover:scale-110 transition-transform">
              {social.icon}
            </span>
          </a>
        ))}
      </div>
    </div>
  )
}

export default FooterBrand

