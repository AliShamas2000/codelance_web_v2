import React from 'react'

const InformativeSectionRow = ({
  section,
  onEdit,
  onDelete,
  className = ""
}) => {
  const name = section.name || section.key || 'Unknown'
  const title = section.title || section.titleEn || section.title_en || name
  const subtitle = section.subtitle || section.description || ''
  const contentSummary = section.contentSummary || section.content_summary || section.summary || ''
  const lastUpdated = section.updatedAt || section.updated_at || section.lastUpdated || section.last_updated || ''
  const status = section.status || 'draft'
  const icon = section.icon || 'article'

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Never'
    try {
      const date = new Date(dateString)
      const now = new Date()
      const diffTime = Math.abs(now - date)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      
      if (diffDays === 0) return 'Just now'
      if (diffDays === 1) return '1 day ago'
      if (diffDays < 7) return `${diffDays} days ago`
      if (diffDays < 30) {
        const weeks = Math.floor(diffDays / 7)
        return `${weeks} week${weeks > 1 ? 's' : ''} ago`
      }
      if (diffDays < 365) {
        const months = Math.floor(diffDays / 30)
        return `${months} month${months > 1 ? 's' : ''} ago`
      }
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    } catch (error) {
      return dateString
    }
  }

  // Get status badge styling
  const getStatusBadge = (status) => {
    const statusMap = {
      published: {
        className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
        label: 'Published'
      },
      draft: {
        className: 'bg-slate-100 text-slate-800 dark:bg-white/10 dark:text-slate-300',
        label: 'Draft'
      },
      hidden: {
        className: 'bg-gray-100 text-gray-800 dark:bg-white/5 dark:text-gray-400',
        label: 'Hidden'
      }
    }
    return statusMap[status] || statusMap.draft
  }

  const statusBadge = getStatusBadge(status)
  const isActive = status === 'published'

  return (
    <tr className={`group hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors ${isActive ? 'bg-primary/5 dark:bg-primary/5 border-l-4 border-l-primary' : ''} ${className}`}>
      {/* Section Name */}
      <td className="py-4 px-6">
        <div className="flex items-center gap-3">
          <div className={`size-10 rounded-lg ${
            isActive 
              ? 'bg-primary/10' 
              : 'bg-slate-100 dark:bg-white/10'
          } flex items-center justify-center ${
            isActive 
              ? 'text-primary' 
              : 'text-slate-500 dark:text-slate-300'
          }`}>
            <span className="material-symbols-outlined">{icon}</span>
          </div>
          <div>
            <p className="font-bold text-slate-900 dark:text-white text-sm">
              {title}
            </p>
            {subtitle && (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </td>

      {/* Content Summary */}
      <td className="py-4 px-6 text-sm text-slate-600 dark:text-slate-300">
        {contentSummary || '-'}
      </td>

      {/* Last Updated */}
      <td className="py-4 px-6 text-sm text-slate-500 dark:text-slate-400">
        {formatDate(lastUpdated)}
      </td>

      {/* Status */}
      <td className="py-4 px-6">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadge.className}`}>
          {statusBadge.label}
        </span>
      </td>

      {/* Actions */}
      <td className="py-4 px-6 text-right">
        <div className={`flex items-center justify-end gap-2 transition-opacity ${
          isActive ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'
        }`}>
          <button
            onClick={() => onEdit && onEdit(section)}
            className={`p-2 transition-colors ${
              isActive
                ? 'bg-white dark:bg-white/10 rounded-lg shadow-sm text-primary hover:bg-primary hover:text-white'
                : 'text-slate-400 hover:text-primary'
            }`}
            title="Edit"
          >
            <span className="material-symbols-outlined text-lg">edit</span>
          </button>
        </div>
      </td>
    </tr>
  )
}

export default InformativeSectionRow
