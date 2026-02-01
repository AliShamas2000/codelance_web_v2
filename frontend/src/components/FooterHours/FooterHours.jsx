import React from 'react'

const FooterHours = ({
  title = "Working Hours",
  hours = [],
  className = ""
}) => {
  const defaultHours = [
    { day: "Mon - Fri", time: "9:00 AM - 8:00 PM", isClosed: false },
    { day: "Saturday", time: "10:00 AM - 6:00 PM", isClosed: false },
    { day: "Sunday", time: "Closed", isClosed: true },
  ]

  const hoursList = hours.length > 0 ? hours : defaultHours

  return (
    <div className={`flex flex-col gap-6 ${className}`}>
      <h3 className="text-text-main dark:text-white font-bold text-base uppercase tracking-wider">
        {title}
      </h3>
      <ul className="flex flex-col gap-3 text-sm text-text-muted dark:text-gray-400">
        {hoursList.map((hour, index) => (
          <li
            key={index}
            className={`flex justify-between ${
              index < hoursList.length - 1
                ? "border-b border-gray-100 dark:border-white/5 pb-2"
                : "pb-2"
            }`}
          >
            <span>{hour.day}</span>
            <span
              className={`font-semibold ${
                hour.isClosed
                  ? "text-primary"
                  : "text-text-main dark:text-gray-200"
              }`}
            >
              {hour.time}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default FooterHours

