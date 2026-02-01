import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardHeader from '../../../components/DashboardHeader/DashboardHeader'
import { useAdminUserContext } from '../../../contexts/AdminUserContext'
import DateRangeFilter from '../../../components/DateRangeFilter/DateRangeFilter'
import StatCard from '../../../components/StatCard/StatCard'
import QuickActionButton from '../../../components/QuickActionButton/QuickActionButton'
import ActivityLogItem from '../../../components/ActivityLogItem/ActivityLogItem'
import AppointmentTable from '../../../components/AppointmentTable/AppointmentTable'
import dashboardApi from '../../../api/dashboard'
import authApi from '../../../api/auth'

const Dashboard = () => {
  const navigate = useNavigate()
  const { user } = useAdminUserContext()
  const [stats, setStats] = useState(null)
  const [appointments, setAppointments] = useState([])
  const [activities, setActivities] = useState([])
  // Set default dates to current month
  const getDefaultFromDate = () => {
    const today = new Date()
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
    return firstDay.toISOString().split('T')[0] // YYYY-MM-DD format
  }

  const getDefaultToDate = () => {
    const today = new Date()
    return today.toISOString().split('T')[0] // YYYY-MM-DD format
  }

  const [filters, setFilters] = useState({
    fromDate: getDefaultFromDate(),
    toDate: getDefaultToDate()
  })
  const [isLoading, setIsLoading] = useState(true)


  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setIsLoading(true)
      const data = await dashboardApi.getDashboardData(filters)
      setStats(data.stats)
      setAppointments(data.appointments || [])
      setActivities(data.activities || [])
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      // Set empty states on error
      setStats({
        pending: 0,
        accepted: 0,
        rejected: 0,
        completed: 0,
        total: 0
      })
      setAppointments([])
      setActivities([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [filters])


  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleRefresh = () => {
    fetchDashboardData()
  }

  const handleReset = () => {
    setFilters({
      fromDate: getDefaultFromDate(),
      toDate: getDefaultToDate()
    })
  }

  return (
    <>
      <DashboardHeader
        userName={user?.name || "Admin"}
      />

      {/* Filters */}
      <DateRangeFilter
        fromDate={filters.fromDate}
        toDate={filters.toDate}
        onFromDateChange={(value) => handleFilterChange('fromDate', value)}
        onToDateChange={(value) => handleFilterChange('toDate', value)}
        onRefresh={handleRefresh}
        onReset={handleReset}
        className="mb-8"
      />

      {/* Stats Section */}
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Appointment Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          label="Pending"
          value={stats?.pending ?? 0}
          icon="hourglass_empty"
          color="yellow"
          progress={stats?.total ? Math.round((stats.pending / stats.total) * 100) : 0}
          description="Requires immediate attention"
        />
        <StatCard
          label="Accepted"
          value={stats?.accepted ?? 0}
          icon="event_available"
          color="indigo"
          progress={stats?.total ? Math.round((stats.accepted / stats.total) * 100) : 0}
          description="Upcoming appointments"
        />
        <StatCard
          label="Rejected"
          value={stats?.rejected ?? 0}
          icon="event_busy"
          color="red"
          progress={stats?.total ? Math.round((stats.rejected / stats.total) * 100) : 0}
          description="Check details for reason"
        />
        <StatCard
          label="Completed"
          value={stats?.completed ?? 0}
          icon="check_circle"
          color="green"
          progress={stats?.total ? Math.round((stats.completed / stats.total) * 100) : 0}
          description="Finished appointments"
        />
      </div>

      {/* Appointments Table */}
      <AppointmentTable
        appointments={appointments}
        onViewAll={() => navigate('/admin/appointments')}
        onActionClick={(appointment) => console.log('Action clicked:', appointment)}
      />
    </>
  )
}

// Default data (fallback when API is not available)
const getDefaultStats = () => ({
  pending: 24,
  accepted: 86,
  rejected: 7,
  completed: 342
})

const getDefaultAppointments = () => [
  {
    id: "#APT-29",
    clientName: "ali555 Shamasse",
    dateTime: "Dec 22, 18:53",
    service: "General Consultation",
    status: "accepted"
  },
  {
    id: "#APT-28",
    clientName: "John Smith",
    dateTime: "Dec 22, 17:00",
    service: "Web Development",
    status: "pending"
  },
  {
    id: "#APT-27",
    clientName: "Sarah Johnson",
    dateTime: "Dec 22, 15:57",
    service: "SEO Audit",
    status: "pending"
  },
  {
    id: "#APT-26",
    clientName: "Michael Brown",
    dateTime: "Dec 21, 11:28",
    service: "Consultation",
    status: "rejected"
  },
  {
    id: "#APT-25",
    clientName: "Emily Davis",
    dateTime: "Dec 21, 01:43",
    service: "Follow-up",
    status: "accepted"
  }
]

const getDefaultActivities = () => [
  {
    id: 1,
    title: "Updated 'About Us' Page",
    description: "Administrator updated the company history section and team photos.",
    timestamp: "25 mins ago",
    type: "edit"
  },
  {
    id: 2,
    title: "New Appointment Request",
    description: 'Client "Sarah Conner" requested a consultation for Web Development.',
    timestamp: "1 hour ago",
    type: "notification"
  },
  {
    id: 3,
    title: "New Banner Added",
    description: "A new promotional banner was added to the homepage slider.",
    timestamp: "3 hours ago",
    type: "add"
  }
]

export default Dashboard
