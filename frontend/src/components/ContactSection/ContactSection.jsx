import React from 'react'
import ContactInfoPanel from '../ContactInfoPanel/ContactInfoPanel'
import AppointmentForm from '../AppointmentForm/AppointmentForm'

const ContactSection = ({
  // Info Panel Props
  infoPanelProps = {},

  // Form Props
  formProps = {},

  // Styling
  className = ""
}) => {
  return (
    <section className={`w-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden ${className}`}>
      {/* Abstract Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-white to-transparent dark:from-surface-dark opacity-50 pointer-events-none -z-10"></div>
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10"></div>
      <div className="absolute top-1/2 -left-24 w-72 h-72 bg-blue-100/20 dark:bg-blue-900/10 rounded-full blur-3xl -z-10"></div>

      {/* Main Container */}
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 shadow-2xl shadow-black/5 bg-surface-light dark:bg-surface-dark rounded-2xl overflow-hidden border border-white/50 dark:border-white/5">
        {/* Left Panel: Context & Info (Desktop only) */}
        <ContactInfoPanel {...infoPanelProps} />

        {/* Right Panel: Form */}
        <div className="col-span-1 lg:col-span-8 p-6 sm:p-10 lg:p-12">
          <div className="mb-8">
            <h1 className="text-3xl font-black tracking-tight text-text-main dark:text-white mb-2">
              Book Your Appointment
            </h1>
            <p className="text-text-muted dark:text-gray-400">
              Select a time that works best for you. No payment required now.
            </p>
          </div>
          <AppointmentForm
            initialData={formProps.initialData}
            onSubmit={formProps.onSubmit}
            isLoading={formProps.isLoading}
            availableTimeSlots={formProps.availableTimeSlots}
            unavailableTimeSlots={formProps.unavailableTimeSlots}
            availableDates={formProps.availableDates}
            unavailableDates={formProps.unavailableDates}
            onDateSelect={formProps.onDateSelect}
            barbers={formProps.barbers || []}
            services={formProps.services || []}
            onBarberChange={formProps.onBarberChange}
            onServicesChange={formProps.onServicesChange}
          />
        </div>
      </div>
    </section>
  )
}

export default ContactSection

