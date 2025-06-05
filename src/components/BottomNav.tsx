"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import Image from "next/image"

type BottomNavProps = {
  pendingTaskCount?: number
}

const BottomNav: React.FC<BottomNavProps> = ({ pendingTaskCount = 0 }) => {
  const pathname = usePathname()
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const showNavbar = pathname !== "/logo" && pathname !== "/landing" && pathname !== "/authpage" && pathname !== "/"

  if (!showNavbar) return null

  const navItems = [
    { name: "Tournament", href: "/games", icon: "/images/tournament-icon.svg" },
    { name: "Groups", href: "/groups", icon: "/images/group-icon.svg" },
    { name: "Walk", href: "/walk", icon: "/icons/walk.svg" },
    { name: "Marketplace", href: "/marketplace", icon: "/icons/marketplace.svg" },
    { name: "Profile", href: "/profile", icon: "/icons/profile.svg" },
  ]

  const handleMouseOver = (index: number) => setActiveIndex(index)
  const handleMouseOut = () => setActiveIndex(null)

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-600 z-50">
      <div className="flex justify-around items-center p-4">
        {navItems.map((item, index) => {
          const isActive = pathname === item.href

          return (
            <Link href={item.href} key={item.name}>
              <div
                className={`flex items-center justify-center transition-all duration-200 ${
                  activeIndex === index ? "scale-110" : ""
                }`}
                onMouseOver={() => handleMouseOver(index)}
                onMouseOut={handleMouseOut}
              >
                {isActive ? (
                  // Active state: horizontal layout with green background
                  <div className="flex items-center gap-2 bg-[#A0FEA0]/50 text-white px-4 py-2 rounded-full">
                    <Image src={item.icon || "/placeholder.svg"} alt={item.name} width={20} height={20} />
                    <span className="text-sm font-medium">{item.name}</span>
                  </div>
                ) : (
                  // Inactive state: vertical layout
                  <div className="flex flex-col items-center text-[#A0FEA0] relative">
                    <Image src={item.icon || "/placeholder.svg"} alt={item.name} width={24} height={24} />
                    <span className="text-xs mt-1">{item.name}</span>
                    {item.name === "Tasks" && pendingTaskCount > 0 && (
                      <div className="absolute -top-1 -right-1 bg-purple-500 text-white rounded-full text-xs px-1.5 py-0.5 min-w-[18px] h-[18px] flex items-center justify-center">
                        {pendingTaskCount}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

export default BottomNav
