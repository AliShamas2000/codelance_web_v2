import React from 'react'

const AboutUsRow = ({
  section,
  onEdit,
  className = ""
}) => {
  const isActive = section.status === 'active' || section.status === true

  return (
    <tr className={`hover:bg-gray-50 dark:hover:bg-white/5 transition-colors ${
      section.isHighlighted ? 'bg-primary/5 dark:bg-primary/10 border-l-4 border-primary' : ''
    } ${className}`}>
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          {section.image || section.imageUrl ? (
            <img
              alt={section.titleEn || section.title || 'Section thumbnail'}
              className="h-10 w-16 rounded object-cover border border-gray-200 dark:border-gray-700"
              src={section.imageUrl || section.image || section.image_url}
            />
          ) : (
            <div className="h-10 w-16 bg-gray-100 dark:bg-white/10 rounded flex items-center justify-center text-gray-400">
              <span className="material-symbols-outlined text-sm">grid_view</span>
            </div>
          )}
          <span className={`font-medium text-text-main dark:text-white ${
            section.isHighlighted ? 'font-bold' : ''
          }`}>
            {section.titleEn || section.title || 'Untitled Section'}
          </span>
        </div>
      </td>
      <td className="px-6 py-4 text-text-muted hidden sm:table-cell">
        {section.type || 'Content Block'}
      </td>
      <td className="px-6 py-4 text-text-muted hidden md:table-cell">
        {section.lastUpdated || section.updated_at || section.updatedAt || 'N/A'}
      </td>
      <td className="px-6 py-4">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          isActive
            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
            : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
        }`}>
          {isActive ? 'Active' : 'Inactive'}
        </span>
      </td>
      <td className="px-6 py-4 text-right">
        <button
          onClick={() => onEdit && onEdit(section)}
          className={`transition-colors ${
            section.isHighlighted
              ? 'text-primary'
              : 'text-text-muted hover:text-primary'
          }`}
        >
          <span className="material-symbols-outlined text-xl">edit</span>
        </button>
      </td>
    </tr>
  )
}

export default AboutUsRow


