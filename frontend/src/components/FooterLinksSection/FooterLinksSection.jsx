import React from 'react'

const FooterLinksSection = ({
  footerLinks = [],
  onAddColumn,
  onUpdateColumn,
  onRemoveColumn,
  onAddLink,
  onUpdateLink,
  onRemoveLink,
  className = ""
}) => {
  const handleAddLinkToColumn = (columnIndex) => {
    const column = footerLinks[columnIndex]
    const newLink = { text: '', url: '' }
    const updatedLinks = [...(column.links || []), newLink]
    onAddLink && onAddLink(columnIndex, newLink)
  }

  const handleUpdateLinkInColumn = (columnIndex, linkIndex, field, value) => {
    const column = footerLinks[columnIndex]
    const updatedLinks = [...(column.links || [])]
    updatedLinks[linkIndex] = { ...updatedLinks[linkIndex], [field]: value }
    onUpdateLink && onUpdateLink(columnIndex, linkIndex, updatedLinks[linkIndex])
  }

  const handleRemoveLinkFromColumn = (columnIndex, linkIndex) => {
    onRemoveLink && onRemoveLink(columnIndex, linkIndex)
  }

  return (
    <div className={`bg-white dark:bg-card-dark rounded-xl shadow-soft border border-gray-100 dark:border-gray-700 p-6 ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
          <span className="material-symbols-outlined text-gray-400 mr-2">link</span>
          Footer Links
        </h2>
        <button
          onClick={onAddColumn}
          className="text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-2 py-1 rounded transition-colors"
        >
          + Col
        </button>
      </div>
      <div className="space-y-3">
        {footerLinks.map((column, columnIndex) => (
          <div
            key={column.id || columnIndex}
            className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 border border-gray-100 dark:border-gray-700"
          >
            <div className="flex justify-between items-center mb-2">
              <input
                className="bg-transparent border-none p-0 text-sm font-semibold text-gray-900 dark:text-white focus:ring-0 placeholder-gray-400 w-full"
                placeholder="Column Title"
                type="text"
                value={column.title || ''}
                onChange={(e) => onUpdateColumn && onUpdateColumn(columnIndex, { ...column, title: e.target.value })}
              />
              <button
                onClick={() => onRemoveColumn && onRemoveColumn(columnIndex)}
                className="text-xs text-gray-400 hover:text-red-500 transition-colors"
              >
                <span className="material-symbols-outlined text-base">delete</span>
              </button>
            </div>
            <div className="space-y-2">
              {(column.links || []).map((link, linkIndex) => (
                <div key={link.id || linkIndex} className="flex gap-2">
                  <input
                    className="w-1/2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-primary focus:border-primary outline-none dark:text-white"
                    placeholder="Text"
                    type="text"
                    value={link.text || ''}
                    onChange={(e) => handleUpdateLinkInColumn(columnIndex, linkIndex, 'text', e.target.value)}
                  />
                  <input
                    className="w-1/2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-primary focus:border-primary outline-none dark:text-white"
                    placeholder="URL"
                    type="text"
                    value={link.url || ''}
                    onChange={(e) => handleUpdateLinkInColumn(columnIndex, linkIndex, 'url', e.target.value)}
                  />
                  <button
                    onClick={() => handleRemoveLinkFromColumn(columnIndex, linkIndex)}
                    className="text-red-400 hover:text-red-500 transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">close</span>
                  </button>
                </div>
              ))}
              <button
                onClick={() => handleAddLinkToColumn(columnIndex)}
                className="w-full text-center text-xs text-primary dark:text-gray-300 font-medium py-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
              >
                + Add Link
              </button>
            </div>
          </div>
        ))}
        {footerLinks.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-4">No footer link columns added yet</p>
        )}
      </div>
    </div>
  )
}

export default FooterLinksSection


