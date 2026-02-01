import React from 'react'
import CodelanceTeamCard from '../CodelanceTeamCard/CodelanceTeamCard'

const CodelanceTeamGrid = ({
  teamMembers = [],
  onMemberClick = null,
  columns = 4,
  className = ""
}) => {
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  }

  if (teamMembers.length === 0) {
    return (
      <div className="text-center py-12 text-[#5e808d] dark:text-gray-400">
        <p>No team members available at the moment.</p>
      </div>
    )
  }

  return (
    <div className={`grid ${gridCols[columns] || gridCols[4]} gap-8 ${className}`}>
      {teamMembers.map((member, index) => {
        // Format name from first_name and last_name or use name field
        const fullName = member.name || 
          `${member.first_name || ''} ${member.last_name || ''}`.trim() ||
          member.full_name ||
          'Team Member'

        // Format job title - backend returns 'role' field for job_title
        const jobTitle = member.role || 
          member.job_title || 
          member.position ||
          'Team Member'

        // Get profile image - backend returns 'imageUrl' field
        const imageUrl = member.imageUrl || 
          member.profile_photo || 
          member.profile_photo_url || 
          member.avatar || 
          member.image ||
          member.photo_url ||
          null

        // Format social links - backend returns 'socialLinks' array
        const socialLinks = member.socialLinks || 
          member.social_media_links || 
          member.socialMediaLinks || 
          member.social_links ||
          []

        return (
          <CodelanceTeamCard
            key={member.id || index}
            id={member.id}
            name={fullName}
            jobTitle={jobTitle}
            imageUrl={imageUrl}
            imageAlt={`${fullName} - ${jobTitle}`}
            socialLinks={socialLinks}
            onClick={onMemberClick}
            className=""
          />
        )
      })}
    </div>
  )
}

export default CodelanceTeamGrid

