"use client";
import React from 'react'
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Image from 'next/image';

type BottomNavProps = {
  pendingTaskCount?: number;
};

const BottomNav: React.FC<BottomNavProps> = ({ pendingTaskCount = 0 }) => {
  const pathname = usePathname();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const showNavbar =
    pathname !== "/logo" &&
    pathname !== "/landing" &&
    pathname !== "/authpage" &&
    pathname !== "/";
  if (!showNavbar) return null;

  const navItems = [
    { name: "Walk", href: "/walk", icon: "/icons/walk.svg" },
    { name: "Tournament", href: "/tournaments", icon: "/icons/task.svg" },
    {name:"Marketplace", href:"/marketplace", icon:"/icons/marketplace.png"},
    { name: "Friends", href: "/referral", icon: "/icons/referral.svg" },
    { name: "Profile", href: "/profile", icon: "/icons/profile.svg" },
  ];

  const handleMouseOver = (index: number) => setActiveIndex(index);
  const handleMouseOut = () => setActiveIndex(null);

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-600">
      <div className="flex justify-around p-4">
        {navItems.map((item, index) => {
          const isActive = pathname === item.href;

          return (
            <Link href={item.href} key={item.name}>
              <div
                className={`flex flex-col items-center custom-button ${
                  isActive ? "text-[#CEFF67]" : "text-[#CEFF67]"
                } ${activeIndex === index ? "scale-110" : ""}`}
                onMouseOver={() => handleMouseOver(index)}
                onMouseOut={handleMouseOut}
                style={{
                  padding: "0.5rem",
                  border: isActive
                    ? "1px solid #CEFF67"
                    : "1px solid transparent",
                  boxShadow: isActive ? "2px 4px 0 0 #CEFF67" : "none",
                }}
              >
                <div className="relative flex items-center">
                  <Image src={item.icon} alt={item.name} width={24} height={24} /> {/* Adjust dimensions as needed */}
                  {isActive && <span className="ml-2">{item.name}</span>}
                </div>
                {!isActive && <span className="text-xs mt-1">{item.name}</span>}
                {item.name === "Tasks" && pendingTaskCount > 0 && (
                  <div className="absolute top-0 right-0 bg-purple-500 text-black rounded-full text-xs px-2">
                    {pendingTaskCount}
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
