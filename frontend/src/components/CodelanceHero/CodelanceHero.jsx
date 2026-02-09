import React from 'react'
import { useNavigate } from 'react-router-dom'
import useScrollReveal from '../../hooks/useScrollReveal'

const CodelanceHero = ({
  badge = "Innovating the Digital Future",
  title = "We Build Digital Experiences",
  titleHighlight = "Digital",
  description = "Websites, Mobile Apps, POS Systems, AI Solutions, and everything your business needs to scale in the modern era.",
  primaryButtonText = "Start a Project",
  primaryButtonAction = null,
  secondaryButtonText = "See Our Work",
  secondaryButtonAction = null,
  showIllustrations = true
}) => {
  const navigate = useNavigate()

  const handlePrimaryClick = () => {
    if (primaryButtonAction) {
      primaryButtonAction()
    } else {
      navigate('/contact')
    }
  }

  const handleSecondaryClick = () => {
    if (secondaryButtonAction) {
      secondaryButtonAction()
    } else {
      navigate('/portfolio')
    }
  }

  const [isVisible, ref] = useScrollReveal({ threshold: 0.1 })

  return (
    <main 
      id="home"
      ref={ref}
      className={`relative min-h-[110vh] md:min-h-screen flex items-center pt-16 md:pt-20 bg-mesh overflow-hidden transition-all duration-1000 ease-out ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-8'
      }`}
    >
      {/* Subtle Tech Shapes Background */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-[20%] left-[10%] size-64 border border-primary/20 rounded-full"></div>
        <div className="absolute bottom-[10%] right-[15%] size-96 border border-navy-deep/10 rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full">
          <svg className="stroke-primary/10" height="100%" width="100%">
            <pattern height="80" id="grid" patternUnits="userSpaceOnUse" width="80">
              <path d="M 80 0 L 0 0 0 80" fill="none" strokeWidth="0.5"></path>
            </pattern>
            <rect fill="url(#grid)" height="100%" width="100%"></rect>
          </svg>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 w-full grid lg:grid-cols-2 gap-8 lg:gap-16 items-center relative z-10">
        {/* Right Content: 3D/Glassy Illustration - First on mobile, second on desktop */}
        {showIllustrations && (
          <div className="relative block h-[430px] lg:h-[600px] w-full floating mt-0 lg:mt-0 order-1 lg:order-2">
            {/* POS Interface */}
            <div className="absolute top-[10%] right-0 w-[70%] lg:w-[80%] h-[250px] lg:h-[350px] glass-card rounded-2xl shadow-2xl p-4 lg:p-6 transform translate-x-4 lg:translate-x-10 rotate-3 z-0">
              <div className="flex justify-between items-center mb-3 lg:mb-6">
                <div className="h-4 lg:h-6 w-20 lg:w-32 bg-primary/20 rounded-full"></div>
                <div className="size-5 lg:size-8 rounded-full bg-navy-deep/10"></div>
              </div>
              <div className="grid grid-cols-3 gap-2 lg:gap-4">
                <div className="h-20 lg:h-32 bg-white/40 dark:bg-white/5 rounded-lg border border-white/30"></div>
                <div className="h-20 lg:h-32 bg-white/40 dark:bg-white/5 rounded-lg border border-white/30"></div>
                <div className="h-20 lg:h-32 bg-white/40 dark:bg-white/5 rounded-lg border border-white/30"></div>
                <div className="col-span-3 h-16 lg:h-24 bg-primary/5 rounded-lg border border-primary/20 flex items-center px-2 lg:px-4">
                  <div className="h-1.5 lg:h-2 w-24 lg:w-40 bg-primary/30 rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Web Interface */}
            <div className="absolute top-[25%] left-0 w-[75%] lg:w-[85%] h-[280px] lg:h-[400px] glass-card rounded-2xl shadow-2xl p-4 lg:p-8 transform -rotate-2 z-10 border-white/50">
              <div className="flex gap-1.5 lg:gap-2 mb-4 lg:mb-8">
                <div className="size-2 lg:size-3 rounded-full bg-red-400/60"></div>
                <div className="size-2 lg:size-3 rounded-full bg-yellow-400/60"></div>
                <div className="size-2 lg:size-3 rounded-full bg-green-400/60"></div>
              </div>
              <div className="flex gap-4 lg:gap-10 h-full">
                <div className="w-1/3 space-y-2 lg:space-y-4">
                  <div className="h-5 lg:h-8 w-full bg-navy-deep/10 rounded-lg"></div>
                  <div className="h-3 lg:h-4 w-[80%] bg-navy-deep/5 rounded-lg"></div>
                  <div className="h-3 lg:h-4 w-[60%] bg-navy-deep/5 rounded-lg"></div>
                  <div className="h-7 lg:h-10 w-20 lg:w-32 bg-primary rounded-lg mt-4 lg:mt-10"></div>
                </div>
                <div className="flex-1 rounded-xl bg-gradient-to-br from-primary/10 to-primary/30 border border-primary/10 flex items-center justify-center">
                  <div className="size-10 lg:size-16 rounded-full bg-white/80 shadow-lg flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined !text-2xl lg:!text-4xl">play_arrow</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Interface */}
            <div className="absolute bottom-[5%] right-4 lg:right-10 w-[160px] lg:w-[240px] h-[320px] lg:h-[480px] bg-navy-deep rounded-[30px] lg:rounded-[40px] border-4 lg:border-8 border-navy-deep/20 shadow-2xl z-20 overflow-hidden transform translate-x-2 lg:translate-x-4 -rotate-6">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 h-4 lg:h-6 w-20 lg:w-32 bg-navy-deep rounded-b-xl lg:rounded-b-2xl"></div>
              <div className="p-3 lg:p-6 h-full flex flex-col bg-white dark:bg-[#1a2c33]">
                <div className="mt-4 lg:mt-8 space-y-3 lg:space-y-6">
                  <div className="h-20 lg:h-32 w-full bg-primary/10 rounded-xl lg:rounded-2xl flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary !text-3xl lg:!text-5xl">cloud_queue</span>
                  </div>
                  <div className="h-4 lg:h-6 w-full bg-navy-deep/10 rounded-lg"></div>
                  <div className="h-3 lg:h-4 w-[80%] bg-navy-deep/5 rounded-lg"></div>
                  <div className="space-y-2 lg:space-y-3 mt-2 lg:mt-4">
                    <div className="flex justify-between items-center p-2 lg:p-3 bg-primary/5 rounded-lg lg:rounded-xl">
                      <div className="size-5 lg:size-8 rounded-lg bg-primary/20"></div>
                      <div className="flex-1 px-2 lg:px-3 h-2 lg:h-3 bg-primary/10 rounded-full"></div>
                    </div>
                    <div className="flex justify-between items-center p-2 lg:p-3 bg-navy-deep/5 rounded-lg lg:rounded-xl">
                      <div className="size-5 lg:size-8 rounded-lg bg-navy-deep/10"></div>
                      <div className="flex-1 px-2 lg:px-3 h-2 lg:h-3 bg-navy-deep/5 rounded-full"></div>
                    </div>
                  </div>
                </div>
                <div className="mt-auto h-8 lg:h-12 w-full bg-primary rounded-lg lg:rounded-xl flex items-center justify-center">
                  <div className="h-1.5 lg:h-2 w-8 lg:w-12 bg-white/40 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Left Content - Second on mobile, first on desktop */}
        <div className="flex flex-col space-y-6 lg:space-y-8 max-w-2xl order-2 lg:order-1">
          <div className="space-y-4">
            {badge && (
              <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest rounded-full">
                {badge}
              </span>
            )}
            <h1 className="text-5xl md:text-6xl xl:text-7xl font-extrabold leading-[1.1] text-navy-deep dark:text-white">
              {title.split(titleHighlight).map((part, index, array) => (
                <React.Fragment key={index}>
                  {part}
                  {index < array.length - 1 && (
                    <span className="text-primary">{titleHighlight}</span>
                  )}
                </React.Fragment>
              ))}
            </h1>
            {description && (
              <p className="text-lg md:text-xl text-navy-deep/70 dark:text-white/70 leading-relaxed font-medium">
                {description}
              </p>
            )}
          </div>
          <div className="flex flex-col md:flex-row gap-3 md:gap-4 pb-8 md:pb-0">
            {primaryButtonText && (
              <button
                onClick={handlePrimaryClick}
                className="group relative bg-primary text-white text-sm md:text-base font-bold px-4 md:px-10 py-3 md:py-4 rounded-xl overflow-hidden transition-all shadow-xl shadow-primary/30 active:scale-[0.98] flex items-center justify-center gap-1 md:gap-2 w-full md:w-auto"
              >
                <span className="relative z-10 flex items-center gap-2">
                  {primaryButtonText}
                  <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">
                    arrow_forward
                  </span>
                </span>
                {/* Shimmer Effect */}
                <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
              </button>
            )}
            {secondaryButtonText && (
              <button
                onClick={handleSecondaryClick}
                className="border-2 border-navy-deep dark:border-white/20 text-navy-deep dark:text-white text-sm md:text-base font-bold px-4 md:px-10 py-3 md:py-4 rounded-xl hover:bg-navy-deep hover:text-white dark:hover:bg-white dark:hover:text-navy-deep transition-all active:scale-95 w-full md:w-auto"
              >
                {secondaryButtonText}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Scroll Indicator - hidden on mobile, visible from md and up */}
      <div className="hidden md:flex absolute bottom-10 left-1/2 -translate-x-1/2 flex-col items-center gap-2 opacity-50">
        <span className="text-[10px] font-bold uppercase tracking-widest">Scroll to Explore</span>
        <div className="w-6 h-10 border-2 border-navy-deep dark:border-white rounded-full flex justify-center p-1.5">
          <div className="w-1 h-2 bg-navy-deep dark:bg-white rounded-full animate-bounce"></div>
        </div>
      </div>
    </main>
  )
}

export default CodelanceHero

