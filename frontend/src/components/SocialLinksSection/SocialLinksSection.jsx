import React from 'react'

const SocialLinksSection = ({
  socialLinks = [],
  onAddLink,
  onUpdateLink,
  onRemoveLink,
  className = ""
}) => {
  const getSocialIcon = (platform) => {
    const iconMap = {
      instagram: 'camera_alt',
      facebook: 'facebook',
      twitter: 'alternate_email',
      youtube: 'play_circle',
      linkedin: 'work',
      tiktok: 'music_note',
      snapchat: 'camera',
      whatsapp: 'chat'
    }
    return iconMap[platform?.toLowerCase()] || 'public'
  }

  return (
    <div className={`bg-white dark:bg-card-dark rounded-xl shadow-soft border border-gray-100 dark:border-gray-700 p-6 ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
          <span className="material-symbols-outlined text-gray-400 mr-2">share</span>
          Social Links
        </h2>
        <button
          onClick={onAddLink}
          className="text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-2 py-1 rounded transition-colors"
        >
          + Add
        </button>
      </div>
      <div className="space-y-3">
        {socialLinks.map((link, index) => (
          <div key={link.id || index} className="flex items-center gap-2">
            <div className="w-10 h-10 flex-shrink-0 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400">
              <span className="material-symbols-outlined text-lg">
                {getSocialIcon(link.platform)}
              </span>
            </div>
            <input
              className="w-1/3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-primary focus:border-primary outline-none dark:text-white"
              placeholder="Platform"
              type="text"
              value={link.platform || ''}
              onChange={(e) => onUpdateLink && onUpdateLink(index, { ...link, platform: e.target.value })}
            />
            <input
              className="flex-1 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-primary focus:border-primary outline-none dark:text-white"
              placeholder="URL"
              type="text"
              value={link.url || ''}
              onChange={(e) => onUpdateLink && onUpdateLink(index, { ...link, url: e.target.value })}
            />
            <button
              onClick={() => onRemoveLink && onRemoveLink(index)}
              className="text-red-400 hover:text-red-500 transition-colors"
            >
              <span className="material-symbols-outlined text-lg">remove_circle_outline</span>
            </button>
          </div>
        ))}
        {socialLinks.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-4">No social links added yet</p>
        )}
      </div>
    </div>
  )
}

export default SocialLinksSection


