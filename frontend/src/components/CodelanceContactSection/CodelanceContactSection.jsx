import React from 'react'
import CodelanceContactHeader from '../CodelanceContactHeader/CodelanceContactHeader'
import CodelanceContactInfo from '../CodelanceContactInfo/CodelanceContactInfo'
import CodelanceContactSocial from '../CodelanceContactSocial/CodelanceContactSocial'
import CodelanceContactForm from '../CodelanceContactForm/CodelanceContactForm'

const CodelanceContactSection = ({
  title = "Let's Build",
  titleHighlight = "Something Great",
  description = "Have a vision for the next big thing? Our team of experts is ready to transform your ideas into world-class digital solutions.",
  contactItems = [
    {
      type: 'email',
      label: 'Email',
      value: 'hello@codelance.tech',
      icon: 'mail'
    },
    {
      type: 'phone',
      label: 'Phone',
      value: '+1 (555) 000-CODELANCE',
      icon: 'call'
    },
    {
      type: 'address',
      label: 'Address',
      value: 'Tech Hub Plaza, Silicon Valley, CA',
      icon: 'location_on'
    }
  ],
  socialLinks = [
    {
      name: 'LinkedIn',
      icon: 'linkedin',
      href: '#'
    },
    {
      name: 'GitHub',
      icon: 'github',
      href: '#'
    },
    {
      name: 'Twitter',
      icon: 'twitter',
      href: '#'
    }
  ],
  projects = [],
  onSubmit = null,
  className = ""
}) => {
  return (
    <section className={`relative min-h-screen flex items-center justify-center pt-24 pb-12 overflow-hidden bg-background-light dark:bg-background-dark ${className}`} id="contact">
      {/* Floating Animated Background Blobs */}
      <div className="blob w-96 h-96 bg-primary top-[-10%] left-[-5%] rounded-full"></div>
      <div className="blob w-[500px] h-[500px] bg-primary/30 bottom-[-10%] right-[-5%] rounded-full"></div>
      <div className="blob w-72 h-72 bg-primary/20 top-1/2 left-1/3 rounded-full"></div>

      <div className="relative z-10 w-full max-w-7xl px-6 md:px-20 grid lg:grid-cols-2 gap-16 items-center">
        {/* Left Side: Copy & Info */}
        <div className="space-y-12">
          <CodelanceContactHeader
            title={title}
            titleHighlight={titleHighlight}
            description={description}
          />

          <CodelanceContactInfo
            contactItems={contactItems}
          />

          <CodelanceContactSocial
            socialLinks={socialLinks}
          />
        </div>

        {/* Right Side: Contact Form */}
        <CodelanceContactForm
          projects={projects}
          onSubmit={onSubmit}
          key="contact-form" // Force re-render if onSubmit changes
        />
      </div>
    </section>
  )
}

export default CodelanceContactSection

