import React from 'react'
import Shimmer from './Shimmer'
import SectionHeaderShimmer from './SectionHeaderShimmer'

const PricingShimmer = () => (
  <section className="bg-background-light dark:bg-background-dark" aria-busy="true" aria-label="Loading packages">
    <SectionHeaderShimmer centered />

    <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-12">
      <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
        {[0, 1, 2, 3].map((item) => (
          <Shimmer key={item} className="h-9 w-24" rounded="rounded-full" />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {[0, 1, 2].map((item) => (
          <div
            key={item}
            className="flex min-h-[620px] flex-col gap-6 rounded-lg p-8 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800"
          >
            <Shimmer className="h-6 w-24 mx-auto" rounded="rounded-full" />
            <Shimmer className="h-8 w-40 mx-auto" />
            <Shimmer className="h-12 w-32 mx-auto" />
            <Shimmer className="h-4 w-full" />
            <div className="space-y-3 flex-1">
              {[0, 1, 2, 3, 4].map((line) => (
                <Shimmer key={line} className="h-4 w-full" />
              ))}
            </div>
            <Shimmer className="h-12 w-full" rounded="rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  </section>
)

export default PricingShimmer
