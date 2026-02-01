import React, { useState, useEffect } from 'react'
import ContactSubmissionsHeader from '../../../components/ContactSubmissionsHeader/ContactSubmissionsHeader'
import ContactSubmissionsFilters from '../../../components/ContactSubmissionsFilters/ContactSubmissionsFilters'
import DataTablePagination from '../../../components/DataTablePagination/DataTablePagination'
import ViewContactSubmissionModal from '../../../components/ViewContactSubmissionModal/ViewContactSubmissionModal'
import DeleteContactSubmissionModal from '../../../components/DeleteContactSubmissionModal/DeleteContactSubmissionModal'
import contactSubmissionsApi from '../../../api/contactSubmissions'
import projectsApi from '../../../api/projects'

const ContactSubmissions = () => {
  const [submissions, setSubmissions] = useState([])
  const [projects, setProjects] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    project_id: 'all',
    sort: 'created_at',
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
  const [selectedSubmission, setSelectedSubmission] = useState(null)

  // Fetch projects for filter
  const fetchProjects = async () => {
    try {
      const response = await projectsApi.getProjects({ per_page: 100 })
      setProjects(response.data || response.projects || [])
    } catch (error) {
      console.error('Error fetching projects:', error)
      setProjects([])
    }
  }

  // Fetch submissions
  const fetchSubmissions = async () => {
    try {
      setIsLoading(true)
      const response = await contactSubmissionsApi.getContactSubmissions({
        page: pagination.currentPage,
        per_page: pagination.itemsPerPage,
        search: filters.search,
        status: filters.status,
        project_id: filters.project_id,
        sort: filters.sort,
        order: filters.order
      })
      
      setSubmissions(response.data || response.submissions || [])
      setPagination(prev => ({
        ...prev,
        totalPages: response.total_pages || response.totalPages || 1,
        totalItems: response.total || response.totalItems || 0
      }))
    } catch (error) {
      console.error('Error fetching submissions:', error)
      setSubmissions([])
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
    fetchProjects()
  }, [])

  useEffect(() => {
    fetchSubmissions()
  }, [pagination.currentPage, filters])

  const handleSearchChange = (value) => {
    setFilters(prev => ({ ...prev, search: value }))
    setPagination(prev => ({ ...prev, currentPage: 1 }))
  }

  const handleStatusChange = (value) => {
    setFilters(prev => ({ ...prev, status: value }))
    setPagination(prev => ({ ...prev, currentPage: 1 }))
  }

  const handleProjectChange = (value) => {
    setFilters(prev => ({ ...prev, project_id: value }))
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

  const handleView = (submission) => {
    setSelectedSubmission(submission)
    setIsViewModalOpen(true)
  }

  const handleViewModalClose = () => {
    setIsViewModalOpen(false)
    setSelectedSubmission(null)
  }

  const handleViewModalUpdate = () => {
    fetchSubmissions()
  }

  const handleDelete = (submission) => {
    setSelectedSubmission(submission)
    setIsDeleteModalOpen(true)
  }

  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen(false)
    setSelectedSubmission(null)
  }

  const handleDeleteSuccess = () => {
    fetchSubmissions()
  }

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, currentPage: page }))
  }

  // Define table columns
  const columns = [
    {
      key: 'name',
      header: 'Name',
      render: (submission) => (
        <div className="flex flex-col">
          <span className="font-semibold text-gray-900 dark:text-white">
            {submission.name || 'N/A'}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {submission.email || 'N/A'}
          </span>
        </div>
      )
    },
    {
      key: 'project',
      header: 'Project',
      render: (submission) => (
        <div className="text-sm text-gray-600 dark:text-gray-300">
          {submission.project ? submission.project.title : 'No project selected'}
        </div>
      )
    },
    {
      key: 'message',
      header: 'Message',
      render: (submission) => (
        <div className="text-sm text-gray-600 dark:text-gray-300 max-w-md">
          <span className="block line-clamp-2">
            {submission.message || 'No message'}
          </span>
        </div>
      )
    },
    {
      key: 'status',
      header: 'Status',
      align: 'center',
      render: (submission) => {
        const status = submission.status || 'new'
        const statusColors = {
          new: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
          read: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
          replied: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
          archived: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
        }
        
        return (
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            statusColors[status] || statusColors.new
          }`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        )
      }
    },
    {
      key: 'date',
      header: 'Submitted',
      render: (submission) => (
        <div className="text-sm text-gray-600 dark:text-gray-300">
          {submission.createdAt ? new Date(submission.createdAt).toLocaleDateString() : 'N/A'}
        </div>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (submission) => (
        <div className="flex items-center justify-end space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleView(submission)
            }}
            className="p-2 text-gray-400 hover:text-primary dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="View Details"
          >
            <span className="material-symbols-outlined text-xl">visibility</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleDelete(submission)
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
      <ContactSubmissionsHeader />

      <ContactSubmissionsFilters
        search={filters.search}
        status={filters.status}
        projectId={filters.project_id}
        sortBy={filters.sort}
        sortOrder={filters.order}
        projects={projects}
        onSearchChange={handleSearchChange}
        onStatusChange={handleStatusChange}
        onProjectChange={handleProjectChange}
        onSort={handleSort}
      />

      {/* Submissions Table */}
      {isLoading ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <p>Loading submissions...</p>
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
                  {submissions.length === 0 ? (
                    <tr>
                      <td colSpan={columns.length} className="px-6 py-12 text-center">
                        <p className="text-sm text-gray-500 dark:text-gray-400">No submissions found</p>
                      </td>
                    </tr>
                  ) : (
                    submissions.map((submission, rowIndex) => (
                      <tr
                        key={submission.id || rowIndex}
                        className="group transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer"
                        onClick={() => handleView(submission)}
                      >
                        {columns.map((column, colIndex) => (
                          <td
                            key={column.key || colIndex}
                            className={`px-6 py-4 align-middle ${column.align === 'center' ? 'text-center' : column.align === 'right' ? 'text-right' : ''}`}
                          >
                            {column.render ? column.render(submission, rowIndex) : submission[column.key] || '-'}
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
            itemName="Submissions"
            onPageChange={handlePageChange}
          />
        </>
      )}

      {/* View Submission Modal */}
      <ViewContactSubmissionModal
        isOpen={isViewModalOpen}
        onClose={handleViewModalClose}
        submission={selectedSubmission}
        onUpdate={handleViewModalUpdate}
      />

      {/* Delete Submission Modal */}
      <DeleteContactSubmissionModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteModalClose}
        submission={selectedSubmission}
        onSuccess={handleDeleteSuccess}
      />
    </>
  )
}

export default ContactSubmissions

