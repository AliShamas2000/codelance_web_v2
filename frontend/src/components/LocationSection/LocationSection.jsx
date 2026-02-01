import React from 'react'
import ContactInfoItem from '../ContactInfoItem/ContactInfoItem'
import LocationMap from '../LocationMap/LocationMap'

const LocationSection = ({
  // Header props
  badge = "Find Us",
  title = "Location & Contact",
  description = "Visit our studio for a consultation or book your appointment today. We're looking forward to seeing you.",
  
  // Contact info props
  address = {
    title: "Our Address",
    content: "123 Barber Street, Suite 101\nSoHo, New York, NY 10013"
  },
  phone = {
    title: "Phone",
    content: "(555) 123-4567",
    href: "tel:5551234567"
  },
  email = {
    title: "Email",
    content: "info@thestudio.com",
    href: "mailto:info@thestudio.com"
  },
  hours = {
    title: "Opening Hours",
    content: "Mon - Fri: 9am - 8pm\nSat: 10am - 6pm\nSun: Closed"
  },
  
  // Map props
  mapUrl,
  mapEmbedCode,
  
  // Loading state
  isLoading = false,
  
  // Styling
  className = ""
}) => {
  return (
    <section className={`mb-10 w-full bg-white dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm overflow-hidden flex flex-col lg:flex-row ${className}`}>
      {/* Left Column: Contact Information */}
      <div className="w-full lg:w-1/2 p-10 lg:p-14 flex flex-col justify-center">
        {/* Header */}
        <div className="mb-8">
          {badge && (
            <span className="inline-block text-primary font-bold text-xs uppercase tracking-widest mb-2">
              {badge}
            </span>
          )}
          {title && (
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              {title}
            </h2>
          )}
          {description && (
            <p className="text-slate-500 dark:text-slate-400">
              {description}
            </p>
          )}
        </div>

        {/* Contact Info Items */}
        <div className="space-y-6">
          {/* Address */}
          {address && (
            <ContactInfoItem
              icon="location_on"
              title={address.title}
              content={address.content}
            />
          )}

          {/* Phone */}
          {phone && (
            <ContactInfoItem
              icon="call"
              title={phone.title}
              content={phone.content}
              href={phone.href}
            />
          )}

          {/* Email */}
          {email && (
            <ContactInfoItem
              icon="mail"
              title={email.title}
              content={email.content}
              href={email.href}
            />
          )}

          {/* Hours */}
          {hours && (
            <ContactInfoItem
              icon="schedule"
              title={hours.title}
              content={hours.content}
            />
          )}
        </div>
      </div>

      {/* Right Column: Map */}
      <div className="w-full lg:w-1/2 flex items-stretch">
        {isLoading ? (
          <div className="w-full min-h-[400px] bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            <p className="text-slate-500 dark:text-slate-400">Loading map...</p>
          </div>
        ) : (
          <div className="w-full h-full flex-1">
            <LocationMap
              mapUrl={mapUrl}
              mapEmbedCode={mapEmbedCode}
            />
          </div>
        )}
      </div>
    </section>
  )
}

export default LocationSection

