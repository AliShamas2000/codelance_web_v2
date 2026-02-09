import React, { useState, useEffect, useRef } from 'react'
import CodelanceProcessStep from '../CodelanceProcessStep/CodelanceProcessStep'

const CodelanceProcessTimeline = ({
  steps = [],
  activeStepIndex = null, // If null, will be calculated from scroll
  className = ""
}) => {
  // Default steps if none provided
  const defaultSteps = [
    {
      stepNumber: "01",
      title: "Discovery",
      description: "We deep dive into your business goals, target audience, and technical requirements. Market research and competitive analysis form the foundation of our strategy.",
      icon: "search",
      position: "left"
    },
    {
      stepNumber: "02",
      title: "UI/UX Design",
      description: "Our design team crafts intuitive user journeys and stunning visual interfaces. We focus on accessibility, usability, and brand consistency across all touchpoints.",
      icon: "palette",
      position: "right"
    },
    {
      stepNumber: "03",
      title: "Development",
      description: "Our engineers write clean, scalable code using modern tech stacks. We build robust architectures that are performance-optimized and future-proofed.",
      icon: "code",
      position: "left"
    },
    {
      stepNumber: "04",
      title: "Testing",
      description: "Rigorous quality assurance ensures a bug-free experience. We conduct automated and manual testing, performance audits, and security vulnerability scans.",
      icon: "verified_user",
      position: "right"
    },
    {
      stepNumber: "05",
      title: "Launch",
      description: "We handle the deployment to production environments, ensuring zero downtime. Our team manages cloud configurations and environment stabilization.",
      icon: "rocket_launch",
      position: "left"
    },
    {
      stepNumber: "06",
      title: "Support",
      description: "Post-launch maintenance and continuous improvements keep your product ahead of the curve. We provide 24/7 monitoring and iterative feature updates.",
      icon: "support_agent",
      position: "right"
    }
  ]

  const processSteps = steps.length > 0 ? steps : defaultSteps
  const [currentActiveIndex, setCurrentActiveIndex] = useState(activeStepIndex !== null ? activeStepIndex : -1)
  const [scrollProgress, setScrollProgress] = useState(0)
  const timelineRef = useRef(null)
  const stepRefs = useRef([])

  useEffect(() => {
    // If activeStepIndex is provided, use it (for manual control)
    if (activeStepIndex !== null) {
      setCurrentActiveIndex(activeStepIndex)
      const manualProgress = ((activeStepIndex + 1) / processSteps.length) * 100
      setScrollProgress(manualProgress / 100)
      return
    }

    // Calculate scroll progress and active step
    const handleScroll = () => {
      if (!timelineRef.current) return

      const timeline = timelineRef.current
      const rect = timeline.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const scrollY = window.scrollY
      
      // rect.top is relative to viewport, so we need to add scrollY to get absolute position
      const timelineTop = rect.top + scrollY
      const timelineHeight = rect.height
      const timelineBottom = timelineTop + timelineHeight
      
      // Calculate progress based on scroll position
      // Animation starts when timeline top is at 20% of viewport from top
      // Animation ends when timeline bottom is at 80% of viewport from top
      const startTrigger = windowHeight * 0.2
      const endTrigger = windowHeight * 0.8
      
      // Current viewport position
      const viewportTop = scrollY
      
      // Calculate when animation should start and end
      const animationStart = timelineTop - startTrigger
      const animationEnd = timelineBottom - endTrigger
      const animationRange = animationEnd - animationStart
      
      let progress = 0
      
      if (viewportTop < animationStart) {
        // Before animation starts
        progress = 0
      } else if (viewportTop >= animationEnd) {
        // After animation completes
        progress = 1
      } else {
        // Within animation range - calculate smooth progress
        if (animationRange > 0) {
          const scrolled = viewportTop - animationStart
          progress = Math.max(0, Math.min(1, scrolled / animationRange))
        } else {
          progress = 1
        }
      }

      setScrollProgress(progress)

      // Determine which step should be active based on scroll position
      const viewportCenter = windowHeight / 2
      let activeIndex = -1

      stepRefs.current.forEach((stepRef, index) => {
        if (stepRef) {
          const stepRect = stepRef.getBoundingClientRect()
          // stepRect.top is relative to viewport
          const stepCenter = stepRect.top + stepRect.height / 2
          
          // If step center is above or at viewport center, mark it as active
          if (stepCenter <= viewportCenter + 100) {
            activeIndex = Math.max(activeIndex, index)
          }
        }
      })

      if (activeIndex !== -1) {
        setCurrentActiveIndex(activeIndex)
      }
    }

    // Throttle scroll events for better performance
    let ticking = false
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll()
          ticking = false
        })
        ticking = true
      }
    }

    // Initial calculation
    handleScroll()

    // Listen to scroll events
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [activeStepIndex, processSteps.length])

  // Calculate progress percentage for the timeline line
  // Use scrollProgress for smooth animation, or fallback to step-based calculation
  const progressPercentage = activeStepIndex !== null
    ? ((activeStepIndex + 1) / processSteps.length) * 100
    : Math.max(0, Math.min(100, scrollProgress * 100))

  return (
    <section 
      ref={timelineRef}
      className={`relative max-w-[1200px] mx-auto px-6 py-20 overflow-hidden ${className}`}
    >
      {/* Central Spine */}
      <div className="absolute left-1/2 top-0 bottom-0 w-[3px] -translate-x-1/2 bg-gray-200 dark:bg-gray-800 z-0">
        {/* Animated Progress Fill - smooth scroll-based animation */}
        <div 
          className="absolute top-0 w-full bg-primary shadow-[0_0_15px_rgba(0,176,240,0.6)]"
          style={{ 
            height: `${progressPercentage}%`,
            transition: 'height 0.1s ease-out'
          }}
        ></div>
      </div>

      <div className="space-y-20 md:space-y-24 relative z-10">
        {processSteps.map((step, index) => (
          <div
            key={index}
            ref={(el) => {
              if (el) stepRefs.current[index] = el
            }}
          >
            <CodelanceProcessStep
              stepNumber={step.stepNumber || String(index + 1).padStart(2, '0')}
              title={step.title}
              description={step.description}
              icon={step.icon || "code"}
              position={step.position || (index % 2 === 0 ? "left" : "right")}
              isActive={index <= currentActiveIndex}
            />
          </div>
        ))}
      </div>
    </section>
  )
}

export default CodelanceProcessTimeline

