/**
 * Route Configuration
 * 
 * Centralized route definitions for the application
 */

export const routes = {
  home: '/',
  about: '/about',
  services: '/services',
  pricing: '/pricing',
  barbers: '/barbers',
  gallery: '/gallery',
  contact: '/contact',
  booking: '/booking',
  admin: '/admin',
}

export const navigationItems = [
  { label: "Home", href: routes.home },
  { label: "About", href: `#about` },
  { label: "Services", href: `#services` },
  { label: "Barbers", href: `#barbers` },
  { label: "Gallery", href: `#gallery` },
  { label: "Contact", href: `#contact` },
]

