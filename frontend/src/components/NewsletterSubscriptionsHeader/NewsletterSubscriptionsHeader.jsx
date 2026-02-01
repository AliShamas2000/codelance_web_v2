import React from 'react'

const NewsletterSubscriptionsHeader = ({
  className = ""
}) => {
  return (
    <header className={`mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 ${className}`}>
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Newsletter Subscriptions
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Manage newsletter subscriptions and subscriber list.
        </p>
      </div>
    </header>
  )
}

export default NewsletterSubscriptionsHeader

