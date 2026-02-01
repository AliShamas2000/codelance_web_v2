import React, { useState, useEffect } from 'react'
import AboutUsHeader from '../../../components/AboutUsHeader/AboutUsHeader'
import AboutUsFilters from '../../../components/AboutUsFilters/AboutUsFilters'
import AboutUsTable from '../../../components/AboutUsTable/AboutUsTable'
import DataTablePagination from '../../../components/DataTablePagination/DataTablePagination'
import AddEditAboutUsModal from '../../../components/AddEditAboutUsModal/AddEditAboutUsModal'
import aboutUsApi from '../../../api/aboutUs'
import authApi from '../../../api/auth'

const AboutUs = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const [sections, setSections] = useState([])
  const [filteredSections, setFilteredSections] = useState([])
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [totalItems, setTotalItems] = useState(0)
  const [paginationData, setPaginationData] = useState(null)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedSection, setSelectedSection] = useState(null)


  // Fetch sections
  const fetchSections = async () => {
    try {
      setIsLoading(true)
      const response = await aboutUsApi.getAboutUsSections({
        page: currentPage,
        per_page: itemsPerPage,
        search
      })
      
      const sectionsList = response.data || []
      
      setSections(sectionsList)
      setFilteredSections(sectionsList)
      setTotalItems(response.pagination?.total || sectionsList.length)
    } catch (error) {
      console.error('Error fetching sections:', error)
      setSections([])
      setFilteredSections([])
      setTotalItems(0)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchSections()
  }, [currentPage, search])

  // Filter sections based on search
  useEffect(() => {
    if (!search.trim()) {
      setFilteredSections(sections)
    } else {
      const filtered = sections.filter(section => {
        const titleEn = (section.titleEn || section.title_en || section.title || '').toLowerCase()
        const titleAr = (section.titleAr || section.title_ar || '').toLowerCase()
        const type = (section.type || '').toLowerCase()
        const searchLower = search.toLowerCase()
        return titleEn.includes(searchLower) || titleAr.includes(searchLower) || type.includes(searchLower)
      })
      setFilteredSections(filtered)
    }
  }, [search, sections])


  const handleAddNew = () => {
    setSelectedSection(null)
    setIsModalOpen(true)
  }

  const handleEdit = (section) => {
    setSelectedSection(section)
    setIsModalOpen(true)
  }

  const handleSave = async (formData) => {
    try {
      setIsSaving(true)
      if (selectedSection) {
        // Update existing section
        await aboutUsApi.updateAboutUsSection(selectedSection.id, formData)
      } else {
        // Create new section
        await aboutUsApi.createAboutUsSection(formData)
      }
      setIsModalOpen(false)
      setSelectedSection(null)
      fetchSections()
    } catch (error) {
      console.error('Error saving section:', error)
      alert('Failed to save section. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCloseModal = () => {
    if (!isSaving) {
      setIsModalOpen(false)
      setSelectedSection(null)
    }
  }

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage)
  }

  // Calculate pagination (backend handles pagination, so use filteredSections directly)
  const paginatedSections = filteredSections
  const totalPages = paginationData?.last_page || Math.ceil(totalItems / itemsPerPage)

  return (
    <>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            About Us Section
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Manage the About Us section content for your website.
          </p>
        </div>
        <AboutUsHeader onAddNew={handleAddNew} />

        <AboutUsFilters
          search={search}
          onSearchChange={setSearch}
        />

        {isLoading ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <p>Loading sections...</p>
          </div>
        ) : (
          <>
            <AboutUsTable
              sections={paginatedSections}
              onEdit={handleEdit}
            />

            {totalPages > 1 && (
              <DataTablePagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={filteredSections.length}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
                itemName="Sections"
              />
            )}
          </>
        )}

        <AddEditAboutUsModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          section={selectedSection}
          onSave={handleSave}
          isSaving={isSaving}
        />
      </div>
    </>
  )
}


export default AboutUs

