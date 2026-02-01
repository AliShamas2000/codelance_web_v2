import React from 'react'

const LocationMapSection = ({
  mapEmbed = '',
  onMapEmbedChange,
  className = ""
}) => {
  // Extract iframe src from embed code if it's an iframe tag
  const getMapPreview = () => {
    if (!mapEmbed) return null
    
    // Check if it's an iframe tag
    if (mapEmbed.includes('<iframe')) {
      const srcMatch = mapEmbed.match(/src=["']([^"']+)["']/)
      return srcMatch ? srcMatch[1] : null
    }
    
    // Check if it's a Google Maps URL
    if (mapEmbed.includes('maps.google.com') || mapEmbed.includes('google.com/maps')) {
      return mapEmbed
    }
    
    return null
  }

  const previewUrl = getMapPreview()

  return (
    <div className={`bg-white dark:bg-card-dark rounded-xl shadow-soft border border-gray-100 dark:border-gray-700 p-6 ${className}`}>
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
        <span className="material-symbols-outlined text-gray-400 mr-2">map</span>
        Location Map
      </h2>
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Map Embed Code / URL
          </label>
          <textarea
            className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-2.5 text-xs focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none dark:text-white placeholder-gray-400 resize-none transition-colors font-mono"
            placeholder="<iframe src='...'></iframe> or https://maps.google.com..."
            rows="3"
            value={mapEmbed}
            onChange={(e) => onMapEmbedChange && onMapEmbedChange(e.target.value)}
          />
        </div>
        <div className="aspect-video w-full rounded-lg bg-gray-100 dark:bg-gray-800 overflow-hidden relative border border-gray-200 dark:border-gray-600">
          {previewUrl ? (
            <iframe
              src={previewUrl}
              className="w-full h-full"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
              <span className="material-symbols-outlined text-4xl mb-2">place</span>
              <span className="text-xs">Map Preview</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default LocationMapSection


