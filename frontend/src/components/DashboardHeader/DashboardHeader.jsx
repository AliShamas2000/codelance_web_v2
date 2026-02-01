import React from 'react'

const DashboardHeader = ({
  title = "Dashboard Overview",
  subtitle,
  userName,
  className = ""
}) => {
  return (
    <header className={`mb-8 ${className}`}>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        {title}
      </h1>
      {subtitle || userName ? (
        <p className="text-gray-500 dark:text-gray-400">
          {subtitle || `Welcome ${userName}, here is your daily summary.`}
        </p>
      ) : null}
    </header>
  )
}

export default DashboardHeader



