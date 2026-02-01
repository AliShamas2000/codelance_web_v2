import React, { useState } from 'react'
import PasswordInput from '../PasswordInput/PasswordInput'

const SecuritySection = ({
  formData,
  errors = {},
  onChange
}) => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    onChange && onChange(name, value)
  }

  return (
    <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
        <span className="material-symbols-outlined text-primary">lock</span>
        <h2 className="text-[#0e121b] dark:text-white text-xl font-bold">Change Password</h2>
      </div>
      <div className="grid grid-cols-1 gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-[#0e121b] dark:text-slate-200 text-sm font-medium">
            Current Password
          </label>
          <div className="relative">
            <input
              type={showCurrentPassword ? "text" : "password"}
              name="currentPassword"
              value={formData.currentPassword || ''}
              onChange={handleInputChange}
              placeholder="••••••••"
              className="form-input w-full rounded-lg border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-[#0e121b] dark:text-white h-11 px-4 text-sm focus:border-primary focus:ring-primary shadow-sm placeholder:text-slate-400"
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              <span className="material-symbols-outlined text-[20px]">
                {showCurrentPassword ? "visibility" : "visibility_off"}
              </span>
            </button>
          </div>
          {errors.currentPassword && (
            <p className="text-xs text-red-500">{errors.currentPassword}</p>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-[#0e121b] dark:text-slate-200 text-sm font-medium">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                name="newPassword"
                value={formData.newPassword || ''}
                onChange={handleInputChange}
                placeholder="••••••••"
                className="form-input w-full rounded-lg border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-[#0e121b] dark:text-white h-11 px-4 text-sm focus:border-primary focus:ring-primary shadow-sm placeholder:text-slate-400"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                <span className="material-symbols-outlined text-[20px]">
                  {showNewPassword ? "visibility" : "visibility_off"}
                </span>
              </button>
            </div>
            {errors.newPassword && (
              <p className="text-xs text-red-500">{errors.newPassword}</p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[#0e121b] dark:text-slate-200 text-sm font-medium">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword || ''}
                onChange={handleInputChange}
                placeholder="••••••••"
                className="form-input w-full rounded-lg border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-[#0e121b] dark:text-white h-11 px-4 text-sm focus:border-primary focus:ring-primary shadow-sm placeholder:text-slate-400"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                <span className="material-symbols-outlined text-[20px]">
                  {showConfirmPassword ? "visibility" : "visibility_off"}
                </span>
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-red-500">{errors.confirmPassword}</p>
            )}
          </div>
        </div>
        <div className="flex items-start gap-2 mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-[20px] mt-0.5">
            info
          </span>
          <p className="text-xs text-blue-800 dark:text-blue-200 leading-tight">
            Password must be at least 8 characters long and include a mix of letters, numbers, and symbols.
          </p>
        </div>
      </div>
    </div>
  )
}

export default SecuritySection

