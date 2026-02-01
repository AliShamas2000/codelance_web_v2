import React from 'react'
import InformativeSectionRow from '../InformativeSectionRow/InformativeSectionRow'

const InformativeSectionsTable = ({
  sections = [],
  onEdit,
  onDelete,
  className = ""
}) => {
  if (sections.length === 0) {
    return (
      <div className={`bg-white dark:bg-[#10221c] rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm overflow-hidden flex flex-col ${className}`}>
        <div className="text-center py-12">
          <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-600 mb-4">
            article
          </span>
          <p className="text-gray-500 dark:text-gray-400">No sections found</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white dark:bg-[#10221c] rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm overflow-hidden flex flex-col ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02]">
              <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Section Name
              </th>
              <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Content Summary
              </th>
              <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Last Updated
              </th>
              <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Status
              </th>
              <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-white/5">
            {sections.map((section) => (
              <InformativeSectionRow
                key={section.id}
                section={section}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default InformativeSectionsTable


