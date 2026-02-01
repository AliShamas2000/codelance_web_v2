import React from 'react'
import Modal from '../Modal/Modal'

const ViewTeamMemberModal = ({
  isOpen = false,
  onClose,
  member = null,
  onEdit,
  stats = null, // Stats data from backend
  upcomingAppointments = [], // Upcoming appointments from backend
  availability = null, // Availability data from backend
  isLoading = false, // Loading state
  className = ""
}) => {
  if (!member) return null

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: {
        bg: 'bg-green-50 dark:bg-green-900/30',
        text: 'text-green-700 dark:text-green-400',
        ring: 'ring-green-600/20',
        label: 'Active'
      },
      inactive: {
        bg: 'bg-gray-50 dark:bg-gray-700',
        text: 'text-gray-600 dark:text-gray-300',
        ring: 'ring-gray-600/20',
        label: 'Inactive'
      },
      leave: {
        bg: 'bg-yellow-50 dark:bg-yellow-900/30',
        text: 'text-yellow-700 dark:text-yellow-400',
        ring: 'ring-yellow-600/20',
        label: 'On Leave'
      }
    }

    const config = statusConfig[status] || statusConfig.inactive

    return (
      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${config.bg} ${config.text} ring-1 ring-inset ${config.ring}`}>
        {config.label}
      </span>
    )
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      })
    } catch (error) {
      return dateString
    }
  }

  const formatTime = (timeString) => {
    if (!timeString) return 'N/A'
    try {
      // Handle both "HH:MM" and "HH:MM:SS" formats
      const [hours, minutes] = timeString.split(':')
      const hour = parseInt(hours, 10)
      const ampm = hour >= 12 ? 'PM' : 'AM'
      const displayHour = hour % 12 || 12
      return `${displayHour}:${minutes} ${ampm}`
    } catch (error) {
      return timeString
    }
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

  const fullName = `${member.firstName || ''} ${member.lastName || ''}`.trim() || member.name || 'Unknown'
  const profilePhoto = member.profilePhoto || member.avatar
  const hasProfilePhoto = !!profilePhoto
  const rating = member.rating || stats?.averageRating || 0
  const totalAppointments = stats?.totalAppointments || member.totalAppointments || 0
  const satisfactionRate = stats?.satisfactionRate || member.satisfactionRate || 0
  const memberAvailability = availability || member.availability || null

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          Barber Overview
          {getStatusBadge(member.status || 'active')}
        </div>
      }
      titleIcon="person"
      maxWidth="max-w-3xl"
      footer={
        <>
          {onEdit && (
            <button
              type="button"
              onClick={() => {
                onEdit(member)
                onClose()
              }}
              className="inline-flex justify-center items-center rounded-lg bg-black dark:bg-white dark:text-black px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
            >
              <span className="material-symbols-outlined text-sm mr-2">edit</span>
              Edit Barber
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="inline-flex justify-center items-center rounded-lg bg-white dark:bg-transparent px-5 py-2.5 text-sm font-semibold text-gray-900 dark:text-gray-300 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Close Overview
          </button>
        </>
      }
      className={className}
    >
      <div className="p-6 md:p-8 space-y-8 bg-white dark:bg-card-dark">
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Loading details...</p>
            </div>
          </div>
        )}
        {!isLoading && (
          <>
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* Profile Photo or Avatar */}
          <div className="shrink-0 relative">
            <div className="h-28 w-28 rounded-2xl overflow-hidden shadow-md ring-4 ring-white dark:ring-gray-700">
              {hasProfilePhoto ? (
                <img
                  alt={fullName}
                  className="h-full w-full object-cover"
                  src={profilePhoto}
                  onError={(e) => {
                    // Fallback to avatar if image fails to load
                    e.target.style.display = 'none'
                    const avatarDiv = e.target.parentElement.querySelector('.avatar-initials')
                    if (avatarDiv) {
                      avatarDiv.style.display = 'flex'
                    }
                  }}
                />
              ) : null}
              {!hasProfilePhoto && (
                <div className={`h-full w-full flex items-center justify-center font-bold text-3xl ${getAvatarColor(fullName)} avatar-initials`}>
                  {getInitials(fullName)}
                </div>
              )}
            </div>
            {rating > 0 && (
              <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-white rounded-lg px-2 py-1 shadow-sm flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">star</span>
                <span className="text-xs font-bold text-black">{rating.toFixed(1)}</span>
              </div>
            )}
          </div>

          {/* Name and Contact Info */}
          <div className="flex-1 space-y-2">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {fullName}
              </h2>
              <p className="text-primary dark:text-gray-300 font-medium">
                {member.jobTitle || member.role || 'Barber'}
              </p>
            </div>
            <div className="flex flex-wrap gap-3 pt-1">
              {member.email && (
                <a
                  href={`mailto:${member.email}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 dark:bg-gray-800 text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <span className="material-symbols-outlined text-sm text-gray-400">email</span>
                  {member.email}
                </a>
              )}
              {member.phone && (
                <a
                  href={`tel:${member.phone}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 dark:bg-gray-800 text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <span className="material-symbols-outlined text-sm text-gray-400">phone</span>
                  {member.phone}
                </a>
              )}
              {/* Social Media Links */}
              {member.socialLinks && Array.isArray(member.socialLinks) && member.socialLinks.length > 0 ? (
                member.socialLinks.map((link, index) => {
                  const platformIcons = {
                    instagram: 'photo_camera',
                    facebook: 'facebook',
                    twitter: 'alternate_email',
                    linkedin: 'work',
                    youtube: 'play_circle',
                    tiktok: 'music_note',
                  }
                  const platformColors = {
                    instagram: 'bg-pink-50 dark:bg-pink-900/10 text-pink-600 dark:text-pink-400 hover:bg-pink-100 dark:hover:bg-pink-900/20',
                    facebook: 'bg-blue-50 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/20',
                    twitter: 'bg-sky-50 dark:bg-sky-900/10 text-sky-600 dark:text-sky-400 hover:bg-sky-100 dark:hover:bg-sky-900/20',
                    linkedin: 'bg-blue-50 dark:bg-blue-900/10 text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/20',
                    youtube: 'bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/20',
                    tiktok: 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',
                  }
                  const icon = platformIcons[link.platform] || 'link'
                  const displayName = link.platform.charAt(0).toUpperCase() + link.platform.slice(1)
                  const colorClass = platformColors[link.platform] || 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  
                  return (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${colorClass} text-xs font-medium transition-colors`}
                      title={displayName}
                    >
                      <span className="material-symbols-outlined text-sm">{icon}</span>
                      {displayName}
                    </a>
                  )
                })
              ) : (
                member.instagramHandle && (
                  <a
                    href={member.instagramHandle.startsWith('@') 
                      ? `https://instagram.com/${member.instagramHandle.slice(1)}` 
                      : member.instagramHandle.startsWith('http') 
                      ? member.instagramHandle 
                      : `https://instagram.com/${member.instagramHandle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-pink-50 dark:bg-pink-900/10 text-xs font-medium text-pink-600 dark:text-pink-400 hover:bg-pink-100 dark:hover:bg-pink-900/20 transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">photo_camera</span>
                    {member.instagramHandle.startsWith('@') 
                      ? member.instagramHandle 
                      : member.instagramHandle.startsWith('http') 
                      ? member.instagramHandle.split('/').pop() 
                      : `@${member.instagramHandle}`}
                  </a>
                )
              )}
            </div>
          </div>

          {/* Edit Button */}
          {onEdit && (
            <div className="w-full md:w-auto flex md:flex-col gap-2">
              <button
                onClick={() => {
                  onEdit(member)
                  onClose()
                }}
                className="flex-1 w-full inline-flex justify-center items-center rounded-lg bg-black dark:bg-white dark:text-black px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
              >
                <span className="material-symbols-outlined text-sm mr-2">edit</span>
                Edit Barber
              </button>
            </div>
          )}
        </div>

        {/* Stats and Appointments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column: Stats and Appointments */}
          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Total Appointments Card */}
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                  <span className="material-symbols-outlined text-xl">event_available</span>
                </div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Total Appointments
                </h4>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white pl-1">
                {totalAppointments.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 pl-1 mt-1">
                Completed across all time
              </p>
            </div>

            {/* Client Satisfaction Card */}
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
                  <span className="material-symbols-outlined text-xl">thumb_up</span>
                </div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Client Satisfaction
                </h4>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white pl-1">
                {satisfactionRate}%
              </p>
              <p className="text-xs text-gray-500 pl-1 mt-1">
                Based on last 50 reviews
              </p>
            </div>

            {/* Upcoming Appointments */}
            <div className="col-span-1 sm:col-span-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80 flex justify-between items-center">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Upcoming Appointments
                </h4>
                <a
                  href="#"
                  className="text-xs font-medium text-primary dark:text-blue-400 hover:underline"
                  onClick={(e) => {
                    e.preventDefault()
                    // TODO: Navigate to appointments page filtered by this barber
                  }}
                >
                  View All
                </a>
              </div>
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {upcomingAppointments.length > 0 ? (
                  upcomingAppointments.slice(0, 3).map((appointment, index) => (
                    <div
                      key={appointment.id || index}
                      className="px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300">
                          {getInitials(appointment.clientName || appointment.client_name)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {appointment.clientName || appointment.client_name || 'Unknown Client'}
                          </p>
                          <p className="text-xs text-gray-500">
                            {appointment.serviceName || appointment.service_name || appointment.service || 'Service'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {formatTime(appointment.appointmentTime || appointment.time)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDate(appointment.appointmentDate || appointment.date)}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-6 text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No upcoming appointments
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Availability */}
          <div className="bg-gray-50 dark:bg-gray-800/30 rounded-xl p-5 border border-gray-100 dark:border-gray-700 h-full">
            <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-gray-400">schedule</span>
              Availability Snapshot
            </h4>
            <div className="space-y-4">
              {/* Standard Hours */}
              {memberAvailability?.standardHours && (
                <div className="pb-3 border-b border-gray-200 dark:border-gray-700 border-dashed">
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                    Standard Hours
                  </p>
                  {memberAvailability.standardHours.map((schedule, index) => (
                    <div key={index} className="flex justify-between items-center text-sm mb-1">
                      <span className="text-gray-700 dark:text-gray-300">
                        {schedule.days || schedule.day}
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {schedule.startTime || schedule.start} - {schedule.endTime || schedule.end}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Upcoming Time Off */}
              {memberAvailability?.timeOff && memberAvailability.timeOff.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                    Upcoming Time Off
                  </p>
                  {memberAvailability.timeOff.slice(0, 1).map((timeOff, index) => (
                    <div
                      key={index}
                      className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-red-100 dark:border-red-900/30 shadow-sm"
                    >
                      <div className="flex items-start gap-2">
                        <span className="material-symbols-outlined text-red-400 text-sm mt-0.5">
                          block
                        </span>
                        <div>
                          <p className="text-xs font-bold text-gray-900 dark:text-white">
                            {timeOff.reason || timeOff.type || 'Time Off'}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDate(timeOff.startDate || timeOff.start)} - {formatDate(timeOff.endDate || timeOff.end)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Manage Schedule Button */}
              <div className="pt-2">
                <button
                  className="w-full py-2 text-xs font-semibold text-primary dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-white dark:hover:bg-gray-700 transition-colors"
                  onClick={() => {
                    // TODO: Navigate to availability management
                    console.log('Manage schedule clicked')
                  }}
                >
                  Manage Schedule
                </button>
              </div>
            </div>
          </div>
        </div>
          </>
        )}
      </div>
    </Modal>
  )
}

export default ViewTeamMemberModal
