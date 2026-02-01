import React, { useState, useEffect } from 'react'
import ClientsHeader from '../../../components/ClientsHeader/ClientsHeader'
import ClientStatsCards from '../../../components/ClientStatsCards/ClientStatsCards'
import ClientsTable from '../../../components/ClientsTable/ClientsTable'
import ClientsPagination from '../../../components/ClientsPagination/ClientsPagination'
import AddClientModal from '../../../components/AddClientModal/AddClientModal'
import ViewClientHistoryModal from '../../../components/ViewClientHistoryModal/ViewClientHistoryModal'
import DeleteClientModal from '../../../components/DeleteClientModal/DeleteClientModal'
import AddClientNoteModal from '../../../components/AddClientNoteModal/AddClientNoteModal'
import SuccessMessageModal from '../../../components/SuccessMessageModal/SuccessMessageModal'
import barberApi from '../../../api/barber'
import { useBarberUserContext } from '../../../contexts/BarberUserContext'

const Clients = () => {
  const [clients, setClients] = useState([])
  const [stats, setStats] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false)
  const [isViewHistoryModalOpen, setIsViewHistoryModalOpen] = useState(false)
  const [isDeleteClientModalOpen, setIsDeleteClientModalOpen] = useState(false)
  const [isAddNoteModalOpen, setIsAddNoteModalOpen] = useState(false)
  const [selectedClientId, setSelectedClientId] = useState(null)
  const [selectedClient, setSelectedClient] = useState(null)
  const [clientToDelete, setClientToDelete] = useState(null)
  const [clientForNote, setClientForNote] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [filters, setFilters] = useState({
    search: '',
    sortBy: 'recent_visit',
    status: 'all'
  })
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  })
  const { user } = useBarberUserContext()

  useEffect(() => {
    fetchClients()
    fetchStats()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.search, filters.sortBy, filters.status, pagination.currentPage])

  const fetchClients = async () => {
    setIsLoading(true)
    try {
      const data = await barberApi.getClients({
        page: pagination.currentPage,
        per_page: pagination.itemsPerPage,
        search: filters.search,
        sort_by: filters.sortBy,
        status: filters.status
      })
      // API returns {success: true, clients: [...], pagination: {...}}
      const clientsData = data.clients || data.data || []
      setClients(clientsData)
      if (data.pagination) {
        setPagination(prev => ({
          ...prev,
          totalPages: data.pagination.total_pages || data.pagination.totalPages || 1,
          totalItems: data.pagination.total || data.pagination.totalItems || 0
        }))
      }
    } catch (error) {
      console.error('Error fetching clients:', error)
      // Set empty array on error instead of default data
      setClients([])
    } finally {
      setIsLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await barberApi.getClientStats()
      // API returns {success: true, data: {...}}
      const statsData = response.data || response
      setStats(statsData || {
        totalClients: 0,
        totalClientsChange: 0,
        activeRegulars: 0,
        retentionRate: 0,
        retentionRateChange: 0
      })
    } catch (error) {
      console.error('Error fetching client stats:', error)
      // Set default stats on error
      setStats({
        totalClients: 0,
        totalClientsChange: 0,
        activeRegulars: 0,
        retentionRate: 0,
        retentionRateChange: 0
      })
    }
  }

  const handleSearchChange = (value) => {
    setFilters(prev => ({ ...prev, search: value }))
    setPagination(prev => ({ ...prev, currentPage: 1 }))
  }

  const handleSortChange = (value) => {
    setFilters(prev => ({ ...prev, sortBy: value }))
    setPagination(prev => ({ ...prev, currentPage: 1 }))
  }

  const handleFilterChange = (value) => {
    setFilters(prev => ({ ...prev, status: value }))
    setPagination(prev => ({ ...prev, currentPage: 1 }))
  }

  const handleAddClient = () => {
    setIsAddClientModalOpen(true)
  }

  const handleCloseAddClientModal = () => {
    setIsAddClientModalOpen(false)
  }

  const handleAddClientSubmit = async (formData) => {
    setIsSubmitting(true)
    try {
      await barberApi.addClient({
        name: formData.name,
        phone: formData.phone
      })
      // Refresh clients list and stats
      fetchClients()
      fetchStats()
      handleCloseAddClientModal()
      setSuccessMessage('Client added successfully!')
      setIsSuccessModalOpen(true)
    } catch (error) {
      console.error('Error adding client:', error)
      alert('Failed to add client. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleExportCSV = async () => {
    try {
      await barberApi.exportClientsCSV()
      // You can add a success notification here
    } catch (error) {
      console.error('Error exporting CSV:', error)
      alert('Failed to export CSV. Please try again.')
    }
  }

  const handleViewProfile = (clientId) => {
    const client = clients.find(c => c.id === clientId)
    setSelectedClientId(clientId)
    setSelectedClient(client)
    setIsViewHistoryModalOpen(true)
  }

  const handleCloseViewHistoryModal = () => {
    setIsViewHistoryModalOpen(false)
    setSelectedClientId(null)
    setSelectedClient(null)
  }

  const handleBookAppointmentFromHistory = (clientId, clientData) => {
    // Navigate to booking or open booking modal with pre-filled client
    console.log('Book appointment for client:', clientId, clientData)
    // You can integrate with BookAppointmentModal here
  }

  const handleMessage = (clientId) => {
    // Open message modal or navigate to messaging
    console.log('Message client:', clientId)
  }

  const handleAddNote = (clientId) => {
    const client = clients.find(c => c.id === clientId)
    setClientForNote(client)
    setIsAddNoteModalOpen(true)
  }

  const handleCloseAddNoteModal = () => {
    setIsAddNoteModalOpen(false)
    setClientForNote(null)
  }

  const handleSaveNote = async (clientId, noteData) => {
    setIsSubmitting(true)
    try {
      const client = clients.find(c => c.id === clientId)
      if (client) {
        await barberApi.updateClientNotes(clientId, {
          notes: noteData.notes || noteData,
          phone: client.phone
        })
      }
      // Refresh clients list to get updated notes
      await fetchClients()
      handleCloseAddNoteModal()
    } catch (error) {
      console.error('Error saving note:', error)
      alert('Failed to save note. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = (clientId) => {
    const client = clients.find(c => c.id === clientId)
    setClientToDelete(client)
    setIsDeleteClientModalOpen(true)
  }

  const handleCloseDeleteClientModal = () => {
    setIsDeleteClientModalOpen(false)
    setClientToDelete(null)
  }

  const handleConfirmDelete = async (clientId, clientData) => {
    setIsSubmitting(true)
    try {
      // Pass phone number as query parameter
      await barberApi.deleteClient(clientId, { phone: clientData?.phone })
      // Refresh clients list and stats
      await fetchClients()
      await fetchStats()
      handleCloseDeleteClientModal()
    } catch (error) {
      console.error('Error deleting client:', error)
      alert('Failed to delete client. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePrevious = () => {
    if (pagination.currentPage > 1) {
      setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))
    }
  }

  const handleNext = () => {
    if (pagination.currentPage < pagination.totalPages) {
      setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))
    }
  }

  // Use actual data from API, provide defaults if null
  const statsData = stats || {
    totalClients: 0,
    totalClientsChange: 0,
    activeRegulars: 0,
    retentionRate: 0,
    retentionRateChange: 0
  }
  const clientsData = clients

  return (
    <>
      <main className="flex-grow p-6 lg:p-10 overflow-y-auto h-screen lg:ml-64 w-full">
          <div className="mx-auto max-w-6xl relative">
            {isLoading && clients.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center bg-background-light/80 dark:bg-background-dark/80 z-10 rounded-lg">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-gray-500 dark:text-gray-400">Loading clients...</p>
                </div>
              </div>
            )}
            <ClientsHeader
              onAddClient={handleAddClient}
              onExportCSV={handleExportCSV}
            />

            <ClientStatsCards stats={statsData} />

            <ClientsTable
              clients={clientsData}
              filters={filters}
              onSearchChange={handleSearchChange}
              onSortChange={handleSortChange}
              onFilterChange={handleFilterChange}
              onViewProfile={handleViewProfile}
              onMessage={handleMessage}
              onDelete={handleDelete}
              onAddNote={handleAddNote}
            />

            <ClientsPagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              totalItems={pagination.totalItems}
              itemsPerPage={pagination.itemsPerPage}
              onPrevious={handlePrevious}
              onNext={handleNext}
            />
          </div>
      </main>

      {/* Add Client Modal */}
      <AddClientModal
        isOpen={isAddClientModalOpen}
        onClose={handleCloseAddClientModal}
        onSubmit={handleAddClientSubmit}
        isLoading={isSubmitting}
      />

      {/* View Client History Modal */}
      <ViewClientHistoryModal
        isOpen={isViewHistoryModalOpen}
        onClose={handleCloseViewHistoryModal}
        clientId={selectedClientId}
        client={selectedClient}
        onBookAppointment={handleBookAppointmentFromHistory}
      />

      {/* Delete Client Modal */}
      <DeleteClientModal
        isOpen={isDeleteClientModalOpen}
        onClose={handleCloseDeleteClientModal}
        onConfirm={handleConfirmDelete}
        client={clientToDelete}
        isLoading={isSubmitting}
      />

      {/* Add Client Note Modal */}
      <AddClientNoteModal
        isOpen={isAddNoteModalOpen}
        onClose={handleCloseAddNoteModal}
        onSave={handleSaveNote}
        client={clientForNote}
        isLoading={isSubmitting}
      />

      {/* Success Message Modal */}
      <SuccessMessageModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        message={successMessage}
      />
    </>
  )
}

