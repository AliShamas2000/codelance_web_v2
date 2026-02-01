import React, { useState, useEffect } from 'react'
import Modal from '../Modal/Modal'

const ViewDetailsModal = ({
  isOpen = false,
  onClose,
  appointment = null,
  className = ""
}) => {
  if (!appointment) return null

  // Parse appointment details
  const clientName = appointment.clientName || 'Client'
  const clientInitials = appointment.clientInitials || clientName.charAt(0)
  const clientAvatar = appointment.clientAvatar
  const clientType = appointment.clientType || 'Client'
  const status = appointment.status || 'pending'
  const appointmentId = appointment.id || ''
  // Get phone and email - check multiple possible field names and ensure they're not empty strings
  const phone = (appointment.phone || appointment.clientPhone || '').trim() || null
  const email = (appointment.email || appointment.clientEmail || '').trim() || null
  
  // Debug: Log appointment data to console
  if (process.env.NODE_ENV === 'development') {
    console.log('ViewDetailsModal - Appointment data:', {
      id: appointment.id,
      phone: appointment.phone,
      email: appointment.email,
      allFields: Object.keys(appointment)
    })
  }
  const service = appointment.service || ''
  const barberName = appointment.barberName || ''
  const dateTime = appointment.dateTime || ''
  const notes = appointment.notes || 'No notes provided.'
  const [reviewLink, setReviewLink] = useState('')
  const [isCopied, setIsCopied] = useState(false)

  // Generate review link for completed appointments
  useEffect(() => {
    if (status === 'completed' && appointmentId) {
      // Hash the appointment ID to match backend
      const hashAppointmentId = async (id) => {
        // Use SHA-256 hash - must match backend ReviewController::hashAppointmentId
        // Backend uses: env('REVIEW_SECRET_KEY', 'default-secret-key')
        const secret = import.meta.env.VITE_REVIEW_SECRET_KEY || 'default-secret-key'
        const encoder = new TextEncoder()
        const data = encoder.encode(id.toString() + secret)
        const hashBuffer = await crypto.subtle.digest('SHA-256', data)
        const hashArray = Array.from(new Uint8Array(hashBuffer))
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
      }
      
      hashAppointmentId(appointmentId).then(hash => {
        const baseUrl = window.location.origin
        setReviewLink(`${baseUrl}/review/${hash}`)
      }).catch(error => {
        console.error('Error generating review link:', error)
      })
    }
  }, [status, appointmentId])

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(reviewLink)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy link:', error)
    }
  }

  // Parse date and time
  let displayDate = ''
  let displayTime = ''
  
  if (dateTime) {
    const parts = dateTime.split(',')
    if (parts.length >= 2) {
      displayDate = parts[0].trim()
      displayTime = parts[1].trim()
    } else {
      displayDate = dateTime
    }
  }

  // Status badge config
  const statusConfig = {
    pending: {
      bg: "bg-yellow-100 dark:bg-yellow-900/40",
      text: "text-yellow-800 dark:text-yellow-300",
      border: "border-yellow-200 dark:border-yellow-800",
      dot: "bg-yellow-500",
      label: "Pending"
    },
    accepted: {
      bg: "bg-blue-100 dark:bg-blue-900/40",
      text: "text-blue-800 dark:text-blue-300",
      border: "border-blue-200 dark:border-blue-800",
      dot: "bg-blue-500",
      label: "Accepted"
    },
    rejected: {
      bg: "bg-red-100 dark:bg-red-900/40",
      text: "text-red-800 dark:text-red-300",
      border: "border-red-200 dark:border-red-800",
      dot: "bg-red-500",
      label: "Rejected"
    },
    completed: {
      bg: "bg-green-100 dark:bg-green-900/40",
      text: "text-green-800 dark:text-green-300",
      border: "border-green-200 dark:border-green-800",
      dot: "bg-green-500",
      label: "Completed"
    }
  }

  const statusStyle = statusConfig[status] || statusConfig.pending

  // Client type badge color
  const getClientTypeColor = () => {
    switch (clientType) {
      case "VIP Client":
        return "bg-orange-100 text-orange-600 dark:bg-orange-900/40 dark:text-orange-300"
      case "Regular":
        return "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300"
      case "Returning":
        return "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
      default:
        return "bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-300"
    }
  }

  const footerContent = (
    <div className="flex flex-col sm:flex-row-reverse sm:items-center gap-3">
      <button
        onClick={onClose}
        type="button"
        className="w-full sm:w-auto inline-flex justify-center rounded-xl border border-transparent shadow-sm px-6 py-2.5 bg-primary dark:bg-white text-sm font-semibold text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all transform hover:-translate-y-0.5"
      >
        Close
      </button>
    </div>
  )

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Appointment Details"
      maxWidth="max-w-3xl"
      footer={footerContent}
      className={className}
    >
      <div>
        {/* Client Info Section */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center space-x-4">
            {clientAvatar ? (
              <img
                alt={clientName}
                className="h-16 w-16 rounded-full object-cover shadow-sm ring-4 ring-white dark:ring-gray-700"
                src={clientAvatar}
              />
            ) : (
              <div className="h-16 w-16 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xl font-bold shadow-sm ring-4 ring-white dark:ring-gray-700">
                {clientInitials}
              </div>
            )}
            <div>
              <h4 className="text-xl font-bold text-gray-900 dark:text-white">{clientName}</h4>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getClientTypeColor()}`}>
                  {clientType}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusStyle.bg} ${statusStyle.text} border ${statusStyle.border}`}>
              <span className={`w-2 h-2 mr-2 ${statusStyle.dot} rounded-full`}></span>
              {statusStyle.label}
            </span>
            <span className="text-xs text-gray-400 mt-2">#{appointmentId}</span>
          </div>
        </div>

        {/* Contact Information - Always show phone if available */}
        {phone && (
          <div className="mb-8">
            <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700 flex items-center space-x-3 transition-colors hover:border-gray-200 dark:hover:border-gray-600">
              <div className="p-2 bg-white dark:bg-gray-700 rounded-lg shadow-sm text-gray-500 dark:text-gray-300">
                <span className="material-symbols-outlined text-lg">phone</span>
              </div>
              <div className="overflow-hidden">
                <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wide font-bold">Phone</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate" title={phone}>{phone}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Email - Only show if appointment is not completed */}
        {status !== 'completed' && email && (
          <div className="mb-8">
            <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700 flex items-center space-x-3 transition-colors hover:border-gray-200 dark:hover:border-gray-600">
              <div className="p-2 bg-white dark:bg-gray-700 rounded-lg shadow-sm text-gray-500 dark:text-gray-300">
                <span className="material-symbols-outlined text-lg">mail</span>
              </div>
              <div className="overflow-hidden">
                <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wide font-bold">Email</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate" title={email}>
                  {email}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Booking Information */}
        <div className="mb-8">
          <h5 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3 ml-1">
            Booking Information
          </h5>
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm">
            {/* Top Row: Service & Barber */}
            <div className="grid grid-cols-2 divide-x divide-gray-200 dark:divide-gray-700 border-b border-gray-200 dark:border-gray-700">
              <div className="p-4">
                <div className="flex items-center space-x-2 text-gray-400 dark:text-gray-500 mb-1.5">
                  <span className="material-symbols-outlined text-sm">content_cut</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider">Service</span>
                </div>
                <p className="font-semibold text-gray-900 dark:text-white text-sm">{service}</p>
              </div>
              <div className="p-4">
                <div className="flex items-center space-x-2 text-gray-400 dark:text-gray-500 mb-1.5">
                  <span className="material-symbols-outlined text-sm">person</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider">Barber</span>
                </div>
                <p className="font-semibold text-gray-900 dark:text-white text-sm">{barberName}</p>
              </div>
            </div>
            {/* Bottom Row: Date & Time */}
            <div className="grid grid-cols-2 divide-x divide-gray-200 dark:divide-gray-700">
              <div className="p-4">
                <div className="flex items-center space-x-2 text-gray-400 dark:text-gray-500 mb-1.5">
                  <span className="material-symbols-outlined text-sm">event</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider">Date</span>
                </div>
                <p className="font-semibold text-gray-900 dark:text-white text-sm">{displayDate || 'N/A'}</p>
              </div>
              <div className="p-4">
                <div className="flex items-center space-x-2 text-gray-400 dark:text-gray-500 mb-1.5">
                  <span className="material-symbols-outlined text-sm">schedule</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider">Time</span>
                </div>
                <p className="font-semibold text-gray-900 dark:text-white text-sm">{displayTime || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Notes */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-3 ml-1">
            <span className="material-symbols-outlined text-gray-400 text-base">sticky_note_2</span>
            <h5 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">Customer Notes</h5>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/10 p-5 rounded-xl border border-yellow-100 dark:border-yellow-900/30 text-sm text-gray-700 dark:text-gray-300 italic leading-relaxed relative">
            <span className="absolute top-3 left-3 text-yellow-300 dark:text-yellow-800/50 text-4xl font-serif opacity-50 select-none">"</span>
            <p className="relative z-10 pl-2">{notes}</p>
          </div>
        </div>

        {/* Review Link Section - Only for completed appointments */}
        {status === 'completed' && reviewLink && (
          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-3 ml-1">
              <span className="material-symbols-outlined text-gray-400 text-base">rate_review</span>
              <h5 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">Review Link</h5>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-900/30">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={reviewLink}
                  readOnly
                  className="flex-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <button
                  onClick={handleCopyLink}
                  className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2 whitespace-nowrap"
                >
                  {isCopied ? (
                    <>
                      <span className="material-symbols-outlined text-base">check</span>
                      Copied!
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-base">content_copy</span>
                      Copy
                    </>
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Share this link with the client to collect their review
              </p>
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}

export default ViewDetailsModal
