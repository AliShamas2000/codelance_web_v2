import React from 'react'
import CodelancePricingCard from '../CodelancePricingCard/CodelancePricingCard'

const CodelancePricingGrid = ({
  packages = [],
  onPackageSelect = null,
  columns = 3,
  className = ""
}) => {
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  }

  // Default packages if none provided
  const defaultPackages = [
    {
      id: 1,
      name: "Starter",
      price: "$999",
      pricePeriod: "/project",
      description: "Perfect for single landings and MVP launches.",
      features: [
        { text: "5 Core Features", isBold: false },
        { text: "Email Support", isBold: false },
        { text: "Basic GSAP Animations", isBold: false },
        { text: "48h Response Time", isBold: false },
        { text: "Standard Security", isBold: false }
      ],
      buttonText: "Get Started"
    },
    {
      id: 2,
      name: "Business",
      price: "$2,499",
      pricePeriod: "/month",
      description: "Scalable solutions for growing tech brands.",
      badge: "Most Popular",
      isHighlighted: true,
      features: [
        { text: "All Starter Features", isBold: true },
        { text: "Priority Slack Support", isBold: false },
        { text: "Advanced GSAP Interactivity", isBold: false },
        { text: "24h Response Time", isBold: false },
        { text: "Premium Security Audits", isBold: false },
        { text: "Custom API Integration", isBold: false }
      ],
      buttonText: "Choose Business"
    },
    {
      id: 3,
      name: "Enterprise",
      price: "Custom",
      pricePeriod: "quote",
      description: "Bespoke infrastructure for high-traffic apps.",
      features: [
        { text: "Unlimited Features", isBold: false },
        { text: "Dedicated Project Manager", isBold: false },
        { text: "24/7 Priority Support", isBold: false },
        { text: "Custom Infrastructure", isBold: false },
        { text: "SLA Guarantee", isBold: false }
      ],
      buttonText: "Contact Sales"
    }
  ]

  const displayPackages = packages.length > 0 ? packages : defaultPackages

  if (displayPackages.length === 0) {
    return (
      <div className="text-center py-12 text-gray-600 dark:text-gray-400">
        <p>No packages available at the moment.</p>
      </div>
    )
  }

  return (
    <div className={`grid ${gridCols[columns] || gridCols[3]} gap-8 ${className}`}>
      {displayPackages.map((pkg, index) => (
        <CodelancePricingCard
          key={pkg.id || index}
          id={pkg.id}
          name={pkg.name || pkg.title}
          price={pkg.price}
          pricePeriod={pkg.pricePeriod || pkg.period}
          description={pkg.description}
          features={pkg.features || []}
          badge={pkg.badge}
          isHighlighted={pkg.isHighlighted || pkg.isPopular || false}
          buttonText={pkg.buttonText || "Get Started"}
          buttonAction={onPackageSelect}
          className=""
        />
      ))}
    </div>
  )
}

export default CodelancePricingGrid

