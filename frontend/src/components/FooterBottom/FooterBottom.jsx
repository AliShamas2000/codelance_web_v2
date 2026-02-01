import React from 'react'

const FooterBottom = ({
  copyright = "© 2024 Barber Studio. All rights reserved.",
  legalLinks = [],
  className = ""
}) => {
  const defaultLegalLinks = [
    { label: "Privacy Policy", href: "#privacy" },
    { label: "Terms of Service", href: "#terms" },
    { label: "Cookies", href: "#cookies" },
  ]

  const links = legalLinks.length > 0 ? legalLinks : defaultLegalLinks

  return (
    <div className={`pt-8 border-t border-gray-100 dark:border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 ${className}`}>
      <p className="text-text-muted dark:text-gray-500 text-sm font-normal text-center md:text-left">
        {copyright}
      </p>
      <div className="flex flex-wrap justify-center gap-6 md:gap-8">
        {links.map((link, index) => (
          <a
            key={index}
            href={link.href}
            className="text-text-muted dark:text-gray-500 hover:text-primary dark:hover:text-primary transition-colors text-sm"
          >
            {link.label}
          </a>
        ))}
      </div>
    </div>
  )
}

export default FooterBottom

