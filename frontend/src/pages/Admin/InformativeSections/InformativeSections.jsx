import React, { useState, useEffect } from 'react'
import InformativeSectionsHeader from '../../../components/InformativeSectionsHeader/InformativeSectionsHeader'
import InformativeSectionsFilters from '../../../components/InformativeSectionsFilters/InformativeSectionsFilters'
import InformativeSectionsTable from '../../../components/InformativeSectionsTable/InformativeSectionsTable'
import InformativeSectionsPagination from '../../../components/InformativeSectionsPagination/InformativeSectionsPagination'
import AddEditInformativeSectionModal from '../../../components/AddEditInformativeSectionModal/AddEditInformativeSectionModal'
import informativeSectionsApi from '../../../api/informativeSections'
import authApi from '../../../api/auth'

const InformativeSections = () => {
  const [sections, setSections] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: ''
  })
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  })
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false)
  const [selectedSection, setSelectedSection] = useState(null)


  // Fetch sections
  const fetchSections = async () => {
    try {
      setIsLoading(true)
      const response = await informativeSectionsApi.getSections({
        page: pagination.currentPage,
        per_page: pagination.itemsPerPage,
        search: filters.search
      })
      
      setSections(response.data || response.sections || [])
      setPagination(prev => ({
        ...prev,
        totalPages: response.total_pages || response.totalPages || 1,
        totalItems: response.total || response.totalItems || 0
      }))
    } catch (error) {
      console.error('Error fetching informative sections:', error)
      // Use default data if API fails
      setSections(getDefaultSections())
      setPagination(prev => ({
        ...prev,
        totalPages: 1,
        totalItems: getDefaultSections().length
      }))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchSections()
  }, [pagination.currentPage, filters])


  const handleSearchChange = (value) => {
    setFilters(prev => ({ ...prev, search: value }))
    setPagination(prev => ({ ...prev, currentPage: 1 }))
  }

  const handleFilter = () => {
    // TODO: Implement filter functionality
    console.log('Filter clicked')
  }

  const handleSort = () => {
    // TODO: Implement sort functionality
    console.log('Sort clicked')
  }

  // Note: Only editing existing sections is allowed, no adding new ones
  const handleAddNew = () => {
    // Disabled - only editing existing sections
  }

  const handleEdit = (section) => {
    setSelectedSection(section)
    setIsAddEditModalOpen(true)
  }

  // Delete functionality removed - these are fixed sections
  const handleDelete = () => {
    // Disabled - sections cannot be deleted
  }

  const handleModalClose = () => {
    setIsAddEditModalOpen(false)
    setSelectedSection(null)
  }

  const handleModalSuccess = () => {
    // Refresh sections list after successful add/edit/delete
    fetchSections()
  }

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, currentPage: page }))
  }

  return (
    <>
      <InformativeSectionsHeader onAddNew={null} />

      <div className="bg-white dark:bg-[#10221c] rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm overflow-hidden flex flex-col">
        <InformativeSectionsFilters
          search={filters.search}
          onSearchChange={handleSearchChange}
          onFilter={handleFilter}
          onSort={handleSort}
        />

        {/* Sections Table */}
        {isLoading ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <p>Loading sections...</p>
          </div>
        ) : (
          <>
            <InformativeSectionsTable
              sections={sections}
              onEdit={handleEdit}
              onDelete={null}
            />
            <InformativeSectionsPagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              totalItems={pagination.totalItems}
              itemsPerPage={pagination.itemsPerPage}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>

      {/* Add/Edit Section Modal - Only for editing existing sections */}
      {selectedSection && (
        <AddEditInformativeSectionModal
          isOpen={isAddEditModalOpen}
          onClose={handleModalClose}
          section={selectedSection}
        onSuccess={handleModalSuccess}
      />
      )}
    </>
  )
}

