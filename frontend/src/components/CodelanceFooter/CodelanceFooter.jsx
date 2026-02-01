import React from 'react'
import CodelanceFooterIdentity from '../CodelanceFooterIdentity/CodelanceFooterIdentity'
import CodelanceFooterLinks from '../CodelanceFooterLinks/CodelanceFooterLinks'
import CodelanceFooterSocial from '../CodelanceFooterSocial/CodelanceFooterSocial'
import CodelanceFooterNewsletter from '../CodelanceFooterNewsletter/CodelanceFooterNewsletter'

const CodelanceFooter = ({
  logoUrl = null,
  brandName = "CODELANCE",
  description = "Empowering businesses through cutting-edge digital solutions and innovative engineering.",
  quickLinks = [
    { label: "Home", href: "/" },
    { label: "Services", href: "#services" },
    { label: "Portfolio", href: "#portfolio" },
    { label: "Packages", href: "#packages" },
    { label: "Contact", href: "#contact" }
  ],
  serviceLinks = [
    { label: "Web Development", href: "#services" },
    { label: "Mobile Apps", href: "#services" },
    { label: "AI Solutions", href: "#services" },
    { label: "Cloud Infrastructure", href: "#services" }
  ],
  socialLinks = [
    { icon: 'language', href: '#', label: 'Website' },
    { icon: 'terminal', href: '#', label: 'GitHub' },
    { icon: 'alternate_email', href: '#', label: 'Email' },
    { icon: 'camera', href: '#', label: 'Instagram' }
  ],
  legalLinks = [
    { label: "Privacy Policy", href: "#privacy" },
    { label: "Terms of Service", href: "#terms" },
    { label: "Cookies Settings", href: "#cookies" }
  ],
  copyright = `© ${new Date().getFullYear()} CODELANCE. All rights reserved.`,
  onNewsletterSubmit = null,
  className = ""
}) => {
  return (
    <footer className={`bg-background-light dark:bg-background-dark border-t border-navy-deep/10 dark:border-white/10 pt-20 pb-10 ${className}`}>
      <div className="max-w-[1400px] mx-auto px-6 lg:px-20">
        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-16 border-b border-navy-deep/5 dark:border-white/5">
          {/* Column 1: Identity */}
          <CodelanceFooterIdentity
            logoUrl={logoUrl}
            brandName={brandName}
            description={description}
          />

          {/* Column 2: Quick Links */}
          <CodelanceFooterLinks
            title="Quick Links"
            links={quickLinks}
          />

          {/* Column 3: Services Highlights */}
          <CodelanceFooterLinks
            title="Services"
            links={serviceLinks}
          />

          {/* Column 4: Connect */}
          <div>
            <CodelanceFooterSocial
              title="Follow Us"
              socialLinks={socialLinks}
            />
            <CodelanceFooterNewsletter
              title="Subscribe to our newsletter"
              placeholder="Email address"
              onSubmit={onNewsletterSubmit}
            />
          </div>
        </div>

        {/* Bottom Row: Copyright and Legal */}
        <div className="mt-10 flex flex-col md:flex-row justify-between items-center gap-6">
          {copyright && (
            <p className="text-navy-deep/50 dark:text-white/40 text-xs">
              {copyright}
            </p>
          )}
          {legalLinks.length > 0 && (
            <div className="flex gap-8">
              {legalLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="text-navy-deep/50 dark:text-white/40 text-xs hover:text-primary transition-colors"
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
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  )
}

export default CodelanceFooter
