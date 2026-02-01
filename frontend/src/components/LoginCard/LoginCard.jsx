import React from 'react'
import LoginForm from '../LoginForm/LoginForm'

const LoginCard = ({
  title = "Admin Portal",
  description = "Enter your credentials to access the secure management dashboard.",
  onSubmit,
  isLoading = false,
  showFooter = true,
  footerText = "Protected by reCAPTCHA and subject to the Privacy Policy.",
  className = ""
}) => {
  return (
    <div className={`bg-white dark:bg-[#152822] rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#e5e7eb] dark:border-[#2a3e36] overflow-hidden ${className}`}>
      {/* Card Header */}
      <div className="px-8 pt-10 pb-6 flex flex-col items-center text-center border-b border-[#f0f2f5] dark:border-[#2a3e36]">
        <div className="w-14 h-14 bg-gradient-to-br from-primary to-[#0fb57e] rounded-xl flex items-center justify-center mb-5 shadow-lg shadow-primary/20 transform rotate-3 hover:rotate-6 transition-transform duration-300">
          <span className="material-symbols-outlined text-white text-[32px]">admin_panel_settings</span>
        </div>
        {title && (
          <h1 className="text-[#111816] dark:text-white text-2xl font-bold leading-tight tracking-tight">
            {title}
          </h1>
        )}
        {description && (
          <p className="text-[#637588] dark:text-[#8d9ba8] text-sm font-medium mt-2 max-w-[260px]">
            {description}
          </p>
        )}
      </div>

      {/* Card Body / Form */}
      <div className="p-8 flex flex-col gap-5">
        <LoginForm
          onSubmit={onSubmit}
          isLoading={isLoading}
        />
      </div>

      {/* Card Footer */}
      {showFooter && footerText && (
        <div className="bg-[#fcfdfd] dark:bg-[#12221d] border-t border-[#f0f2f5] dark:border-[#2a3e36] px-8 py-4 flex justify-center">
          <p className="text-[#637588] dark:text-[#6b7280] text-xs font-medium">
            {footerText}
          </p>
        </div>
      )}
    </div>
  )
}

export default LoginCard

