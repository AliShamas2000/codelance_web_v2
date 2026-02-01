import React from 'react'

const ClientStatsCards = ({
  stats,
  className = ""
}) => {
  // Handle null/undefined stats
  if (!stats) {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 ${className}`}>
        {/* Total Clients */}
        <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Total Clients</h3>
          <div className="flex items-end gap-3">
            <span className="text-3xl font-bold">0</span>
            <span className="text-xs font-medium text-green-500 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full mb-1">
              +0 this month
            </span>
          </div>
        </div>

        {/* Active Regulars */}
        <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Active Regulars</h3>
          <div className="flex items-end gap-3">
            <span className="text-3xl font-bold">0</span>
            <span className="text-xs font-medium text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full mb-1">
              Last 60 days
            </span>
          </div>
        </div>

        {/* Retention Rate */}
        <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Retention Rate</h3>
          <div className="flex items-end gap-3">
            <span className="text-3xl font-bold">0%</span>
            <span className="text-xs font-medium text-green-500 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full mb-1">
              +0% vs avg
            </span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 ${className}`}>
      {/* Total Clients */}
      <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Total Clients</h3>
        <div className="flex items-end gap-3">
          <span className="text-3xl font-bold">{stats.totalClients || 0}</span>
          <span className="text-xs font-medium text-green-500 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full mb-1">
            +{stats.totalClientsChange || 0} this month
          </span>
        </div>
      </div>

      {/* Active Regulars */}
      <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Active Regulars</h3>
        <div className="flex items-end gap-3">
          <span className="text-3xl font-bold">{stats.activeRegulars || 0}</span>
          <span className="text-xs font-medium text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full mb-1">
            Last 60 days
          </span>
        </div>
      </div>

      {/* Retention Rate */}
      <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Retention Rate</h3>
        <div className="flex items-end gap-3">
          <span className="text-3xl font-bold">{stats.retentionRate || 0}%</span>
          <span className="text-xs font-medium text-green-500 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full mb-1">
            +{stats.retentionRateChange || 0}% vs avg
          </span>
        </div>
      </div>
    </div>
  )
}

export default ClientStatsCards


