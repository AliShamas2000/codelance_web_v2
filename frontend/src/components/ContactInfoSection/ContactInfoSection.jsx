import React from 'react'
import PhoneInput from '../PhoneInput/PhoneInput'

const ContactInfoSection = ({
  phone = '',
  email = '',
  address = '',
  onPhoneChange,
  onEmailChange,
  onAddressChange,
  className = ""
}) => {
  return (
    <div className={`bg-white dark:bg-card-dark rounded-xl shadow-soft border border-gray-100 dark:border-gray-700 p-6 ${className}`}>
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
        <span className="material-symbols-outlined text-gray-400 mr-2">contact_phone</span>
        Contact Info
      </h2>
      <div className="space-y-4">
        <PhoneInput
          label="Phone Number"
          value={phone}
          onChange={(e) => onPhoneChange && onPhoneChange(e.target.value)}
          placeholder="Enter phone number"
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 pointer-events-none">
              <span className="material-symbols-outlined text-sm">email</span>
            </span>
            <input
              className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg pl-9 pr-4 py-2.5 text-sm focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none dark:text-white placeholder-gray-400 transition-colors"
              placeholder="info@sadekcuts.com"
              type="email"
              value={email}
              onChange={(e) => onEmailChange && onEmailChange(e.target.value)}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Physical Address
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 pointer-events-none">
              <span className="material-symbols-outlined text-sm">location_on</span>
            </span>
            <textarea
              className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg pl-9 pr-4 py-2.5 text-sm focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none dark:text-white placeholder-gray-400 resize-none transition-colors"
              placeholder="123 Blade Street, Soho, New York, NY 10012"
              rows="2"
              value={address}
              onChange={(e) => onAddressChange && onAddressChange(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactInfoSection


