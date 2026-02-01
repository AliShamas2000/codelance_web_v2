import React, { useState, useEffect } from 'react'
import TeamHeader from '../../../components/TeamHeader/TeamHeader'
import TeamFilters from '../../../components/TeamFilters/TeamFilters'
import TeamMemberCard from '../../../components/TeamMemberCard/TeamMemberCard'
import AddTeamMemberCard from '../../../components/AddTeamMemberCard/AddTeamMemberCard'
import TeamPagination from '../../../components/TeamPagination/TeamPagination'
import AddTeamMemberModal from '../../../components/AddTeamMemberModal/AddTeamMemberModal'
import ViewTeamMemberModal from '../../../components/ViewTeamMemberModal/ViewTeamMemberModal'
import teamApi from '../../../api/team'
import authApi from '../../../api/auth'

const Team = () => {
  const [teamMembers, setTeamMembers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [selectedMember, setSelectedMember] = useState(null)
  const [viewingMember, setViewingMember] = useState(null)
  const [viewingMemberStats, setViewingMemberStats] = useState(null)
  const [viewingMemberAppointments, setViewingMemberAppointments] = useState([])
  const [viewingMemberAvailability, setViewingMemberAvailability] = useState(null)
  const [isLoadingDetails, setIsLoadingDetails] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [filters, setFilters] = useState({
    search: '',
    status: 'all'
  })
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 12
  })


  // Fetch team members
  const fetchTeamMembers = async () => {
    try {
      setIsLoading(true)
      const response = await teamApi.getTeamMembers({
        page: pagination.currentPage,
        per_page: pagination.itemsPerPage,
        search: filters.search,
        status: filters.status
      })
      
      setTeamMembers(response.data || response.members || response || [])
      setPagination(prev => ({
        ...prev,
        totalPages: response.total_pages || response.totalPages || 1,
        totalItems: response.total || response.totalItems || 0
      }))
    } catch (error) {
      console.error('Error fetching team members:', error)
      // Use default data if API fails
      setTeamMembers(getDefaultTeamMembers())
      setPagination(prev => ({
        ...prev,
        totalPages: 1,
        totalItems: getDefaultTeamMembers().length
      }))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTeamMembers()
  }, [pagination.currentPage, filters])

  const handleSearchChange = (value) => {
    setFilters(prev => ({ ...prev, search: value }))
    setPagination(prev => ({ ...prev, currentPage: 1 }))
  }

  const handleStatusChange = (value) => {
    setFilters(prev => ({ ...prev, status: value }))
    setPagination(prev => ({ ...prev, currentPage: 1 }))
  }

  const handleSort = () => {
    // TODO: Implement sort functionality
    console.log('Sort clicked')
  }

  const handleAddNew = () => {
    setSelectedMember(null)
    setIsModalOpen(true)
  }

  const handleViewDetails = async (member) => {
    setViewingMember(member)
    setIsViewModalOpen(true)
    setIsLoadingDetails(true)

    try {
      // Fetch detailed information for the member
      const [detailsResponse, statsResponse, appointmentsResponse, availabilityResponse] = await Promise.allSettled([
        teamApi.getTeamMemberDetails(member.id),
        teamApi.getTeamMemberStats(member.id),
        teamApi.getTeamMemberAppointments(member.id, { limit: 3 }),
        teamApi.getTeamMemberAvailability(member.id)
      ])

      // Handle details response
      if (detailsResponse.status === 'fulfilled') {
        const data = detailsResponse.value
        setViewingMember(data.member || data)
        setViewingMemberStats(data.stats || null)
        setViewingMemberAppointments(data.appointments || data.upcomingAppointments || [])
        setViewingMemberAvailability(data.availability || null)
      } else {
        // Fallback: use individual API calls
        if (statsResponse.status === 'fulfilled') {
          setViewingMemberStats(statsResponse.value.stats || statsResponse.value)
        }
        if (appointmentsResponse.status === 'fulfilled') {
          setViewingMemberAppointments(appointmentsResponse.value.data || appointmentsResponse.value.appointments || [])
        }
        if (availabilityResponse.status === 'fulfilled') {
          setViewingMemberAvailability(availabilityResponse.value.availability || availabilityResponse.value)
        }
      }
    } catch (error) {
      console.error('Error fetching member details:', error)
      // Use default/fallback data
      setViewingMemberStats({
        totalAppointments: member.totalAppointments || 0,
        satisfactionRate: member.satisfactionRate || 0,
        averageRating: member.rating || 0
      })
      setViewingMemberAppointments([])
      setViewingMemberAvailability(null)
    } finally {
      setIsLoadingDetails(false)
    }
  }

  const handleEdit = (member) => {
    setSelectedMember(member)
    setIsModalOpen(true)
  }

  const handleDelete = async (member) => {
    try {
      await teamApi.deleteTeamMember(member.id)
      setIsViewModalOpen(false)
      setViewingMember(null)
      fetchTeamMembers()
    } catch (error) {
      console.error('Error deleting team member:', error)
      // TODO: Show error message to user
    }
  }

  const handleModalSubmit = async (formData) => {
    try {
      setIsSubmitting(true)
      
      // Prepare data for API
      const apiData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        jobTitle: formData.jobTitle,
        phone: formData.phone,
        email: formData.email,
        status: formData.status,
        profilePhoto: formData.profilePhoto,
        socialLinks: formData.socialLinks || []
      }
      
      // Only include password if provided
      if (formData.password) {
        apiData.password = formData.password
      }
      
      if (selectedMember) {
        // Update existing member
        await teamApi.updateTeamMember(selectedMember.id, apiData)
      } else {
        // Create new member
        await teamApi.createTeamMember(apiData)
      }
      
      setIsModalOpen(false)
      setSelectedMember(null)
      fetchTeamMembers()
    } catch (error) {
      console.error('Error saving team member:', error)
      alert(error.response?.data?.message || 'Failed to save team member. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, currentPage: page }))
  }

  return (
    <>
      <TeamHeader onAddNew={handleAddNew} />

      <TeamFilters
        search={filters.search}
        status={filters.status}
        onSearchChange={handleSearchChange}
        onStatusChange={handleStatusChange}
        onSort={handleSort}
      />

      {/* Team Members Grid */}
      {isLoading ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <p>Loading team members...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {teamMembers.map((member) => (
            <TeamMemberCard
              key={member.id}
              member={member}
              onViewDetails={handleViewDetails}
              onEdit={handleEdit}
            />
          ))}
          <AddTeamMemberCard onClick={handleAddNew} />
        </div>
      )}

      <TeamPagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        totalItems={pagination.totalItems}
        itemsPerPage={pagination.itemsPerPage}
        onPageChange={handlePageChange}
        className="mt-8"
      />

      <AddTeamMemberModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedMember(null)
        }}
        onSubmit={handleModalSubmit}
        member={selectedMember}
        isLoading={isSubmitting}
      />

      <ViewTeamMemberModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false)
          setViewingMember(null)
          setViewingMemberStats(null)
          setViewingMemberAppointments([])
          setViewingMemberAvailability(null)
        }}
        member={viewingMember}
        stats={viewingMemberStats}
        upcomingAppointments={viewingMemberAppointments}
        availability={viewingMemberAvailability}
        onEdit={handleEdit}
        isLoading={isLoadingDetails}
      />
    </>
  )
}

