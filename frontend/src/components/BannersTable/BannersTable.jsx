import React from 'react'
import BannerRow from '../BannerRow/BannerRow'

const BannersTable = ({
  banners = [],
  onEdit,
  onDelete,
  className = ""
}) => {
  if (banners.length === 0) {
    return (
      <div className={`bg-white dark:bg-[#152a23] rounded-xl border border-gray-200 dark:border-white/5 shadow-sm overflow-hidden ${className}`}>
        <div className="text-center py-12">
          <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-600 mb-4">
            image
          </span>
          <p className="text-gray-500 dark:text-gray-400">No banners found</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white dark:bg-[#152a23] rounded-xl border border-gray-200 dark:border-white/5 shadow-sm overflow-hidden ${className}`}>
      <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
        <thead className="bg-gray-50 dark:bg-black/20 text-xs uppercase font-semibold text-slate-500 border-b border-gray-200 dark:border-white/5">
          <tr>
            <th className="px-6 py-4">Preview</th>
            <th className="px-6 py-4">Banner Title</th>
            <th className="px-6 py-4">Target URL</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-white/5">
          {banners.map((banner) => (
            <BannerRow
              key={banner.id}
              banner={banner}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default BannersTable


