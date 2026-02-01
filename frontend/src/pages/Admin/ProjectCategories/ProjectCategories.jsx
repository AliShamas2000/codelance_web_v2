import React, { useState, useEffect } from 'react'
import ProjectCategoriesHeader from '../../../components/ProjectCategoriesHeader/ProjectCategoriesHeader'
import ProjectCategoriesFilters from '../../../components/ProjectCategoriesFilters/ProjectCategoriesFilters'
import DataTablePagination from '../../../components/DataTablePagination/DataTablePagination'
import AddEditProjectCategoryModal from '../../../components/AddEditProjectCategoryModal/AddEditProjectCategoryModal'
import DeleteProjectCategoryModal from '../../../components/DeleteProjectCategoryModal/DeleteProjectCategoryModal'
import projectCategoriesApi from '../../../api/projectCategories'

const ProjectCategories = () => {
  const [categories, setCategories] = useState([])
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
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [draggedIndex, setDraggedIndex] = useState(null)
  const [dragOverIndex, setDragOverIndex] = useState(null)

  // Fetch categories
  const fetchCategories = async () => {
    try {
      setIsLoading(true)
      const response = await projectCategoriesApi.getProjectCategories({
        page: pagination.currentPage,
        per_page: pagination.itemsPerPage,
        search: filters.search,
        is_active: filters.is_active,
        sort: filters.sort,
        order: filters.order
      })
      
      setCategories(response.data || response.categories || [])
      setPagination(prev => ({
        ...prev,
        totalPages: response.total_pages || response.totalPages || 1,
        totalItems: response.total || response.totalItems || 0
      }))
    } catch (error) {
      console.error('Error fetching categories:', error)
      setCategories([])
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
    fetchCategories()
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
    setSelectedCategory(null)
    setIsAddEditModalOpen(true)
  }

  const handleEdit = (category) => {
    setSelectedCategory(category)
    setIsAddEditModalOpen(true)
  }

  const handleModalClose = () => {
    setIsAddEditModalOpen(false)
    setSelectedCategory(null)
  }

  const handleModalSuccess = () => {
    fetchCategories()
  }

  const handleDelete = (category) => {
    setSelectedCategory(category)
    setIsDeleteModalOpen(true)
  }

  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen(false)
    setSelectedCategory(null)
  }

  const handleDeleteSuccess = () => {
    fetchCategories()
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

    // Reorder categories array
    const reorderedCategories = [...categories]
    const draggedCategory = reorderedCategories[draggedIndex]
    reorderedCategories.splice(draggedIndex, 1)
    reorderedCategories.splice(dropIndex, 0, draggedCategory)

    // Update order values
    const updatedCategories = reorderedCategories.map((category, index) => ({
      id: category.id,
      order: index
    }))

    // Optimistically update UI
    setCategories(reorderedCategories.map((category, index) => ({
      ...category,
      order: index
    })))

    try {
      // Update order in backend
      await projectCategoriesApi.updateOrder(updatedCategories)
      // Refresh to get updated data
      await fetchCategories()
    } catch (error) {
      console.error('Error updating category order:', error)
      // Revert on error
      fetchCategories()
    }

    setDraggedIndex(null)
  }

  // Define table columns
  const columns = [
    {
      key: 'drag',
      header: '',
      width: '8',
      render: (category, index) => (
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
      key: 'name',
      header: 'Category Name',
      render: (category) => (
        <div className="flex flex-col">
          <span className="font-semibold text-gray-900 dark:text-white">
            {category.name || 'N/A'}
          </span>
          {category.slug && (
            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              /{category.slug}
            </span>
          )}
        </div>
      )
    },
    {
      key: 'description',
      header: 'Description',
      render: (category) => (
        <div className="text-sm text-gray-600 dark:text-gray-300 max-w-xs">
          <span className="block line-clamp-2">
            {category.description || 'No description'}
          </span>
        </div>
      )
    },
    {
      key: 'projects',
      header: 'Projects',
      align: 'center',
      render: (category) => {
        const count = category.projectsCount || category.projects_count || 0
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
            {count} project{count !== 1 ? 's' : ''}
          </span>
        )
      }
    },
    {
      key: 'status',
      header: 'Status',
      align: 'center',
      render: (category) => {
        const isActive = category.isActive !== undefined ? category.isActive : category.is_active
        
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
      render: (category) => (
        <div className="flex items-center justify-end space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleEdit(category)
            }}
            className="p-2 text-gray-400 hover:text-primary dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Edit"
          >
            <span className="material-symbols-outlined text-xl">edit_note</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleDelete(category)
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
      <ProjectCategoriesHeader onAddNew={handleAddNew} />

      <ProjectCategoriesFilters
        search={filters.search}
        isActive={filters.is_active}
        sortBy={filters.sort}
        sortOrder={filters.order}
        onSearchChange={handleSearchChange}
        onActiveStatusChange={handleActiveStatusChange}
        onSort={handleSort}
      />

      {/* Categories Table */}
      {isLoading ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <p>Loading categories...</p>
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
                  {categories.length === 0 ? (
                    <tr>
                      <td colSpan={columns.length} className="px-6 py-12 text-center">
                        <p className="text-sm text-gray-500 dark:text-gray-400">No categories found</p>
                      </td>
                    </tr>
                  ) : (
                    categories.map((category, rowIndex) => (
                      <tr
                        key={category.id || rowIndex}
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
                            {column.render ? column.render(category, rowIndex) : category[column.key] || '-'}
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
            itemName="Categories"
            onPageChange={handlePageChange}
          />
        </>
      )}

      {/* Add/Edit Category Modal */}
      <AddEditProjectCategoryModal
        isOpen={isAddEditModalOpen}
        onClose={handleModalClose}
        category={selectedCategory}
        onSuccess={handleModalSuccess}
      />

      {/* Delete Category Modal */}
      <DeleteProjectCategoryModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteModalClose}
        category={selectedCategory}
        onSuccess={handleDeleteSuccess}
      />
    </>
  )
}

export default ProjectCategories

