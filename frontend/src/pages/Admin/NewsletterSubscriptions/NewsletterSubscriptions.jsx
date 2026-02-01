import React, { useState, useEffect } from 'react'
import NewsletterSubscriptionsHeader from '../../../components/NewsletterSubscriptionsHeader/NewsletterSubscriptionsHeader'
import NewsletterSubscriptionsFilters from '../../../components/NewsletterSubscriptionsFilters/NewsletterSubscriptionsFilters'
import DataTablePagination from '../../../components/DataTablePagination/DataTablePagination'
import ViewNewsletterSubscriptionModal from '../../../components/ViewNewsletterSubscriptionModal/ViewNewsletterSubscriptionModal'
import DeleteNewsletterSubscriptionModal from '../../../components/DeleteNewsletterSubscriptionModal/DeleteNewsletterSubscriptionModal'
import newsletterSubscriptionsApi from '../../../api/newsletterSubscriptions'

const NewsletterSubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    sort: 'subscribed_at',
    order: 'desc'
  })
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  })
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedSubscription, setSelectedSubscription] = useState(null)

  // Fetch subscriptions
  const fetchSubscriptions = async () => {
    try {
      setIsLoading(true)
      const response = await newsletterSubscriptionsApi.getSubscriptions({
        page: pagination.currentPage,
        per_page: pagination.itemsPerPage,
        search: filters.search,
        status: filters.status,
        sort: filters.sort,
        order: filters.order
      })
      
      setSubscriptions(response.data || response.subscriptions || [])
      setPagination(prev => ({
        ...prev,
        totalPages: response.total_pages || response.totalPages || 1,
        totalItems: response.total || response.totalItems || 0
      }))
    } catch (error) {
      console.error('Error fetching subscriptions:', error)
      setSubscriptions([])
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
    fetchSubscriptions()
  }, [pagination.currentPage, filters])

  const handleSearchChange = (value) => {
    setFilters(prev => ({ ...prev, search: value }))
    setPagination(prev => ({ ...prev, currentPage: 1 }))
  }

  const handleStatusChange = (value) => {
    setFilters(prev => ({ ...prev, status: value }))
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

  const handleView = (subscription) => {
    setSelectedSubscription(subscription)
    setIsViewModalOpen(true)
  }

  const handleViewModalClose = () => {
    setIsViewModalOpen(false)
    setSelectedSubscription(null)
  }

  const handleViewModalUpdate = () => {
    fetchSubscriptions()
  }

  const handleDelete = (subscription) => {
    setSelectedSubscription(subscription)
    setIsDeleteModalOpen(true)
  }

  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen(false)
    setSelectedSubscription(null)
  }

  const handleDeleteSuccess = () => {
    fetchSubscriptions()
  }

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, currentPage: page }))
  }

  // Define table columns
  const columns = [
    {
      key: 'email',
      header: 'Email',
      render: (subscription) => (
        <div className="font-semibold text-gray-900 dark:text-white">
          {subscription.email || 'N/A'}
        </div>
      )
    },
    {
      key: 'status',
      header: 'Status',
      align: 'center',
      render: (subscription) => {
        const status = subscription.status || 'active'
        const statusColors = {
          active: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
          unsubscribed: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
        }
        
        return (
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            statusColors[status] || statusColors.active
          }`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        )
      }
    },
    {
      key: 'subscribed_at',
      header: 'Subscribed',
      render: (subscription) => (
        <div className="text-sm text-gray-600 dark:text-gray-300">
          {subscription.subscribedAt || subscription.subscribed_at 
            ? new Date(subscription.subscribedAt || subscription.subscribed_at).toLocaleDateString() 
            : 'N/A'}
        </div>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (subscription) => (
        <div className="flex items-center justify-end space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleView(subscription)
            }}
            className="p-2 text-gray-400 hover:text-primary dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="View Details"
          >
            <span className="material-symbols-outlined text-xl">visibility</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleDelete(subscription)
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
      <NewsletterSubscriptionsHeader />

      <NewsletterSubscriptionsFilters
        search={filters.search}
        status={filters.status}
        sortBy={filters.sort}
        sortOrder={filters.order}
        onSearchChange={handleSearchChange}
        onStatusChange={handleStatusChange}
        onSort={handleSort}
      />

      {/* Subscriptions Table */}
      {isLoading ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <p>Loading subscriptions...</p>
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
                  {subscriptions.length === 0 ? (
                    <tr>
                      <td colSpan={columns.length} className="px-6 py-12 text-center">
                        <p className="text-sm text-gray-500 dark:text-gray-400">No subscriptions found</p>
                      </td>
                    </tr>
                  ) : (
                    subscriptions.map((subscription, rowIndex) => (
                      <tr
                        key={subscription.id || rowIndex}
                        className="group transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer"
                        onClick={() => handleView(subscription)}
                      >
                        {columns.map((column, colIndex) => (
                          <td
                            key={column.key || colIndex}
                            className={`px-6 py-4 align-middle ${column.align === 'center' ? 'text-center' : column.align === 'right' ? 'text-right' : ''}`}
                          >
                            {column.render ? column.render(subscription, rowIndex) : subscription[column.key] || '-'}
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
            itemName="Subscriptions"
            onPageChange={handlePageChange}
          />
        </>
      )}

      {/* View Subscription Modal */}
      <ViewNewsletterSubscriptionModal
        isOpen={isViewModalOpen}
        onClose={handleViewModalClose}
        subscription={selectedSubscription}
        onUpdate={handleViewModalUpdate}
      />

      {/* Delete Subscription Modal */}
      <DeleteNewsletterSubscriptionModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteModalClose}
        subscription={selectedSubscription}
        onSuccess={handleDeleteSuccess}
      />
    </>
  )
}

export default NewsletterSubscriptions

