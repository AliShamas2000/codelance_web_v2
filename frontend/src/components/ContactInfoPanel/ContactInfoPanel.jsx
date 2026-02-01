import React from 'react'

const ContactInfoPanel = ({
  title = "Premium Experience",
  description = "Relax in our modern studio while our master stylists take care of your look.",
  address = {
    title: "Our Studio",
    line1: "123 Fashion Ave, Suite 101",
    line2: "New York, NY 10012"
  },
  contact = {
    title: "Contact Us",
    phone: "+1 (555) 000-0000",
    email: "hello@luxecuts.com"
  },
  backgroundImage = "https://lh3.googleusercontent.com/aida-public/AB6AXuDXwVDUSqlw7Vb5Sa_-0WjrAo6k-FcSS2ODvDMFV4L4WRk50U-iV3JEniAxUca42AuYDHqGXjDhJK5XyPU9aM60OBgXjuw1z51u9Y7zakkOLwVcNc6jO0DSio3Mf7EUJfWewS_NMExrnhQcCetgpYc703KzknU_8I1aHej898uXcK6vEp84XLASKKuYFdEKiBtQkhncHRMkuKXpMX-eMxm28-jyp2u2YGFzL2UplucYhFih8ctfshY_RaA3WjVKQcqqZVX1wwIBkzg",
  showSecurityBadge = true,
  className = ""
}) => {
  return (
    <div className={`hidden lg:flex lg:col-span-4 bg-background-dark text-white p-8 flex-col justify-between relative overflow-hidden ${className}`}>
      {/* Background Image Overlay */}
      <div className="absolute inset-0 z-0">
        {backgroundImage && (
          <img
            alt="Barber tools on dark background"
            className="w-full h-full object-cover opacity-20 mix-blend-overlay"
            src={backgroundImage}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-background-dark/80 to-background-dark/95"></div>
      </div>

      {/* Top Content */}
      <div className="relative z-10">
        {title && (
          <h3 className="text-2xl font-bold mb-2">{title}</h3>
        )}
        {description && (
          <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
        )}
      </div>

      {/* Contact Information */}
      <div className="relative z-10 space-y-6">
        {/* Address */}
        {address && (
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0 text-primary">
              <span className="material-symbols-outlined text-xl">location_on</span>
            </div>
            <div>
              <p className="font-medium text-sm">{address.title || "Our Studio"}</p>
              <p className="text-gray-400 text-xs mt-1">
                {address.line1}
                {address.line2 && (
                  <>
                    <br />
                    {address.line2}
                  </>
                )}
              </p>
            </div>
          </div>
        )}

        {/* Contact */}
        {contact && (
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0 text-primary">
              <span className="material-symbols-outlined text-xl">phone</span>
            </div>
            <div>
              <p className="font-medium text-sm">{contact.title || "Contact Us"}</p>
              <p className="text-gray-400 text-xs mt-1">
                {contact.phone}
                {contact.email && (
                  <>
                    <br />
                    {contact.email}
                  </>
                )}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Security Badge */}
      {showSecurityBadge && (
        <div className="relative z-10 mt-12">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="material-symbols-outlined text-base">verified_user</span>
            <span>Secure Booking</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default ContactInfoPanel

