import React from 'react'

const AboutTextSection = ({
  aboutEn = '',
  aboutAr = '',
  onAboutEnChange,
  onAboutArChange,
  className = ""
}) => {
  return (
    <div className={`bg-white dark:bg-card-dark rounded-xl shadow-soft border border-gray-100 dark:border-gray-700 p-6 ${className}`}>
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
        <span className="material-symbols-outlined text-gray-400 mr-2">description</span>
        About Text
      </h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Description (EN)
          </label>
          <textarea
            className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-2.5 text-sm focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none dark:text-white placeholder-gray-400 resize-none transition-colors"
            placeholder="Brief description about the barbershop..."
            rows="4"
            value={aboutEn}
            onChange={(e) => onAboutEnChange && onAboutEnChange(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Description (AR)
          </label>
          <textarea
            className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-2.5 text-sm focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none dark:text-white placeholder-gray-400 resize-none transition-colors font-arabic text-right"
            dir="rtl"
            placeholder="وصف موجز عن صالون الحلاقة..."
            rows="4"
            value={aboutAr}
            onChange={(e) => onAboutArChange && onAboutArChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}

export default AboutTextSection


