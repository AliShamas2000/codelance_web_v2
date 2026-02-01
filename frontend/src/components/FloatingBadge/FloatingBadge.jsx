import React from 'react'

const FloatingBadge = ({
  customerAvatars = [],
  title = "Join our community",
  subtitle = "Rated Top Barber in City",
  className = ""
}) => {
  return (
    <div className={`absolute bottom-6 left-6 z-20 flex items-center gap-3 rounded-xl bg-white/95 dark:bg-[#10221c]/95 backdrop-blur px-4 py-3 shadow-lg ${className}`}>
      {/* Customer Avatars */}
      <div className="flex -space-x-3">
        {customerAvatars.length > 0 ? (
          customerAvatars.map((avatar, index) => (
            <div
              key={index}
              className="h-8 w-8 rounded-full border-2 border-white bg-gray-300 overflow-hidden"
              style={{
                backgroundImage: avatar.imageUrl ? `url(${avatar.imageUrl})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              {!avatar.imageUrl && (
                <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                  <span className="text-xs text-gray-600">{avatar.initials || '?'}</span>
                </div>
              )}
            </div>
          ))
        ) : (
          // Default avatars
          <>
            <div
              className="h-8 w-8 rounded-full border-2 border-white bg-gray-300 overflow-hidden"
              style={{
                backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAqc8IlfuK8_G82Cg-RPP0j-mRW2_pnimor07i-r2Sb6cWVIy4WE7K8B7KlhkcJ1d5E3MJPNnm598whfFMNzS6TCWnRFGA1WJQPuEoxfR3p1LHnSvPwsdeXcQGXBANcDxRXVDoo4nqZV8qLiYmcarZvr-cfAXNYV5oidCJP5QzA3LrC6-rBjVz4oX5Nwx22ng5m2sdfm3T9nMvIvKDR4AyhxQYAxDMvEqj3PAB5DA9VnieI1AgH0yLoaj4d4x2yekKwZl56Gh9dELU')",
                backgroundSize: 'cover'
              }}
            />
            <div
              className="h-8 w-8 rounded-full border-2 border-white bg-gray-300 overflow-hidden"
              style={{
                backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC8D7j-gGqZoQq59s_I5zo5vUP_PslykHF3NNr2PI0VQS9lnpPW3OmmZ6VWpfEOb51DatofB_PKHl_PaoVQ7WpPT_1kI_0JhUYq-1hRyd2E1xns-X_R0QS6aovK__IuOUG01hbmEuAXHYAr8iXqHgKSR8x6g_vWCvTs30KG1LjGa4V1O4RAlPYtU2zt4Faf181Re7iBGe55Lj3XCEePAXKZWinc_R_b3ymvnpxw2kMLrKzZs6OkzYKhswbYRBIXnCfSvsWxCPFZHL0')",
                backgroundSize: 'cover'
              }}
            />
            <div
              className="h-8 w-8 rounded-full border-2 border-white bg-gray-300 overflow-hidden"
              style={{
                backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBjXFUBQ0r7C0uo8PvbY1D_Rs2rhNtMXlFj8zu8OTtQpzKH6PtsJa1KgbrzdU9CdVm8Z9xVspD0GGaaFugZC1GiWR3WCPAT7xgjQRX_1mLJqukI_WkEv7XEaWeH769lUsL4UbzJmXasLjaRlsp1ElqNltV2ww9G_CMT0--l5XGskKuZCdqgaefWTkfU7BI4FzVVEttrTaTC9CwIKv_hzPbd99a0FC6zD6aLd-0DQRK01mB2yRlT2X8TS5cnxju_5KjBbPcj8P-IWRM')",
                backgroundSize: 'cover'
              }}
            />
          </>
        )}
      </div>
      
      {/* Badge Content */}
      <div>
        <p className="text-xs font-bold text-text-main dark:text-white">
          {title}
        </p>
        <div className="flex items-center gap-1">
          <span className="material-symbols-outlined text-[10px] text-primary fill-current">star</span>
          <span className="text-[10px] text-text-muted dark:text-gray-400">
            {subtitle}
          </span>
        </div>
      </div>
    </div>
  )
}

export default FloatingBadge

