import React, { useState, useEffect } from 'react'
import ReviewsHeader from '../../../components/ReviewsHeader/ReviewsHeader'
import ReviewsFilters from '../../../components/ReviewsFilters/ReviewsFilters'
import DataTablePagination from '../../../components/DataTablePagination/DataTablePagination'
import AddEditReviewModal from '../../../components/AddEditReviewModal/AddEditReviewModal'
import DeleteReviewModal from '../../../components/DeleteReviewModal/DeleteReviewModal'
import reviewsApi from '../../../api/reviews'

const Reviews = () => {
  const [reviews, setReviews] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: '',
    is_active: null,
    is_featured: null,
    rating: 'all',
    sort: 'order',
    order: 'asc'
  })
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  })
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedReview, setSelectedReview] = useState(null)
  const [draggedIndex, setDraggedIndex] = useState(null)
  const [dragOverIndex, setDragOverIndex] = useState(null)

  // Fetch reviews
  const fetchReviews = async () => {
    try {
      setIsLoading(true)
      const response = await reviewsApi.getReviews({
        page: pagination.currentPage,
        per_page: pagination.itemsPerPage,
        search: filters.search,
        is_active: filters.is_active,
        is_featured: filters.is_featured,
        rating: filters.rating,
        sort: filters.sort,
        order: filters.order
      })
      
      setReviews(response.data || response.reviews || [])
      setPagination(prev => ({
        ...prev,
        totalPages: response.total_pages || response.totalPages || 1,
        totalItems: response.total || response.totalItems || 0
      }))
    } catch (error) {
      console.error('Error fetching reviews:', error)
      setReviews([])
      setPagination(prev => ({
        ...prev,
        totalPages: 1,
        totalItems: 0
      }))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [pagination.currentPage, filters])

  const handleSearchChange = (value) => {
    setFilters(prev => ({ ...prev, search: value }))
    setPagination(prev => ({ ...prev, currentPage: 1 }))
  }

  const handleActiveStatusChange = (value) => {
    setFilters(prev => ({ ...prev, is_active: value }))
    setPagination(prev => ({ ...prev, currentPage: 1 }))
  }

  const handleFeaturedStatusChange = (value) => {
    setFilters(prev => ({ ...prev, is_featured: value }))
    setPagination(prev => ({ ...prev, currentPage: 1 }))
  }

  const handleRatingChange = (value) => {
    setFilters(prev => ({ ...prev, rating: value }))
    setPagination(prev => ({ ...prev, currentPage: 1 }))
  }

  const handleSort = (sortBy, sortOrder) => {
    setFilters(prev => ({
      ...prev,
      sort: sortBy || prev.sort,
      order: sortOrder || prev.order
    }))
    setPagination(prev => ({ ...prev, currentPage: 1 }))
  }

  const handleAddNew = () => {
    setSelectedReview(null)
    setIsAddEditModalOpen(true)
  }

  const handleEdit = (review) => {
    setSelectedReview(review)
    setIsAddEditModalOpen(true)
  }

  const handleModalClose = () => {
    setIsAddEditModalOpen(false)
    setSelectedReview(null)
  }

  const handleModalSuccess = () => {
    fetchReviews()
  }

  const handleDelete = (review) => {
    setSelectedReview(review)
    setIsDeleteModalOpen(true)
  }

  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen(false)
    setSelectedReview(null)
  }

  const handleDeleteSuccess = () => {
    fetchReviews()
  }

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, currentPage: page }))
  }

  // Drag and Drop Handlers
  const handleDragStart = (e, index) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', index.toString())
    if (e.currentTarget.tagName === 'TR') {
      e.currentTarget.style.opacity = '0.5'
    }
  }

  const handleDragEnd = (e) => {
    if (e.currentTarget.tagName === 'TR') {
      e.currentTarget.style.opacity = '1'
    }
    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  const handleDragOver = (e, index) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (draggedIndex !== null && draggedIndex !== index) {
      setDragOverIndex(index)
    }
  }

  const handleDragLeave = () => {
    setDragOverIndex(null)
  }

  const handleDrop = async (e, dropIndex) => {
    e.preventDefault()
    setDragOverIndex(null)

    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null)
      return
    }

    // Reorder reviews array
    const reorderedReviews = [...reviews]
    const draggedReview = reorderedReviews[draggedIndex]
    reorderedReviews.splice(draggedIndex, 1)
    reorderedReviews.splice(dropIndex, 0, draggedReview)

    // Update order values
    const updatedReviews = reorderedReviews.map((review, index) => ({
      id: review.id,
      order: index
    }))

    // Optimistically update UI
    setReviews(reorderedReviews.map((review, index) => ({
      ...review,
      order: index
    })))

    try {
      // Update order in backend
      await reviewsApi.updateOrder(updatedReviews)
      // Refresh to get updated data
      await fetchReviews()
    } catch (error) {
      console.error('Error updating review order:', error)
      // Revert on error
      fetchReviews()
    }

    setDraggedIndex(null)
  }

  // Define table columns
  const columns = [
    {
      key: 'drag',
      header: '',
      width: '8',
      render: (review, index) => (
        <div className="flex items-center justify-center">
          <span 
            className="material-symbols-outlined text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-move select-none"
            title="Drag row to reorder"
          >
            drag_indicator
          </span>
        </div>
      )
    },
    {
      key: 'author',
      header: 'Author',
      render: (review) => (
        <div className="flex items-center gap-3">
          {review.authorImage || review.author_image ? (
            <img
              src={review.authorImage || review.author_image}
              alt={review.authorName || review.author_name || 'Author'}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <span className="material-symbols-outlined text-gray-400">person</span>
            </div>
          )}
          <div className="flex flex-col">
            <span className="font-semibold text-gray-900 dark:text-white">
              {review.authorName || review.author_name || 'N/A'}
            </span>
            {(review.authorTitle || review.author_title) && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {review.authorTitle || review.author_title}
                {review.authorCompany || review.author_company ? ` at ${review.authorCompany || review.author_company}` : ''}
              </span>
            )}
          </div>
        </div>
      )
    },
    {
      key: 'quote',
      header: 'Review',
      render: (review) => (
        <div className="text-sm text-gray-600 dark:text-gray-300 max-w-md">
          <span className="block line-clamp-3">
            {review.quote || 'No review text'}
          </span>
        </div>
      )
    },
    {
      key: 'rating',
      header: 'Rating',
      align: 'center',
      render: (review) => {
        const rating = review.rating || 5
        return (
          <div className="flex items-center justify-center gap-1">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={`text-lg ${
                  i < rating
                    ? 'text-yellow-400'
                    : 'text-gray-300 dark:text-gray-600'
                }`}
              >
                ★
              </span>
            ))}
            <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
              {rating}
            </span>
          </div>
        )
      }
    },
    {
      key: 'status',
      header: 'Status',
      align: 'center',
      render: (review) => {
        const isActive = review.isActive !== undefined ? review.isActive : review.is_active
        const isFeatured = review.isFeatured !== undefined ? review.isFeatured : review.is_featured
        
        return (
          <div className="flex flex-col gap-1 items-center">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              isActive
                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
            }`}>
              {isActive ? 'Active' : 'Inactive'}
            </span>
            {isFeatured && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300">
                Featured
              </span>
            )}
          </div>
        )
      }
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (review) => (
        <div className="flex items-center justify-end space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleEdit(review)
            }}
            className="p-2 text-gray-400 hover:text-primary dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Edit"
          >
            <span className="material-symbols-outlined text-xl">edit_note</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleDelete(review)
            }}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            title="Delete"
          >
            <span className="material-symbols-outlined text-xl">delete_outline</span>
          </button>
        </div>
      )
    }
  ]

  return (
    <>
      <ReviewsHeader onAddNew={handleAddNew} />

      <ReviewsFilters
        search={filters.search}
        isActive={filters.is_active}
        isFeatured={filters.is_featured}
        rating={filters.rating}
        sortBy={filters.sort}
        sortOrder={filters.order}
        onSearchChange={handleSearchChange}
        onActiveStatusChange={handleActiveStatusChange}
        onFeaturedStatusChange={handleFeaturedStatusChange}
        onRatingChange={handleRatingChange}
        onSort={handleSort}
      />

      {/* Reviews Table */}
      {isLoading ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <p>Loading reviews...</p>
        </div>
      ) : (
        <>
          <div className="bg-white dark:bg-card-dark rounded-xl shadow-soft border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-700 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {columns.map((column, index) => (
                      <th
                        key={column.key || index}
                        className={`px-6 py-4 ${column.width ? `w-${column.width}` : ''} ${column.align === 'center' ? 'text-center' : column.align === 'right' ? 'text-right' : ''}`}
                      >
                        {column.header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {reviews.length === 0 ? (
                    <tr>
                      <td colSpan={columns.length} className="px-6 py-12 text-center">
                        <p className="text-sm text-gray-500 dark:text-gray-400">No reviews found</p>
                      </td>
                    </tr>
                  ) : (
                    reviews.map((review, rowIndex) => (
                      <tr
                        key={review.id || rowIndex}
                        draggable
                        onDragStart={(e) => {
                          e.stopPropagation()
                          handleDragStart(e, rowIndex)
                        }}
                        onDragOver={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          handleDragOver(e, rowIndex)
                        }}
                        onDragLeave={(e) => {
                          e.stopPropagation()
                          handleDragLeave()
                        }}
                        onDrop={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          handleDrop(e, rowIndex)
                        }}
                        onDragEnd={(e) => {
                          e.stopPropagation()
                          handleDragEnd(e)
                        }}
                        onClick={(e) => {
                          if (draggedIndex !== null) {
                            e.preventDefault()
                            e.stopPropagation()
                          }
                        }}
                        className={`group transition-colors ${
                          draggedIndex === rowIndex ? 'opacity-50 cursor-move' : ''
                        } ${
                          dragOverIndex === rowIndex ? 'bg-primary/10 border-t-2 border-primary' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                        } ${draggedIndex !== null ? 'cursor-move' : ''}`}
                      >
                        {columns.map((column, colIndex) => (
                          <td
                            key={column.key || colIndex}
                            className={`px-6 py-4 align-middle ${column.align === 'center' ? 'text-center' : column.align === 'right' ? 'text-right' : ''}`}
                          >
                            {column.render ? column.render(review, rowIndex) : review[column.key] || '-'}
                          </td>
                        ))}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <DataTablePagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            totalItems={pagination.totalItems}
            itemsPerPage={pagination.itemsPerPage}
            itemName="Reviews"
            onPageChange={handlePageChange}
          />
        </>
      )}

      {/* Add/Edit Review Modal */}
      <AddEditReviewModal
        isOpen={isAddEditModalOpen}
        onClose={handleModalClose}
        review={selectedReview}
        onSuccess={handleModalSuccess}
      />

      {/* Delete Review Modal */}
      <DeleteReviewModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteModalClose}
        review={selectedReview}
        onSuccess={handleDeleteSuccess}
      />
    </>
  )
}

export default Reviews

