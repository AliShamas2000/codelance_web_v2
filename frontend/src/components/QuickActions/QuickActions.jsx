import React from 'react'
import { useNavigate } from 'react-router-dom'

const QuickActions = ({ 
  onAddClient,
  onBlockTime,
  className = "" 
}) => {
  const navigate = useNavigate()

  const actions = [
    {
      icon: 'person_add',
      label: 'Add Client',
      onClick: onAddClient || (() => navigate('/barber/clients/new'))
    },
    {
      icon: 'block',
      label: 'Block Time',
      onClick: onBlockTime || (() => console.log('Block time'))
    },
    {
      icon: 'history',
      label: 'History',
      onClick: () => navigate('/barber/history')
    },
    {
      icon: 'settings',
      label: 'Settings',
      onClick: () => navigate('/barber/settings')
    }
  ]

  return (
    <div className={`bg-surface-light dark:bg-surface-dark rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 ${className}`}>
      <h3 className="font-bold text-lg mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className="flex flex-col items-center justify-center p-4 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-primary/10 hover:text-primary transition-colors group"
          >
            <span className="material-symbols-outlined mb-2 group-hover:scale-110 transition-transform">
              {action.icon}
            </span>
            <span className="text-xs font-medium">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default QuickActions
