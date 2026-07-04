import React from 'react'
import Shimmer from './Shimmer'

const FooterShimmer = () => (
  <footer
    className="bg-background-light dark:bg-background-dark border-t border-navy-deep/10 dark:border-white/10 pt-20 pb-10"
    aria-busy="true"
    aria-label="Loading footer"
  >
    <div className="max-w-[1400px] mx-auto px-6 lg:px-20">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:pb-16 border-b border-navy-deep/5 dark:border-white/5">
        {[0, 1, 2, 3].map((col) => (
          <div key={col} className="space-y-4">
            <Shimmer className="h-6 w-32" />
            <Shimmer className="h-4 w-full" />
            <Shimmer className="h-4 w-5/6" />
            <Shimmer className="h-4 w-4/6" />
          </div>
        ))}
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8">
        <Shimmer className="h-4 w-56" />
        <div className="flex gap-4">
          {[0, 1, 2].map((item) => (
            <Shimmer key={item} className="h-4 w-24" />
          ))}
        </div>
      </div>
    </div>
  </footer>
)

export default FooterShimmer
