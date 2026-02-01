import React from 'react'

const AddTeamMemberCard = ({
  onClick,
  className = ""
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-gray-50 dark:bg-gray-800/30 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 p-6 flex flex-col justify-center items-center text-center group hover:border-gray-300 dark:hover:border-gray-600 transition-colors cursor-pointer h-full min-h-[300px] ${className}`}
    >
      <div className="w-16 h-16 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
        <span className="material-symbols-outlined text-3xl text-gray-400 group-hover:text-primary dark:group-hover:text-white">add</span>
      </div>
      <h3 className="font-bold text-gray-900 dark:text-white text-base">
        Add Team Member
      </h3>
      <p className="text-xs text-gray-500 mt-2 max-w-[200px]">
        Register a new barber to the system and set up their profile.
      </p>
    </div>
  )
}

export default AddTeamMemberCard


