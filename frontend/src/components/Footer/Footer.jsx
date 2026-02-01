import React from 'react'
import FooterBrand from '../FooterBrand/FooterBrand'
import FooterLinks from '../FooterLinks/FooterLinks'
import FooterHours from '../FooterHours/FooterHours'
import FooterContact from '../FooterContact/FooterContact'
import FooterBottom from '../FooterBottom/FooterBottom'

const Footer = ({
  // Brand props
  brandProps = {},
  
  // Links props
  linksProps = {},
  
  // Hours props
  hoursProps = {},
  
  // Contact props
  contactProps = {},
  
  // Bottom props
  bottomProps = {},
  
  // Newsletter handler
  onNewsletterSubmit,
  
  // Styling
  className = ""
}) => {
  return (
    <footer className={`bg-white dark:bg-background-dark border-t border-[#dbe6e2] dark:border-white/10 pt-20 pb-10 mt-auto ${className}`}>
      <div className="w-full max-w-[1440px] mx-auto px-6 lg:px-10">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          {/* Column 1: Brand & About */}
          <FooterBrand {...brandProps} />

          {/* Column 2: Quick Links */}
          <FooterLinks {...linksProps} />

          {/* Column 3: Working Hours */}
          <FooterHours {...hoursProps} />

          {/* Column 4: Contact & Newsletter */}
          <FooterContact
            {...contactProps}
            onNewsletterSubmit={onNewsletterSubmit}
          />
        </div>

        {/* Sub-footer */}
        <FooterBottom {...bottomProps} />
      </div>
    </footer>
  )
}

export default Footer

