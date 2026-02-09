import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useScrollReveal from '../../hooks/useScrollReveal'

const CodelanceAbout = ({
  title = "Who We Are",
  description = "CODELANCE is a premier technology agency dedicated to sculpting the digital landscape of tomorrow. We bridge the gap between complex engineering and human-centric design, delivering high-performance solutions that empower enterprises to thrive in an ever-evolving market.",
  stats = [
    { value: "150+", label: "Projects Delivered" },
    { value: "8+", label: "Years Experience" },
    { value: "< 2hr", label: "Support Response" }
  ],
  primaryButtonText = "Our Mission",
  primaryButtonAction = null,
  secondaryButtonText = "View Team",
  secondaryButtonAction = null,
  showIllustrations = true,
  codeSnippet = {
    mission: "Excellence",
    stack: ["AI", "Cloud"],
    deliver: true
  }
}) => {
  const navigate = useNavigate()

  const handlePrimaryClick = () => {
    if (primaryButtonAction) {
      primaryButtonAction()
    } else {
      // Default action - could navigate to mission page
      navigate('/about')
    }
  }

  const handleSecondaryClick = () => {
    if (secondaryButtonAction) {
      secondaryButtonAction()
    } else {
      // Default action - could navigate to team page
      navigate('/team')
    }
  }

  // Scroll reveal animation states
  const [isVisible, sectionRef] = useScrollReveal({ threshold: 0.2 })
  const statsCount = stats?.length || 0
  const [statsVisible, setStatsVisible] = useState(() => Array(statsCount).fill(false))

  // Update statsVisible array when stats change
  useEffect(() => {
    setStatsVisible(Array(statsCount).fill(false))
  }, [statsCount])

  // Animate stats with staggered delay when section becomes visible
  useEffect(() => {
    if (isVisible && stats && stats.length > 0) {
      stats.forEach((_, index) => {
        setTimeout(() => {
          setStatsVisible(prev => {
            const newState = [...prev]
            newState[index] = true
            return newState
          })
        }, index * 150) // 150ms delay between each stat
      })
    }
  }, [isVisible, stats])

  return (
    <section 
      ref={sectionRef}
      className="min-h-screen lg:py-32 py-16 flex items-center bg-background-light dark:bg-background-dark overflow-hidden" 
      id="about"
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 w-full grid lg:grid-cols-2 gap-16 items-center">
        {/* Left Side: Illustrations */}
        {showIllustrations && (
          <div className={`relative h-[600px] flex items-center justify-center lg:order-1 order-1 transition-all duration-1000 ease-out ${
            isVisible 
              ? 'opacity-100 translate-x-0' 
              : 'opacity-0 -translate-x-8'
          }`}>
            <div className="relative w-full h-full max-w-lg">
              {/* Glass Card - Top Left */}
              <div className="absolute top-0 left-0 w-3/4 glass-card rounded-2xl shadow-xl p-6 transform -rotate-3 z-10 floating h-64">
                <div className="flex gap-2 mb-6">
                  <div className="w-2 h-2 rounded-full bg-primary/30"></div>
                  <div className="w-2 h-2 rounded-full bg-primary/30"></div>
                  <div className="w-2 h-2 rounded-full bg-primary/30"></div>
                </div>
                <div className="space-y-4">
                  <div className="h-4 w-1/2 bg-navy-deep/5 dark:bg-white/5 rounded"></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-20 bg-primary/5 rounded-xl border border-primary/10"></div>
                    <div className="h-20 bg-primary/5 rounded-xl border border-primary/10"></div>
                  </div>
                  <div className="h-4 w-full bg-navy-deep/5 dark:bg-white/5 rounded"></div>
                </div>
              </div>

              {/* Code Snippet Card - Bottom Right */}
              <div className="absolute bottom-10 right-0 w-3/4 h-56 bg-navy-deep dark:bg-navy-deep rounded-2xl shadow-2xl p-6 transform rotate-6 z-20">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="font-mono text-xs space-y-2 opacity-80">
                  <p className="text-primary">const codelance = {'{'}</p>
                  <p className="pl-4 text-white">
                    mission: <span className="text-yellow-200">'{codeSnippet.mission}'</span>,
                  </p>
                  <p className="pl-4 text-white">
                    stack: [<span className="text-yellow-200">'{codeSnippet.stack.join("', '")}'</span>],
                  </p>
                  <p className="pl-4 text-white">
                    deliver: () =&gt; <span className="text-primary">{codeSnippet.deliver ? 'true' : 'false'}</span>
                  </p>
                  <p className="text-primary">{'}'};</p>
                </div>
              </div>

              {/* Animated Circle */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 border-primary/20 rounded-full animate-ping opacity-20"></div>

              {/* Icon Badge */}
              <div className="absolute top-1/4 right-1/4 w-12 h-12 bg-primary rounded-full shadow-lg shadow-primary/40 flex items-center justify-center text-white z-30">
                <span className="material-symbols-outlined !text-xl">bolt</span>
              </div>
            </div>
          </div>
        )}

        {/* Right Side: Content */}
        <div className="flex flex-col space-y-10 lg:order-2 order-2 text-center lg:text-left">
          <div className={`space-y-6 transition-all duration-1000 ease-out delay-200 ${
            isVisible 
              ? 'opacity-100 translate-x-0' 
              : 'opacity-0 translate-x-8'
          }`}>
            <h2 className="text-4xl md:text-5xl font-extrabold text-navy-deep dark:text-white line-draw inline-block">
              {title}
            </h2>
            {description && (
              <div className="max-w-xl">
                <p className="text-lg md:text-xl text-navy-deep/80 dark:text-white/80 leading-relaxed">
                  {description}
                </p>
              </div>
            )}
          </div>

          {/* Stats Grid */}
          {stats && stats.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 w-full">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className={`glass-card p-6 rounded-3xl border border-white/60 dark:border-white/10 shadow-sm flex flex-col gap-2 transition-all duration-1000 ease-out w-full ${
                    statsVisible[index]
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-8'
                  }`}
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  <span className="text-3xl font-extrabold text-navy-deep dark:text-white">
                    {stat.value}
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-navy-deep/60 dark:text-white/60 leading-tight">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </section>
  )
}

export default CodelanceAbout

