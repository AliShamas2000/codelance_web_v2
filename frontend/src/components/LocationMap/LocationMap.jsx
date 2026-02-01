import React from 'react'

const LocationMap = ({
  mapUrl,
  mapEmbedCode,
  className = ""
}) => {
  // If mapEmbedCode is provided, check if it's HTML or a URL
  if (mapEmbedCode) {
    // Check if it's an iframe HTML tag
    if (mapEmbedCode.includes('<iframe')) {
      return (
        <div className={`w-full h-full min-h-[500px] bg-slate-100 dark:bg-slate-800 relative ${className}`}>
          <div
            className="absolute inset-0 w-full h-full map-filter"
            dangerouslySetInnerHTML={{ __html: mapEmbedCode }}
          />
        </div>
      )
    }
    
    // If it's a URL, use it as iframe src
    return (
      <div className={`w-full h-full min-h-[500px] bg-slate-100 dark:bg-slate-800 relative ${className}`}>
        <iframe
          src={mapEmbedCode}
          className="absolute inset-0 w-full h-full map-filter"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Location Map"
        />
      </div>
    )
  }

  // If mapUrl is provided, use it
  if (mapUrl) {
    return (
      <div className={`w-full h-full min-h-[500px] bg-slate-100 dark:bg-slate-800 relative ${className}`}>
        <iframe
          src={mapUrl}
          className="absolute inset-0 w-full h-full map-filter"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Location Map"
        />
      </div>
    )
  }

  // Default Google Maps embed URL (fallback)
  const defaultMapUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.2219901290355!2d-74.00369368400567!3d40.71312937933185!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a23e28c1191%3A0x49f75d3281df052a!2s150%20Park%20Row%2C%20New%20York%2C%20NY%2010007!5e0!3m2!1sen!2sus!4v1517191463807"

  return (
    <div className={`w-full h-full min-h-[500px] bg-slate-100 dark:bg-slate-800 relative ${className}`}>
      <iframe
        src={defaultMapUrl}
        className="absolute inset-0 w-full h-full map-filter"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Location Map"
      />
    </div>
  )
}

export default LocationMap