// Default data (fallback when API is not available)
const getDefaultStats = () => ({
  totalClients: 148,
  totalClientsChange: 12,
  activeRegulars: 86,
  retentionRate: 92,
  retentionRateChange: 2
})

const getDefaultClients = () => [
  {
    id: 'CLI-001',
    name: 'Marcus Johnson',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDVSV886SLw3hcSlQZ227aEJWQlbM52YMr6WlaKIqi6653jLjpdvQ7Nb-xzu54l6piWbhNHJDTZN0OgJecsuM3k7BqbtzL2HJSbW99FEMxcVTmA3WunwwSa4MZSaQKgJSAfU-i5f2dDFrCYUeijwiigiOXiMm4VEa-iBmRJ4aZ5MDJ8s-ePPVpsWIYoWIQFkdc0-7JGmrR2dpemNUL0vbB8COBsKppIYmoeSOgq7qE43Qjv6fb3YM2H6oMgdAcfzyIth6V129yPHNw',
    phone: '+1 (555) 012-3456',
    email: 'marcus.j@example.com',
    totalVisits: 15,
    lastVisit: '2023-10-10',
    lastVisitService: 'Fade & Beard Trim',
    status: 'active',
    sinceDate: 'Jan 2022'
  },
  {
    id: 'CLI-002',
    name: 'David Chen',
    initials: 'DC',
    phone: '+1 (555) 987-6543',
    email: 'david.chen@example.com',
    totalVisits: 8,
    lastVisit: 'Today, 2:30 PM',
    lastVisitService: 'Classic Haircut',
    status: 'active',
    sinceDate: 'Mar 2023'
  },
  {
    id: 'CLI-003',
    name: 'Sarah Williams',
    initials: 'SW',
    phone: '+1 (555) 456-7890',
    email: 'sarah.w@example.com',
    totalVisits: 3,
    lastVisit: '2023-09-28',
    lastVisitService: 'Hair Coloring',
    status: 'new',
    sinceDate: 'Aug 2023'
  },
  {
    id: 'CLI-004',
    name: 'Michael Ross',
    initials: 'MR',
    phone: '+1 (555) 222-3333',
    email: 'mike.ross@example.com',
    totalVisits: 24,
    lastVisit: '2023-09-15',
    lastVisitService: 'Beard Grooming',
    status: 'inactive',
    sinceDate: 'Jan 2021'
  },
  {
    id: 'CLI-005',
    name: 'James Lee',
    initials: 'JL',
    phone: '+1 (555) 777-8888',
    email: 'j.lee@example.com',
    totalVisits: 6,
    lastVisit: '2023-10-05',
    lastVisitService: 'Classic Haircut',
    status: 'active',
    sinceDate: 'Feb 2023'
  }
]

export default Clients