// Default team members data (fallback when API is not available)
const getDefaultTeamMembers = () => [
  {
    id: 1,
    firstName: 'Alex',
    lastName: 'Fade',
    name: 'Alex Fade',
    jobTitle: 'Senior Barber',
    status: 'active',
    bio: 'Expert in fades and classic cuts.',
    email: 'alex@barbershop.com',
    instagramHandle: 'alexfade',
    isFeatured: true,
    profilePhoto: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCwTxv0wJ7SdOyrOoWVfUdOPwqurVhqTh0PxIslcOpIzkGl2NX_lhQld0ne2D38mTJBk4ctbHpr3qyOywpaWluTCeigjsId9k4gqNm7YAEyxQFCK9tTIJMz_i_umgy3c5DfKsIV61uXy61fIt_B8kXkMTUD4Ix4gy4mOJBDECscWh5XsdvCgK3TQX97XHANovSCwRay_Zec39XrCSdqNs08mZ61jRVedXmnOy0BitdOyOF0XAgfhJPZfi0ydkhEgXxNsS_Vc8TZwbM'
  },
  {
    id: 2,
    firstName: 'Sam',
    lastName: 'Cut',
    name: 'Sam Cut',
    jobTitle: 'Shave Specialist',
    status: 'active',
    bio: 'Hot towel shaves & beard trims.',
    phone: '+1234567890',
    profilePhoto: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBFOm0i5Zoo2dO8bofPR4bOQvsW8kopFn-oBieXmXOG_OFystJoz1vfGdS67T8ecyUumSs9PdNlygb73ugIT0d4Lw55TxxIizhLYGtVmX7Cn9oyZzOlWutovt5pPzRqRX9wsEEZIE40a_iTIQ1E02Z0FBrOQaYx3DZAz-nl4xpWx4vTV9vvpa4FxOWdwBhxbBVdjkjrTcisN0QoUhC7xCgKEVLPp7sbf-9xNNddT3orcX8koL3PpuhNenurwAXn4CQ00Wr0HGApl0M'
  },
  {
    id: 3,
    firstName: 'Mike',
    lastName: 'Razor',
    name: 'Mike Razor',
    jobTitle: 'Junior Barber',
    status: 'active',
    bio: 'Passionate about modern styles.',
    email: 'mike@barbershop.com',
    instagramHandle: 'mikerazor',
    profilePhoto: 'https://lh3.googleusercontent.com/aida-public/AB6AXuASoGYTDtAMXUVcZXUyetjVtYAVTTU_isTyKWhdkNzaSjcF3Uzb1LjZvDlA1mpHAQ4eozx5GtBtB5ecUJ04bnQ31CrFbUzzFC-igt9xw9uPfxcwuLcfmr-vXAi9yMGKk2ixYZ_rl9kQ1kEXUE8BWuAaefoDpX-XhYc88wnfM3GhtiyAUyiYgQqFdZd3ROapaBpqpjQFMuEg5ANBo4Ltj-tU8Jc54fcMSH3GbR32Sllks7s7cpQd4mJn0C1k29n_iTt8mQGbarBIx3k'
  },
  {
    id: 4,
    firstName: 'Danny',
    lastName: 'Rookie',
    name: 'Danny Rookie',
    jobTitle: 'Apprentice',
    status: 'inactive',
    bio: 'Learning the trade.',
    profilePhoto: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCOBmrsxfynUR0w_7yRqmCmLiQZ9L7k5KqdPz8w4XvFjdkq3vXXhUTy7VstyvnoBQ3_XciEDqko0hqKxNMX7JQsrQsDCFlvHoLZl1BU6cjivWZnT-tBkD74iwYT94l99qFSn-5hVDG2bNh0o2IL7QRGJS3fd47l4Cz8xCjugnrrla3mcvUVUMSFzpp_NX2YXqgaQnUD3liaoabeQYAIF_eWTHC_jqvZo8viv7nHz-wQbbjCLy-wCzf2etwL0kOKlhnGD9i8jQR9l5A'
  }
]

export default Team

