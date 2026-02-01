import React from 'react'
import AboutUsRow from '../AboutUsRow/AboutUsRow'

const AboutUsTable = ({
  sections = [],
  onEdit,
  className = ""
}) => {
  if (sections.length === 0) {
    return (
      <div className={`bg-white dark:bg-[#10221c] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-12 text-center ${className}`}>
        <span className="material-symbols-outlined text-4xl text-gray-400 mb-4">layers</span>
        <p className="text-text-muted">No sections found</p>
      </div>
    )
  }

  return (
    <div className={`bg-white dark:bg-[#10221c] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden ${className}`}>
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-50 dark:bg-white/5 text-text-muted border-b border-gray-100 dark:border-gray-800">
          <tr>
            <th className="px-6 py-4 font-medium uppercase tracking-wider text-xs">Section Name</th>
            <th className="px-6 py-4 font-medium hidden sm:table-cell uppercase tracking-wider text-xs">Type</th>
            <th className="px-6 py-4 font-medium hidden md:table-cell uppercase tracking-wider text-xs">Last Updated</th>
            <th className="px-6 py-4 font-medium uppercase tracking-wider text-xs">Status</th>
            <th className="px-6 py-4 font-medium text-right uppercase tracking-wider text-xs">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
          {sections.map((section, index) => (
            <AboutUsRow
              key={section.id || index}
              section={section}
              onEdit={onEdit}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default AboutUsTable


