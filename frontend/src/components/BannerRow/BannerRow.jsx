import React from 'react'

const BannerRow = ({
  banner,
  onEdit,
  onDelete,
  className = ""
}) => {
  const desktopImage = banner.desktopImage || banner.desktop_image || banner.image_desktop || ''
  const title = banner.title || banner.name || 'Untitled Banner'
  const targetUrl = banner.buttonUrl || banner.button_url || banner.target_url || ''
  const isActive = banner.isActive !== undefined ? banner.isActive : (banner.is_active !== undefined ? banner.is_active : banner.status === 'active')

  return (
    <tr className={`hover:bg-gray-50 dark:hover:bg-white/5 transition-colors ${className}`}>
      {/* Preview */}
      <td className="px-6 py-4">
        <div className="w-24 h-10 bg-gray-200 dark:bg-white/10 rounded overflow-hidden">
          {desktopImage ? (
            <img
              src={desktopImage}
              alt={title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-primary/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-sm">image</span>
            </div>
          )}
        </div>
      </td>

      {/* Banner Title */}
      <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
        {title}
      </td>

      {/* Target URL */}
      <td className="px-6 py-4 text-slate-500">
        {targetUrl || '-'}
      </td>

      {/* Status */}
      <td className="px-6 py-4">
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
          isActive
            ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400'
            : 'bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-400'
        }`}>
          {isActive ? 'Active' : 'Inactive'}
        </span>
      </td>

      {/* Actions */}
      <td className="px-6 py-4 text-right">
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => onEdit && onEdit(banner)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
            title="Edit"
          >
            <span className="material-symbols-outlined text-[20px]">edit</span>
          </button>
          <button
            onClick={() => onDelete && onDelete(banner)}
            className="text-slate-400 hover:text-red-500 transition-colors"
            title="Delete"
          >
            <span className="material-symbols-outlined text-[20px]">delete</span>
          </button>
        </div>
      </td>
    </tr>
  )
}

export default BannerRow


