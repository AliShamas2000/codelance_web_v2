import React from 'react'

const TeamMemberCard = ({
  member,
  onEdit,
  onMoreActions,
  onViewDetails,
  className = ""
}) => {
  const getStatusBadge = (status) => {
    const statusConfig = {
      active: {
        bg: 'bg-green-100 dark:bg-green-900/30',
        text: 'text-green-700 dark:text-green-400',
        label: 'Active'
      },
      inactive: {
        bg: 'bg-gray-100 dark:bg-gray-700',
        text: 'text-gray-600 dark:text-gray-300',
        label: 'Inactive'
      },
      leave: {
        bg: 'bg-yellow-100 dark:bg-yellow-900/30',
        text: 'text-yellow-700 dark:text-yellow-400',
        label: 'On Leave'
      }
    }

    const config = statusConfig[status] || statusConfig.inactive

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    )
  }

  const getSocialLinkIcon = (platform) => {
    const icons = {
      instagram: 'photo_camera',
      facebook: 'facebook',
      twitter: 'alternate_email',
      linkedin: 'work',
      youtube: 'play_circle',
      tiktok: 'music_note',
    }
    return icons[platform] || 'link'
  }

  const getSocialLinkColor = (platform) => {
    const colors = {
      instagram: 'hover:text-pink-600',
      facebook: 'hover:text-blue-600',
      twitter: 'hover:text-blue-400',
      linkedin: 'hover:text-blue-700',
      youtube: 'hover:text-red-600',
      tiktok: 'hover:text-black dark:hover:text-white',
    }
    return colors[platform] || 'hover:text-gray-600'
  }

  const getInitials = (name) => {
    if (!name) return '??'
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const getAvatarColor = (name) => {
    if (!name) return 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
    const colors = [
      'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
      'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
      'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
      'bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400',
      'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400'
    ]
    const index = name.charCodeAt(0) % colors.length
    return colors[index]
  }

  const isInactive = member.status === 'inactive'
  const fullName = `${member.firstName || ''} ${member.lastName || ''}`.trim() || member.name || 'Unknown'
  const hasProfilePhoto = member.profilePhoto || member.avatar

  return (
    <div className={`bg-white dark:bg-card-dark rounded-xl shadow-soft border border-gray-100 dark:border-gray-700 p-6 flex flex-col items-center text-center relative group hover:shadow-lg transition-all duration-200 ${isInactive ? 'opacity-75 hover:opacity-100' : ''} ${className}`}>
      {/* Status Badge */}
      <div className="absolute top-4 right-4">
        {getStatusBadge(member.status)}
      </div>

      {/* Profile Image or Avatar */}
      <div className="relative mb-4 group/image">
        <div className={`h-24 w-24 rounded-full p-1 border-2 ${isInactive ? 'border-gray-200 dark:border-gray-600' : 'border-green-100 dark:border-green-900/50'} ${isInactive ? 'grayscale' : ''} relative overflow-hidden`}>
          {hasProfilePhoto ? (
            <>
              <img
                alt={fullName}
                className="h-full w-full rounded-full object-cover"
                src={member.profilePhoto || member.avatar}
                onError={(e) => {
                  // Hide image and show avatar on error
                  e.target.style.display = 'none'
                  const avatarDiv = e.target.parentElement.querySelector('.avatar-initials')
                  if (avatarDiv) {
                    avatarDiv.style.display = 'flex'
                  }
                }}
              />
              <div className={`h-full w-full rounded-full flex items-center justify-center font-bold text-2xl ${getAvatarColor(fullName)} avatar-initials absolute inset-0`} style={{ display: 'none' }}>
                {getInitials(fullName)}
              </div>
            </>
          ) : (
            <div className={`h-full w-full rounded-full flex items-center justify-center font-bold text-2xl ${getAvatarColor(fullName)}`}>
              {getInitials(fullName)}
            </div>
          )}
        </div>
        {member.isFeatured && (
          <div className="absolute bottom-0 right-1 w-6 h-6 bg-white dark:bg-card-dark rounded-full flex items-center justify-center border border-gray-100 dark:border-gray-600 shadow-sm">
            <span className="material-symbols-outlined text-xs text-yellow-500">star</span>
          </div>
        )}
      </div>

      {/* Name */}
      <h3 className="font-bold text-gray-900 dark:text-white text-lg">
        {fullName}
      </h3>

      {/* Job Title */}
      <p className="text-sm text-primary dark:text-gray-400 font-medium mb-1">
        {member.jobTitle || member.job_title || member.role || 'Team Member'}
      </p>

      {/* Bio */}
      {member.bio && (
        <p className="text-xs text-gray-500 mb-4 truncate max-w-[180px]">
          {member.bio}
        </p>
      )}

      {/* Social Links */}
      <div className="flex space-x-3 mb-6 justify-center flex-wrap gap-2">
        {member.socialLinks && Array.isArray(member.socialLinks) && member.socialLinks.length > 0 ? (
          member.socialLinks.map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-gray-400 ${getSocialLinkColor(link.platform)} transition-colors`}
              title={link.platform}
            >
              <span className="material-symbols-outlined text-lg">{getSocialLinkIcon(link.platform)}</span>
            </a>
          ))
        ) : (
          <>
            {member.email && (
              <a
                href={`mailto:${member.email}`}
                className="text-gray-400 hover:text-blue-500 transition-colors"
                title="Email"
              >
                <span className="material-symbols-outlined text-lg">email</span>
              </a>
            )}
            {member.phone && (
              <a
                href={`tel:${member.phone}`}
                className="text-gray-400 hover:text-blue-400 transition-colors"
                title="Phone"
              >
                <span className="material-symbols-outlined text-lg">phone</span>
              </a>
            )}
          </>
        )}
      </div>

      {/* Actions */}
      <div className="w-full border-t border-gray-100 dark:border-gray-700 pt-4 flex justify-center items-center">
        <button
          onClick={() => onEdit && onEdit(member)}
          className="text-xs font-medium text-primary hover:text-gray-600 dark:text-white dark:hover:text-gray-300 flex items-center"
        >
          <span className="material-symbols-outlined text-sm mr-1">edit</span>
          Edit
        </button>
      </div>
    </div>
  )
}

export default TeamMemberCard

