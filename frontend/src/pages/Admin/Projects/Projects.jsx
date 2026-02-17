import React, { useState, useEffect } from 'react'
import ProjectsHeader from '../../../components/ProjectsHeader/ProjectsHeader'
import ProjectsFilters from '../../../components/ProjectsFilters/ProjectsFilters'
import DataTablePagination from '../../../components/DataTablePagination/DataTablePagination'
import AddEditProjectModal from '../../../components/AddEditProjectModal/AddEditProjectModal'
import DeleteProjectModal from '../../../components/DeleteProjectModal/DeleteProjectModal'
import projectsApi from '../../../api/projects'
import projectCategoriesApi from '../../../api/projectCategories'

const Projects = () => {
  const [projects, setProjects] = useState([])
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: '',
    category_id: 'all',
    is_active: null,
    is_featured: null,
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
  const [selectedProject, setSelectedProject] = useState(null)
  const [draggedIndex, setDraggedIndex] = useState(null)
  const [dragOverIndex, setDragOverIndex] = useState(null)

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await projectCategoriesApi.getProjectCategories({ per_page: 100 })
      setCategories(response.data || response.categories || [])
    } catch (error) {
      console.error('Error fetching categories:', error)
      setCategories([])
    }
  }

  // Fetch projects
  const fetchProjects = async () => {
    try {
      setIsLoading(true)
      const response = await projectsApi.getProjects({
        page: pagination.currentPage,
        per_page: pagination.itemsPerPage,
        search: filters.search,
        category_id: filters.category_id,
        is_active: filters.is_active,
        is_featured: filters.is_featured,
        sort: filters.sort,
        order: filters.order
      })
      
      setProjects(response.data || response.projects || [])
      setPagination(prev => ({
        ...prev,
        totalPages: response.total_pages || response.totalPages || 1,
        totalItems: response.total || response.totalItems || 0
      }))
    } catch (error) {
      console.error('Error fetching projects:', error)
      setProjects([])
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
  }, [])

  useEffect(() => {
    fetchProjects()
  }, [pagination.currentPage, filters])

  const handleSearchChange = (value) => {
    setFilters(prev => ({ ...prev, search: value }))
    setPagination(prev => ({ ...prev, currentPage: 1 }))
  }

  const handleCategoryChange = (value) => {
    setFilters(prev => ({ ...prev, category_id: value }))
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

  const handleSort = (sortBy, sortOrder) => {
    setFilters(prev => ({
      ...prev,
      sort: sortBy || prev.sort,
      order: sortOrder || prev.order
    }))
    setPagination(prev => ({ ...prev, currentPage: 1 }))
  }

  const handleAddNew = () => {
    setSelectedProject(null)
    setIsAddEditModalOpen(true)
  }

  const handleEdit = (project) => {
    setSelectedProject(project)
    setIsAddEditModalOpen(true)
  }

  const handleModalClose = () => {
    setIsAddEditModalOpen(false)
    setSelectedProject(null)
  }

  const handleModalSuccess = () => {
    fetchProjects()
  }

  const handleDelete = (project) => {
    setSelectedProject(project)
    setIsDeleteModalOpen(true)
  }

  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen(false)
    setSelectedProject(null)
  }

  const handleDeleteSuccess = () => {
    fetchProjects()
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

    // Reorder projects array
    const reorderedProjects = [...projects]
    const draggedProject = reorderedProjects[draggedIndex]
    reorderedProjects.splice(draggedIndex, 1)
    reorderedProjects.splice(dropIndex, 0, draggedProject)

    // Update order values
    const updatedProjects = reorderedProjects.map((project, index) => ({
      id: project.id,
      order: index
    }))

    // Optimistically update UI
    setProjects(reorderedProjects.map((project, index) => ({
      ...project,
      order: index
    })))

    try {
      // Update order in backend
      await projectsApi.updateOrder(updatedProjects)
      // Refresh to get updated data
      await fetchProjects()
    } catch (error) {
      console.error('Error updating project order:', error)
      // Revert on error
      fetchProjects()
    }

    setDraggedIndex(null)
  }

  // Define table columns
  const columns = [
    {
      key: 'drag',
      header: '',
      width: '8',
      render: (project, index) => (
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
      key: 'image',
      header: 'Image',
      width: '16',
      render: (project) => {
        const imageUrl = (Array.isArray(project.images) && project.images.length > 0)
          ? project.images[0]
          : (project.image || project.image_url)
        
        return (
          <div className="flex items-center relative">
            {imageUrl ? (
              <>
                <img
                  src={imageUrl}
                  alt={project.title || 'Project'}
                  className="w-16 h-16 object-cover rounded-lg"
                  onError={(e) => {
                    e.target.onerror = null
                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="64" height="64"%3E%3Crect width="64" height="64" fill="%23e5e7eb"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%239ca3af"%3E%3C/svg%3E'
                  }}
                />
              </>
            ) : (
              <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-gray-400">image</span>
              </div>
            )}
          </div>
        )
      }
    },
    {
      key: 'title',
      header: 'Title',
      render: (project) => (
        <div className="flex flex-col">
          <span className="font-semibold text-gray-900 dark:text-white">
            {project.title || 'N/A'}
          </span>
          {project.category && (
            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {project.category.name}
            </span>
          )}
        </div>
      )
    },
    {
      key: 'tags',
      header: 'Tags',
      render: (project) => {
        const tags = project.tags || []
        return (
          <div className="flex flex-wrap gap-1">
            {tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary"
              >
                {tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                +{tags.length - 3}
              </span>
            )}
          </div>
        )
      }
    },
    {
      key: 'status',
      header: 'Status',
      align: 'center',
      render: (project) => {
        const isActive = project.isActive !== undefined ? project.isActive : project.is_active
        const isFeatured = project.isFeatured !== undefined ? project.isFeatured : project.is_featured
        
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
      render: (project) => (
        <div className="flex items-center justify-end space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleEdit(project)
            }}
            className="p-2 text-gray-400 hover:text-primary dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Edit"
          >
            <span className="material-symbols-outlined text-xl">edit_note</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleDelete(project)
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
      <ProjectsHeader onAddNew={handleAddNew} />

      <ProjectsFilters
        search={filters.search}
        categoryId={filters.category_id}
        isActive={filters.is_active}
        isFeatured={filters.is_featured}
        sortBy={filters.sort}
        sortOrder={filters.order}
        categories={categories}
        onSearchChange={handleSearchChange}
        onCategoryChange={handleCategoryChange}
        onActiveStatusChange={handleActiveStatusChange}
        onFeaturedStatusChange={handleFeaturedStatusChange}
        onSort={handleSort}
      />

      {/* Projects Table */}
      {isLoading ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <p>Loading projects...</p>
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
                  {projects.length === 0 ? (
                    <tr>
                      <td colSpan={columns.length} className="px-6 py-12 text-center">
                        <p className="text-sm text-gray-500 dark:text-gray-400">No projects found</p>
                      </td>
                    </tr>
                  ) : (
                    projects.map((project, rowIndex) => (
                      <tr
                        key={project.id || rowIndex}
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
                            {column.render ? column.render(project, rowIndex) : project[column.key] || '-'}
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
            itemName="Projects"
            onPageChange={handlePageChange}
          />
        </>
      )}

      {/* Add/Edit Project Modal */}
      <AddEditProjectModal
        isOpen={isAddEditModalOpen}
        onClose={handleModalClose}
        project={selectedProject}
        categories={categories}
        onSuccess={handleModalSuccess}
      />

      {/* Delete Project Modal */}
      <DeleteProjectModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteModalClose}
        project={selectedProject}
        onSuccess={handleDeleteSuccess}
      />
    </>
  )
}

export default Projects
