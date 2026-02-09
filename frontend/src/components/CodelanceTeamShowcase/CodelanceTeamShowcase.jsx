import React from 'react'

const CodelanceTeamShowcase = ({
  teamMembers = [],
  className = ""
}) => {
  // Take first 2 active team members
  const displayMembers = teamMembers
    .filter(member => member.status !== 'inactive' && member.status !== 'leave')
    .slice(0, 2)

  // Format member data
  const formatMember = (member) => {
    const fullName = member.name || 
      `${member.first_name || ''} ${member.last_name || ''}`.trim() ||
      member.full_name ||
      'Team Member'

    const jobTitle = member.job_title || 
      member.role || 
      member.position ||
      'Team Member'

    const imageUrl = member.imageUrl || 
      member.profile_photo || 
      member.profile_photo_url || 
      member.avatar || 
      member.image ||
      member.photo_url ||
      null

    const email = member.email || null
    const phone = member.phone || null
    const bio = member.bio || member.quote || null

    // Get social links
    const socialLinks = member.socialLinks || 
      member.social_media_links || 
      member.socialMediaLinks || 
      member.social_links ||
      []

    return {
      id: member.id,
      name: fullName,
      jobTitle,
      imageUrl,
      email,
      phone,
      bio,
      socialLinks
    }
  }

  return (
    <section className={`py-16 ${className}`} id="team">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 w-full">
        {/* Header */}
        <div className="flex flex-col items-center mb-12 text-center">
          <span className="text-primary text-sm font-black tracking-[0.4em] uppercase mb-4">
            Leadership Collective
          </span>
          <h1 className="text-navy-deep dark:text-white text-4xl lg:text-5xl font-black text-center mb-4">
            The Minds Behind CODELANCE
          </h1>
          <div className="w-24 h-1 bg-primary rounded-full" style={{ width: '120px' }}></div>
          <p className="text-navy-light dark:text-gray-400 text-lg max-w-2xl leading-relaxed mt-6">
            Our core leadership drives innovation with a focused approach to engineering excellence and strategic digital transformation.
          </p>
        </div>

        {/* Team Members Grid */}
        {displayMembers.length === 0 ? (
          <div className="text-center py-12 text-navy-light dark:text-gray-400">
            <p>No team members available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 max-w-[900px] mx-auto">
            {displayMembers.map((member, index) => {
              const formatted = formatMember(member)
              
              return (
                <div
                  key={formatted.id || index}
                  className="profile-card bg-white dark:bg-gray-800 p-6 lg:p-8 shadow-[0_15px_40px_rgba(0,43,73,0.06)] dark:shadow-[0_15px_40px_rgba(0,0,0,0.3)] flex flex-col h-full border border-navy-dark/5 dark:border-gray-700 rounded-2xl transition-all duration-600 ease-out hover:-translate-y-3 hover:shadow-[0_40px_80px_-15px_rgba(0,43,73,0.15),0_0_25px_5px_rgba(0,174,239,0.08)]"
                  style={{
                    animation: `heroFadeInUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards`,
                    animationDelay: `${index * 0.2}s`,
                    opacity: 0
                  }}
                >
                  {/* Image Container */}
                  <div className="image-container relative aspect-square overflow-hidden rounded-xl mb-6 transition-transform duration-800 ease-out group-hover:scale-105">
                    {formatted.imageUrl ? (
                      <img
                        src={formatted.imageUrl}
                        alt={formatted.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/20 to-navy-dark/20 flex items-center justify-center">
                        <span className="material-symbols-outlined text-4xl text-primary/40">
                          person
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/20 to-transparent"></div>
                  </div>

                  {/* Content */}
                  <div className="flex flex-col grow">
                    {/* Name and Title */}
                    <div className="mb-6">
                      <h3 className="text-navy-deep dark:text-white text-2xl lg:text-3xl font-extrabold mb-2">
                        {formatted.name}
                      </h3>
                      <p className="text-primary font-bold text-sm uppercase tracking-widest">
                        {formatted.jobTitle}
                      </p>
                    </div>

                    {/* Bio/Quote */}
                    {formatted.bio && (
                      <div className="mb-6">
                        <span className="material-symbols-outlined text-primary/40 text-3xl mb-2 block">
                          format_quote
                        </span>
                        <blockquote className="italic text-navy-deep dark:text-white text-lg lg:text-xl leading-relaxed font-medium">
                          "{formatted.bio}"
                        </blockquote>
                      </div>
                    )}

                    {/* Contact Info */}
                    {(formatted.email || formatted.phone) && (
                      <div className="space-y-3 mb-6 pt-6 border-t border-navy-dark/5 dark:border-gray-700">
                        {formatted.email && (
                          <div className="flex items-center gap-3 group/link">
                            <span className="material-symbols-outlined text-primary text-xl">mail</span>
                            <a
                              className="text-navy-deep dark:text-white text-base font-semibold hover:text-primary transition-colors"
                              href={`mailto:${formatted.email}`}
                            >
                              {formatted.email}
                            </a>
                          </div>
                        )}
                        {formatted.phone && (
                          <div className="flex items-center gap-3 group/link">
                            <span className="material-symbols-outlined text-primary text-xl">call</span>
                            <a
                              className="text-navy-deep dark:text-white text-base font-semibold hover:text-primary transition-colors"
                              href={`tel:${formatted.phone}`}
                            >
                              {formatted.phone}
                            </a>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Social Links */}
                    {formatted.socialLinks && formatted.socialLinks.length > 0 && (
                      <div className="mt-auto flex gap-3">
                        {formatted.socialLinks.map((link, linkIndex) => {
                          const platform = link.platform || link.platform_name || ''
                          const url = link.url || link.link || '#'
                          const iconMap = {
                            linkedin: 'share',
                            twitter: 'share',
                            github: 'code',
                            instagram: 'photo_camera',
                            facebook: 'share',
                            website: 'language'
                          }
                          const icon = iconMap[platform.toLowerCase()] || 'share'

                          return (
                            <a
                              key={linkIndex}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-10 h-10 rounded-full bg-background-light dark:bg-gray-700 flex items-center justify-center text-navy-deep dark:text-white hover:bg-primary hover:text-white transition-all transform hover:scale-110"
                            >
                              <span className="material-symbols-outlined text-lg">{icon}</span>
                            </a>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <style>{`
        @keyframes heroFadeInUp {
          from {
            opacity: 0;
            transform: translateY(60px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  )
}

export default CodelanceTeamShowcase

