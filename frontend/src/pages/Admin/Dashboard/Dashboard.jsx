import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardHeader from '../../../components/DashboardHeader/DashboardHeader'
import { useAdminUserContext } from '../../../contexts/AdminUserContext'
import DateRangeFilter from '../../../components/DateRangeFilter/DateRangeFilter'
import StatCard from '../../../components/StatCard/StatCard'
import dashboardApi from '../../../api/dashboard'

const Dashboard = () => {
  const navigate = useNavigate()
  const { user } = useAdminUserContext()
  const [stats, setStats] = useState(null)
  const [recentActivity, setRecentActivity] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Set default dates to current month
  const getDefaultFromDate = () => {
    const today = new Date()
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
    return firstDay.toISOString().split('T')[0]
  }

  const getDefaultToDate = () => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }

  const [filters, setFilters] = useState({
    fromDate: getDefaultFromDate(),
    toDate: getDefaultToDate()
  })

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setIsLoading(true)
      const response = await dashboardApi.getDashboardData({
        from_date: filters.fromDate,
        to_date: filters.toDate
      })
      
      // Handle response structure: response.data contains { statistics, recent_activity }
      if (response && response.success !== false) {
        const data = response.data || response
        
        if (data && data.statistics) {
          setStats(data.statistics)
          setRecentActivity(data.recent_activity || [])
        } else {
          // If statistics is missing, create empty structure but still render
          setStats({
            contact_submissions: { total: 0, new: 0, read: 0, replied: 0 },
            newsletter_subscriptions: { total: 0, active: 0, unsubscribed: 0 },
            projects: { total: 0, active: 0, featured: 0 },
            reviews: { total: 0, active: 0, featured: 0 },
            services: { total: 0, active: 0 },
            packages: { total: 0, active: 0, featured: 0 },
            process_steps: { total: 0, active: 0 },
            about_us_content: { total: 0, active: 0 },
            team_members: { total: 0, active: 0 }
          })
          setRecentActivity([])
        }
      } else {
        // Response indicates failure
        setStats(null)
        setRecentActivity([])
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      // On error, set null so we show the error message
      setStats(null)
      setRecentActivity([])
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

  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return 'Just now'
    const date = new Date(timestamp)
    const now = new Date()
    const diffInSeconds = Math.floor((now - date) / 1000)
    
    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} mins ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`
    return date.toLocaleDateString()
  }

  const getActivityIcon = (type) => {
    const icons = {
      contact_submission: 'mail',
      newsletter_subscription: 'campaign',
      project: 'folder',
      review: 'star',
      service: 'build',
      package: 'inventory',
      process_step: 'settings',
      about_us_content: 'info',
      team_member: 'person'
    }
    return icons[type] || 'notifications'
  }

  const getActivityColor = (type) => {
    const colors = {
      contact_submission: 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-300',
      newsletter_subscription: 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-300',
      project: 'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-300',
      review: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-300',
      service: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-300',
      package: 'bg-pink-100 text-pink-600 dark:bg-pink-900/20 dark:text-pink-300',
      process_step: 'bg-cyan-100 text-cyan-600 dark:bg-cyan-900/20 dark:text-cyan-300',
      about_us_content: 'bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-300',
      team_member: 'bg-teal-100 text-teal-600 dark:bg-teal-900/20 dark:text-teal-300'
    }
    return colors[type] || 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
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

      {isLoading ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <p>Loading dashboard data...</p>
        </div>
      ) : stats && Object.keys(stats).length > 0 ? (
        <>
          {/* Contact Submissions Statistics */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Contact Submissions</h2>
              <button
                onClick={() => navigate('/admin/contact-submissions')}
                className="text-sm text-primary hover:text-[#0eb37d] font-medium flex items-center gap-1"
              >
                View All
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                label="Total Submissions"
                value={stats?.contact_submissions?.total ?? stats?.contactSubmissions?.total ?? 0}
                icon="mail"
                color="blue"
                onClick={() => navigate('/admin/contact-submissions')}
              />
              <StatCard
                label="New"
                value={stats?.contact_submissions?.new ?? stats?.contactSubmissions?.new ?? 0}
                icon="mark_email_unread"
                color="yellow"
                onClick={() => navigate('/admin/contact-submissions?status=new')}
              />
              <StatCard
                label="Read"
                value={stats?.contact_submissions?.read ?? stats?.contactSubmissions?.read ?? 0}
                icon="drafts"
                color="indigo"
                onClick={() => navigate('/admin/contact-submissions?status=read')}
              />
              <StatCard
                label="Replied"
                value={stats?.contact_submissions?.replied ?? stats?.contactSubmissions?.replied ?? 0}
                icon="reply"
                color="green"
                onClick={() => navigate('/admin/contact-submissions?status=replied')}
              />
            </div>
          </div>

          {/* Newsletter Subscriptions Statistics */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Newsletter Subscriptions</h2>
              <button
                onClick={() => navigate('/admin/newsletter-subscriptions')}
                className="text-sm text-primary hover:text-[#0eb37d] font-medium flex items-center gap-1"
              >
                View All
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard
                label="Total Subscribers"
                value={stats?.newsletter_subscriptions?.total ?? stats?.newsletterSubscriptions?.total ?? 0}
                icon="campaign"
                color="green"
                onClick={() => navigate('/admin/newsletter-subscriptions')}
              />
              <StatCard
                label="Active"
                value={stats?.newsletter_subscriptions?.active ?? stats?.newsletterSubscriptions?.active ?? 0}
                icon="check_circle"
                color="green"
                onClick={() => navigate('/admin/newsletter-subscriptions?status=active')}
              />
              <StatCard
                label="Unsubscribed"
                value={stats?.newsletter_subscriptions?.unsubscribed ?? stats?.newsletterSubscriptions?.unsubscribed ?? 0}
                icon="cancel"
                color="gray"
                onClick={() => navigate('/admin/newsletter-subscriptions?status=unsubscribed')}
              />
            </div>
          </div>

          {/* Content Overview */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Content Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                label="Projects"
                value={stats?.projects?.total ?? 0}
                icon="folder"
                color="purple"
                description={`${stats?.projects?.active ?? 0} active, ${stats?.projects?.featured ?? 0} featured`}
                onClick={() => navigate('/admin/projects')}
              />
              <StatCard
                label="Reviews"
                value={stats?.reviews?.total ?? 0}
                icon="star"
                color="yellow"
                description={`${stats?.reviews?.active ?? 0} active, ${stats?.reviews?.featured ?? 0} featured`}
                onClick={() => navigate('/admin/reviews')}
              />
              <StatCard
                label="Services"
                value={stats?.services?.total ?? 0}
                icon="build"
                color="indigo"
                description={`${stats?.services?.active ?? 0} active`}
                onClick={() => navigate('/admin/services')}
              />
              <StatCard
                label="Packages"
                value={stats?.packages?.total ?? 0}
                icon="inventory"
                color="pink"
                description={`${stats?.packages?.active ?? 0} active, ${stats?.packages?.featured ?? 0} featured`}
                onClick={() => navigate('/admin/packages')}
              />
            </div>
          </div>

          {/* Additional Statistics */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Additional Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                label="Process Steps"
                value={stats?.process_steps?.total ?? stats?.processSteps?.total ?? 0}
                icon="settings"
                color="cyan"
                description={`${stats?.process_steps?.active ?? stats?.processSteps?.active ?? 0} active`}
                onClick={() => navigate('/admin/process-steps')}
              />
              <StatCard
                label="About Us Content"
                value={stats?.about_us_content?.total ?? stats?.aboutUsContent?.total ?? 0}
                icon="info"
                color="orange"
                description={`${stats?.about_us_content?.active ?? stats?.aboutUsContent?.active ?? 0} active`}
                onClick={() => navigate('/admin/about-us-content')}
              />
              <StatCard
                label="Team Members"
                value={stats?.team_members?.total ?? stats?.teamMembers?.total ?? 0}
                icon="groups"
                color="teal"
                description={`${stats?.team_members?.active ?? stats?.teamMembers?.active ?? 0} active`}
                onClick={() => navigate('/admin/team')}
              />
            </div>
          </div>

          {/* Recent Activity */}
          {recentActivity && recentActivity.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent Activity</h2>
              </div>
              <div className="bg-white dark:bg-card-dark rounded-xl shadow-soft border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                  {recentActivity.map((activity, index) => (
                    <div
                      key={index}
                      className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
                      onClick={() => activity.url && navigate(activity.url)}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${getActivityColor(activity.type)}`}>
                          <span className="material-symbols-outlined text-lg">
                            {getActivityIcon(activity.type)}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                            {activity.title}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {activity.description}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                            {formatTimeAgo(activity.timestamp)}
                          </p>
                        </div>
                        {activity.url && (
                          <span className="material-symbols-outlined text-gray-400 text-sm">
                            chevron_right
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <p>No dashboard data available</p>
        </div>
      )}
    </>
  )
}

export default Dashboard