// Default sections data (fallback when API is not available)
// Only "Why Choose Us" and "Refining the Art" sections
const getDefaultSections = () => [
  {
    id: 1,
    name: 'why-choose-us',
    title: 'Why Choose Us',
    subtitle: 'Features List',
    icon: 'verified',
    contentSummary: 'Title, Description, 4 Feature Icons',
    status: 'published',
    updated_at: new Date().toISOString(),
    titleEn: 'Why Choose Us?',
    titleAr: 'لماذا تختارنا؟',
    descriptionEn: 'At Codelance, we believe that great software is more than just code—it\'s an experience. Our engineers are dedicated to the craft, combining robust architecture with beautiful design to deliver exceptional results. We\'ve created a process where you can relax, collaborate, and launch products you\'re proud of.',
    descriptionAr: 'في الاستوديو، نؤمن بأن قص الشعر أكثر من مجرد روتين - إنه تجربة. حلاقونا المحترفون مكرسون لهذه الحرفة، يجمعون بين التقنيات التقليدية والاتجاهات الحديثة لتقديم نتائج استثنائية. لقد أنشأنا مساحة يمكنك فيها الاسترخاء والاستجمام والمغادرة وأنت تشعر بأفضل ما لديك.',
    features: [
      {
        id: 1,
        nameEn: 'Precision First',
        nameAr: 'الدقة أولاً',
        icon_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAq9JuykUcJlOhUUGezf3tRLmEMnwrqZZDZp-Zz-YkaTcnzsI4r3RASZuQGZVlgKNt9qCkP8lG4YFqqSTvUtCojgwBUoQbrfC1PJyiGtGOZMssF9rmx18npyIIM16qu6dob-6ukP626riJ6fgZDzEcdLsBiN4RQC4I9TIdYMYCaOswJ4vAzQvT3N8vemVN3_zVNwXj4QSDl-C-OsnU90hYxqltS0FzCggjWKCgBU5dDiwFtLMXPELgfPlL6ms0Pb9EOLxdJFkBCWI4'
      },
      {
        id: 2,
        nameEn: 'Comfort & Style',
        nameAr: 'الراحة والأناقة',
        icon_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAq9JuykUcJlOhUUGezf3tRLmEMnwrqZZDZp-Zz-YkaTcnzsI4r3RASZuQGZVlgKNt9qCkP8lG4YFqqSTvUtCojgwBUoQbrfC1PJyiGtGOZMssF9rmx18npyIIM16qu6dob-6ukP626riJ6fgZDzEcdLsBiN4RQC4I9TIdYMYCaOswJ4vAzQvT3N8vemVN3_zVNwXj4QSDl-C-OsnU90hYxqltS0FzCggjWKCgBU5dDiwFtLMXPELgfPlL6ms0Pb9EOLxdJFkBCWI4'
      },
      {
        id: 3,
        nameEn: 'Premium Products',
        nameAr: 'منتجات مميزة',
        icon_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAq9JuykUcJlOhUUGezf3tRLmEMnwrqZZDZp-Zz-YkaTcnzsI4r3RASZuQGZVlgKNt9qCkP8lG4YFqqSTvUtCojgwBUoQbrfC1PJyiGtGOZMssF9rmx18npyIIM16qu6dob-6ukP626riJ6fgZDzEcdLsBiN4RQC4I9TIdYMYCaOswJ4vAzQvT3N8vemVN3_zVNwXj4QSDl-C-OsnU90hYxqltS0FzCggjWKCgBU5dDiwFtLMXPELgfPlL6ms0Pb9EOLxdJFkBCWI4'
      },
      {
        id: 4,
        nameEn: 'Respect for Time',
        nameAr: 'احترام الوقت',
        icon_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAq9JuykUcJlOhUUGezf3tRLmEMnwrqZZDZp-Zz-YkaTcnzsI4r3RASZuQGZVlgKNt9qCkP8lG4YFqqSTvUtCojgwBUoQbrfC1PJyiGtGOZMssF9rmx18npyIIM16qu6dob-6ukP626riJ6fgZDzEcdLsBiN4RQC4I9TIdYMYCaOswJ4vAzQvT3N8vemVN3_zVNwXj4QSDl-C-OsnU90hYxqltS0FzCggjWKCgBU5dDiwFtLMXPELgfPlL6ms0Pb9EOLxdJFkBCWI4'
      }
    ]
  },
  {
    id: 2,
    name: 'refining-the-art',
    title: 'Refining the Art',
    subtitle: 'Of Modern Grooming',
    icon: 'style',
    contentSummary: 'Custom Content Block, Rich Text',
    status: 'published',
    updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    titleEn: 'Refining the Art of Modern Grooming',
    titleAr: 'صقل فن العناية الحديثة',
    descriptionEn: 'We don\'t just cut hair; we cultivate confidence. Our philosophy is rooted in the belief that every detail matters. From the moment you walk in, to the final hot towel finish, we are dedicated to providing an experience that transcends the ordinary.',
    descriptionAr: 'نحن لا نقص الشعر فحسب؛ بل نغرس الثقة. فلسفتنا متجذرة في الاعتقاد بأن كل التفاصيل مهمة. من لحظة دخولك، إلى لمسة المنشفة الساخنة الأخيرة، نحن ملتزمون بتقديم تجربة تتجاوز العادي.',
    features: []
  }
]

export default InformativeSections
