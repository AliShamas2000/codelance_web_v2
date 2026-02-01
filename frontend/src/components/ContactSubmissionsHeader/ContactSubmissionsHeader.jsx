import React from 'react'

const ContactSubmissionsHeader = ({
  className = ""
}) => {
  return (
    <header className={`mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 ${className}`}>
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Contact Submissions
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          View and manage contact form submissions from your website.
        </p>
      </div>
    </header>
  )
}

export default ContactSubmissionsHeader

