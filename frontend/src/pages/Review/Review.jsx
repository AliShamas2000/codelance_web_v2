import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import ReviewForm from '../../components/ReviewForm/ReviewForm'
import SuccessModal from '../../components/SuccessModal/SuccessModal'
import SuccessMessageModal from '../../components/SuccessMessageModal/SuccessMessageModal'
import reviewApi from '../../api/review'

const Review = () => {
  const { appointmentId } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [appointmentData, setAppointmentData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false)

  useEffect(() => {
    fetchAppointmentData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appointmentId])

  const fetchAppointmentData = async () => {
    setIsLoading(true)
    try {
      const id = appointmentId || searchParams.get('appointment_id')
      if (id) {
        const response = await reviewApi.getAppointmentForReview(id)
        if (response.success && response.data) {
          setAppointmentData(response.data)
        } else if (response.alreadyReviewed) {
          setErrorMessage('You have already submitted a review for this appointment.')
          setIsErrorModalOpen(true)
        } else {
          setErrorMessage('Appointment not found or invalid.')
          setIsErrorModalOpen(true)
        }
      } else {
        setErrorMessage('No appointment ID provided.')
        setIsErrorModalOpen(true)
      }
    } catch (error) {
      console.error('Error fetching appointment data:', error)
      const errorMsg = error.response?.data?.message || 'Failed to load appointment data. Please check the link and try again.'
      setErrorMessage(errorMsg)
      setIsErrorModalOpen(true)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (formData) => {
    setIsSubmitting(true)
    try {
      const response = await reviewApi.submitReview({
        appointment_id: appointmentId || searchParams.get('appointment_id'),
        rating: formData.rating,
        services: formData.services, // Changed to services array
        phone: formData.phone,
        feedback: formData.feedback,
        recommend: formData.recommend
      })
      
      if (response.success) {
        setIsSuccessModalOpen(true)
      } else {
        setErrorMessage(response.message || 'Failed to submit review. Please try again.')
        setIsErrorModalOpen(true)
      }
    } catch (error) {
      console.error('Error submitting review:', error)
      const errorMsg = error.response?.data?.message || 'Failed to submit review. Please try again.'
      if (error.response?.data?.alreadyReviewed) {
        setErrorMessage('You have already submitted a review for this appointment.')
      } else {
        setErrorMessage(errorMsg)
      }
      setIsErrorModalOpen(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCloseSuccessModal = () => {
    setIsSuccessModalOpen(false)
    navigate('/')
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background-light dark:bg-background-dark">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-500 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background-light dark:bg-background-dark text-[#111816] dark:text-gray-100 font-display transition-colors duration-300 antialiased selection:bg-primary selection:text-white">
      <div className="w-full max-w-lg mx-auto">
        <ReviewForm
          appointment={appointmentData}
          onSubmit={handleSubmit}
          isLoading={isSubmitting}
        />

        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/')}
            className="text-sm text-gray-500 hover:text-gray-800 dark:hover:text-gray-300 transition-colors"
          >
            ← Back to Blade Barbershop
          </button>
        </div>
      </div>

      {/* Success Modal */}
      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={handleCloseSuccessModal}
      />

      {/* Error Modal */}
      <SuccessMessageModal
        isOpen={isErrorModalOpen}
        onClose={() => {
          setIsErrorModalOpen(false)
          if (errorMessage.includes('already submitted')) {
            navigate('/')
          }
        }}
        title="Error"
        message={errorMessage}
      />
    </div>
  )
}

// Default data (fallback when API is not available)
const getDefaultAppointmentData = () => ({
  barberName: 'Alex',
  barberAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA23VfiVo4RC9FLZwS6xJhWLQ426hp2Vu-eMKnlKNN8d3iDnny3GjorYGBvaGuoPVbzEw9D53UqBjtF_KY9nDqGQ_V6JPvHAURR1LxP-aMDyBP3WoN23aoRQ6omLmugQGjqgu2cvjrv4Zr9L_GzK6nfmzGLQSoDRPTBXHiF2cOZ2TJtReuvRP4HJFIm5_OEva15qMTuYX7Ia7cROYPek1e0V-5Vyro0M08qu90SM_bXVeOiAVmq7pcpnp-0bqasneZ_q-rF0cdVjO4',
  date: '2023-10-24',
  services: [
    'Haircut & Beard Trim',
    'Skin Fade',
    'Buzz Cut',
    'Beard Sculpting',
    "Kid's Cut",
    'Hot Towel Shave'
  ]
})

export default Review
