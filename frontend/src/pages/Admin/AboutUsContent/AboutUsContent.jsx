import React, { useState, useEffect } from 'react'
import AboutUsContentHeader from '../../../components/AboutUsContentHeader/AboutUsContentHeader'
import AboutUsContentFilters from '../../../components/AboutUsContentFilters/AboutUsContentFilters'
import DataTablePagination from '../../../components/DataTablePagination/DataTablePagination'
import AddEditAboutUsContentModal from '../../../components/AddEditAboutUsContentModal/AddEditAboutUsContentModal'
import DeleteAboutUsContentModal from '../../../components/DeleteAboutUsContentModal/DeleteAboutUsContentModal'
import aboutUsContentApi from '../../../api/aboutUsContent'

const AboutUsContent = () => {
  const [contents, setContents] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: '',
    is_active: null,
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
  const [selectedContent, setSelectedContent] = useState(null)

  // Fetch contents
  const fetchContents = async () => {
    try {
      setIsLoading(true)
      const response = await aboutUsContentApi.getAboutUsContent({
        page: pagination.currentPage,
        per_page: pagination.itemsPerPage,
        search: filters.search,
        is_active: filters.is_active,
        sort: filters.sort,
        order: filters.order
      })
      
      setContents(response.data || response.contents || [])
      setPagination(prev => ({
        ...prev,
        totalPages: response.total_pages || response.totalPages || 1,
        totalItems: response.total || response.totalItems || 0
      }))
    } catch (error) {
      console.error('Error fetching contents:', error)
      setContents([])
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
    fetchContents()
  }, [pagination.currentPage, filters])

  const handleSearchChange = (value) => {
    setFilters(prev => ({ ...prev, search: value }))
    setPagination(prev => ({ ...prev, currentPage: 1 }))
  }

  const handleActiveStatusChange = (value) => {
    setFilters(prev => ({ ...prev, is_active: value }))
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
    setSelectedContent(null)
    setIsAddEditModalOpen(true)
  }

  const handleEdit = (content) => {
    setSelectedContent(content)
    setIsAddEditModalOpen(true)
  }

  const handleModalClose = () => {
    setIsAddEditModalOpen(false)
    setSelectedContent(null)
  }

  const handleModalSuccess = () => {
    fetchContents()
  }

  const handleDelete = (content) => {
    setSelectedContent(content)
    setIsDeleteModalOpen(true)
  }

  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen(false)
    setSelectedContent(null)
  }

  const handleDeleteSuccess = () => {
    fetchContents()
  }

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, currentPage: page }))
  }

  // Define table columns
  const columns = [
    {
      key: 'title',
      header: 'Title',
      render: (content) => (
        <div className="flex flex-col">
          <span className="font-semibold text-gray-900 dark:text-white">
            {content.title || 'N/A'}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
            {content.description || 'No description'}
          </span>
        </div>
      )
    },
    {
      key: 'stats',
      header: 'Stats',
      render: (content) => {
        const stats = Array.isArray(content.stats) ? content.stats : []
        return (
          <div className="text-sm text-gray-600 dark:text-gray-300">
            {stats.length > 0 ? (
              <div className="flex flex-col gap-1">
                {stats.slice(0, 3).map((stat, index) => (
                  <span key={index} className="text-xs">
                    {stat.value} - {stat.label}
                  </span>
                ))}
                {stats.length > 3 && (
                  <span className="text-xs text-gray-400">+{stats.length - 3} more</span>
                )}
              </div>
            ) : (
              'No stats'
            )}
          </div>
        )
      }
    },
    {
      key: 'status',
      header: 'Status',
      align: 'center',
      render: (content) => {
        const isActive = content.isActive !== undefined ? content.isActive : content.is_active
        
        return (
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            isActive
              ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
          }`}>
            {isActive ? 'Active' : 'Inactive'}
          </span>
        )
      }
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (content) => (
        <div className="flex items-center justify-end space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleEdit(content)
            }}
            className="p-2 text-gray-400 hover:text-primary dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Edit"
          >
            <span className="material-symbols-outlined text-xl">edit_note</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleDelete(content)
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
      <AboutUsContentHeader onAddNew={handleAddNew} />

      <AboutUsContentFilters
        search={filters.search}
        isActive={filters.is_active}
        sortBy={filters.sort}
        sortOrder={filters.order}
        onSearchChange={handleSearchChange}
        onActiveStatusChange={handleActiveStatusChange}
        onSort={handleSort}
      />

      {/* Contents Table */}
      {isLoading ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <p>Loading contents...</p>
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
                  {contents.length === 0 ? (
                    <tr>
                      <td colSpan={columns.length} className="px-6 py-12 text-center">
                        <p className="text-sm text-gray-500 dark:text-gray-400">No contents found</p>
                      </td>
                    </tr>
                  ) : (
                    contents.map((content, rowIndex) => (
                      <tr
                        key={content.id || rowIndex}
                        className="group transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      >
                        {columns.map((column, colIndex) => (
                          <td
                            key={column.key || colIndex}
                            className={`px-6 py-4 align-middle ${column.align === 'center' ? 'text-center' : column.align === 'right' ? 'text-right' : ''}`}
                          >
                            {column.render ? column.render(content, rowIndex) : content[column.key] || '-'}
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
            itemName="Contents"
            onPageChange={handlePageChange}
          />
        </>
      )}

      {/* Add/Edit Content Modal */}
      <AddEditAboutUsContentModal
        isOpen={isAddEditModalOpen}
        onClose={handleModalClose}
        content={selectedContent}
        onSuccess={handleModalSuccess}
      />

      {/* Delete Content Modal */}
      <DeleteAboutUsContentModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteModalClose}
        content={selectedContent}
        onSuccess={handleDeleteSuccess}
      />
    </>
  )
}

export default AboutUsContent

