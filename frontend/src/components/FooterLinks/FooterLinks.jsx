import React from 'react'
import { Link } from 'react-router-dom'

const FooterLinks = ({
  title = "Explore",
  links = [],
  className = ""
}) => {
  const defaultLinks = [
    { label: "Services Menu", href: "#services", icon: "chevron_right" },
    { label: "Our Barbers", href: "#barbers", icon: "chevron_right" },
    { label: "Gallery", href: "/gallery", icon: "chevron_right" },
    { label: "Careers", href: "#careers", icon: "chevron_right" },
  ]

  const linkList = links.length > 0 ? links : defaultLinks

  return (
    <div className={`flex flex-col gap-6 ${className}`}>
      <h3 className="text-text-main dark:text-white font-bold text-base uppercase tracking-wider">
        {title}
      </h3>
      <ul className="flex flex-col gap-4">
        {linkList.map((link, index) => {
          const isHashLink = link.href.startsWith('#')
          const linkContent = (
            <>
              <span className="material-symbols-outlined text-[16px] opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300">
                {link.icon || "chevron_right"}
              </span>
              {link.label}
            </>
          )

          if (isHashLink) {
            return (
              <li key={index}>
                <a
                  href={link.href}
                  className="text-text-muted dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors text-sm font-medium flex items-center group"
                >
                  {linkContent}
                </a>
              </li>
            )
          }

          return (
            <li key={index}>
              <Link
                to={link.href}
                className="text-text-muted dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors text-sm font-medium flex items-center group"
              >
                {linkContent}
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default FooterLinks

