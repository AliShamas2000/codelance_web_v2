import React from 'react'
import Shimmer from './Shimmer'
import SectionHeaderShimmer from './SectionHeaderShimmer'

const ProcessShimmer = () => (
  <div aria-busy="true" aria-label="Loading process steps">
    <SectionHeaderShimmer showBadge centered />

    <div className="max-w-4xl mx-auto px-6 space-y-12 py-8">
      {[0, 1, 2, 3].map((item) => (
        <div
          key={item}
          className={`flex flex-col md:flex-row items-center gap-8 ${
            item % 2 === 1 ? 'md:flex-row-reverse' : ''
          }`}
        >
          <div className="w-full md:w-5/12 space-y-3">
            <Shimmer className="h-8 w-16" />
            <Shimmer className="h-7 w-3/4" />
            <Shimmer className="h-4 w-full" />
            <Shimmer className="h-4 w-full" />
            <Shimmer className="h-4 w-2/3" />
          </div>
          <Shimmer className="size-16 shrink-0" rounded="rounded-full" />
          <div className="hidden md:block md:w-5/12" />
        </div>
      ))}
    </div>
  </div>
)

export default ProcessShimmer
