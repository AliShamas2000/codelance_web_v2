import React, { useState, useEffect } from 'react'
import ReviewsHeader from '../../../components/ReviewsHeader/ReviewsHeader'
import ReviewStatsCards from '../../../components/ReviewStatsCards/ReviewStatsCards'
import ReviewsFilters from '../../../components/ReviewsFilters/ReviewsFilters'
import ReviewCard from '../../../components/ReviewCard/ReviewCard'
import ReviewsPagination from '../../../components/ReviewsPagination/ReviewsPagination'
import DeleteReviewModal from '../../../components/DeleteReviewModal/DeleteReviewModal'
import SuccessMessageModal from '../../../components/SuccessMessageModal/SuccessMessageModal'
import barberApi from '../../../api/barber'
import { useBarberUserContext } from '../../../contexts/BarberUserContext'

const Reviews = () => {
  const [reviews, setReviews] = useState([])
  const [stats, setStats] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: '',
    rating: 'all',
    sortBy: 'newest'
  })
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  })
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedReview, setSelectedReview] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const { user } = useBarberUserContext()

  useEffect(() => {
    fetchReviews()
    fetchStats()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.search, filters.rating, filters.sortBy, pagination.currentPage])

  const fetchReviews = async () => {
    setIsLoading(true)
    try {
      const data = await barberApi.getReviews({
        page: pagination.currentPage,
        per_page: pagination.itemsPerPage,
        search: filters.search,
        rating: filters.rating,
        sort_by: filters.sortBy
      })
      if (data.success && data.data) {
        setReviews(data.data || [])
        if (data.pagination) {
          setPagination(prev => ({
            ...prev,
            totalPages: data.pagination.total_pages || data.pagination.totalPages || 1,
            totalItems: data.pagination.total || data.pagination.totalItems || 0
          }))
        }
      } else {
        setReviews([])
      }
    } catch (error) {
      console.error('Error fetching reviews:', error)
      setReviews([])
    } finally {
      setIsLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await barberApi.getReviewStats()
      if (response.success && response.data) {
        setStats(response.data)
      } else {
        setStats({
          averageRating: 0,
          totalReviews: 0,
          positiveFeedback: 0
        })
      }
    } catch (error) {
      console.error('Error fetching review stats:', error)
      setStats({
        averageRating: 0,
        totalReviews: 0,
        positiveFeedback: 0
      })
    }
  }

  const handleSearchChange = (value) => {
    setFilters(prev => ({ ...prev, search: value }))
    setPagination(prev => ({ ...prev, currentPage: 1 }))
  }

  const handleRatingChange = (value) => {
    setFilters(prev => ({ ...prev, rating: value }))
    setPagination(prev => ({ ...prev, currentPage: 1 }))
  }

  const handleSortChange = (value) => {
    setFilters(prev => ({ ...prev, sortBy: value }))
    setPagination(prev => ({ ...prev, currentPage: 1 }))
  }


  const handleExportCSV = async () => {
    try {
      await barberApi.exportReviewsCSV({
        rating: filters.rating,
        sort_by: filters.sortBy
      })
      // You can add a success notification here
    } catch (error) {
      console.error('Error exporting CSV:', error)
      alert('Failed to export CSV. Please try again.')
    }
  }

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, currentPage: page }))
  }

  const handleDeleteClick = (review) => {
    setSelectedReview(review)
    setDeleteModalOpen(true)
  }

  const handleDeleteConfirm = async (reviewId, review) => {
    setIsDeleting(true)
    try {
      await barberApi.deleteReview(reviewId)
      setSuccessMessage('Review deleted successfully')
      setIsSuccessModalOpen(true)
      setDeleteModalOpen(false)
      setSelectedReview(null)
      // Refresh reviews and stats
      await fetchReviews()
      await fetchStats()
    } catch (error) {
      console.error('Error deleting review:', error)
      const errorMessage = error.response?.data?.message || 'Failed to delete review. Please try again.'
      alert(errorMessage)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleCloseDeleteModal = () => {
    if (!isDeleting) {
      setDeleteModalOpen(false)
      setSelectedReview(null)
    }
  }

  const reviewsData = reviews
  const statsData = stats || {
    averageRating: 0,
    totalReviews: 0,
    positiveFeedback: 0
  }

  return (
    <>
      <main className="flex-grow p-6 lg:p-10 overflow-y-auto h-screen lg:ml-64 w-full">
          <div className="mx-auto max-w-6xl relative">
            {isLoading && reviews.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center bg-background-light/80 dark:bg-background-dark/80 z-10 rounded-lg">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-gray-500 dark:text-gray-400">Loading reviews...</p>
                </div>
              </div>
            )}
            <ReviewsHeader onExportCSV={handleExportCSV} />

            <ReviewStatsCards stats={statsData} />

            <ReviewsFilters
              filters={filters}
              onSearchChange={handleSearchChange}
              onRatingChange={handleRatingChange}
              onSortChange={handleSortChange}
            />

            <div className="grid grid-cols-1 gap-6">
              {reviewsData.length === 0 ? (
                <div className="bg-surface-light dark:bg-surface-dark p-12 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 text-center">
                  <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-700 mb-4">star</span>
                  <p className="text-gray-500 dark:text-gray-400">No reviews found</p>
                </div>
              ) : (
                reviewsData.map((review) => (
                  <ReviewCard
                    key={review.id}
                    review={review}
                    onDelete={handleDeleteClick}
                  />
                ))
              )}
            </div>

            <ReviewsPagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          </div>
      </main>

      {/* Delete Review Modal */}
      <DeleteReviewModal
        isOpen={deleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleDeleteConfirm}
        review={selectedReview}
        isLoading={isDeleting}
      />

      {/* Success Message Modal */}
      <SuccessMessageModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        title="Success!"
        message={successMessage}
      />
    </>
  )
}

export default Reviews

