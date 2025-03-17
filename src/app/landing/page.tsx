"use client"

import { useRouter } from "next/navigation"
import Image from "next/image"
import { useState } from "react"

const LandingPage = () => {
  const router = useRouter()
  const [isButtonHovered, setIsButtonHovered] = useState(false)
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null)

  const handleLaunchApp = () => {
    router.push("/authpage")
  }

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden">
      {/* Top purple section */}
      <div
        className="w-full flex flex-col items-center justify-center relative"
        style={{
          height: "50vh",
          background: "linear-gradient(to bottom, #C0B6FF, #9F92FF)",
          zIndex: 3,
        }}
      >
        <Image src="/images/logo.svg" alt="Logo" width={200} height={200} className="animate-pulse-slow" />
      </div>

      {/* Curved division with shoe image */}
      <div className="absolute w-full flex justify-center" style={{ top: "calc(50vh - 100px)", zIndex: 10 }}>
        <div className="relative">
          <div
            className="w-[200px] h-[200px] rounded-full bg-gradient-to-br from-[#C0B6FF] to-[#9F92FF] flex items-center justify-center shadow-xl"
            style={{
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
              border: "6px solid #000",
            }}
          >
            <Image src="/images/sneaker.svg" alt="Shoe" width={140} height={140} className="animate-pulse" />
          </div>
        </div>
      </div>

      {/* Wave separator */}
      <div className="absolute w-full" style={{ top: "45vh", zIndex:2 }}>
        <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0 0L60 10C120 20 240 40 360 50C480 60 600 60 720 50C840 40 960 20 1080 10C1200 0 1320 0 1380 0H1440V100H1380C1320 100 1200 100 1080 100C960 100 840 100 720 100C600 100 480 100 360 100C240 100 120 100 60 100H0V0Z"
            fill="black"
          />
        </svg>
      </div>

      {/* Main black section */}
      <div
        className="flex-1 flex flex-col items-center justify-start pt-24 px-4 md:px-8 lg:px-16"
        style={{
          background: "linear-gradient(to bottom, #000000, #121212)",
          color: "#CEFF67",
          textAlign: "center",
          zIndex: 1,
        }}
      >
        <h1
          className="text-2xl md:text-3xl lg:text-4xl mb-6 mt-16 font-bold max-w-3xl"
          style={{ lineHeight: "1.2", color: "#fff" }}
        >
          Step Up Your Fitness Game, Step into Crypto Wealth with
          <span className="text-[#CEFF67] ml-2 relative">
            WALKFIT
            <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-[#CEFF67] opacity-70"></span>
          </span>
        </h1>

        <p className="text-base md:text-lg max-w-2xl" style={{ marginTop: "2rem", color: "#fff", opacity: 0.9 }}>
          Earn crypto with every step, combining fitness and finance seamlessly. Join now and turn your movement into
          rewards. Walk to earn with WALKFIT.
        </p>

        <button
          onClick={handleLaunchApp}
          onMouseEnter={() => setIsButtonHovered(true)}
          onMouseLeave={() => setIsButtonHovered(false)}
          className="px-8 py-4 text-xl font-bold bg-black text-white rounded-md transition-all duration-300"
          style={{
            margin: "3rem 0",
            border: "1px solid #CEFF67",
            boxShadow: isButtonHovered ? "4px 6px 0 0 #CEFF67" : "2px 4px 0 0 #CEFF67",
            transform: isButtonHovered ? "translate(-2px, -2px)" : "translate(0, 0)",
          }}
        >
          Launch App
        </button>

        <div className="flex space-x-6 mb-12">
          {[
            { name: "x", url: "https://x.com/WalkFit_xyz", icon: "/icons/x-icon.svg" },
            { name: "telegram", url: "https://t.me/your_profile", icon: "/icons/telegram-icon.svg" },
            { name: "youtube", url: "https://www.youtube.com/your_profile", icon: "/icons/youtube-icon.svg" },
            { name: "medium", url: "https://medium.com/@your_profile", icon: "/icons/medium-icon.svg" },
          ].map((social) => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => setHoveredIcon(social.name)}
              onMouseLeave={() => setHoveredIcon(null)}
              className="relative group"
            >
              <div className="absolute inset-0 bg-[#CEFF67] rounded-full opacity-0 scale-0 transition-all duration-300 group-hover:opacity-20 group-hover:scale-150"></div>
              <Image
                src={social.icon || "/placeholder.svg"}
                alt={social.name}
                width={36}
                height={36}
                className="transition-transform duration-300"
                style={{
                  transform: hoveredIcon === social.name ? "scale(1.2)" : "scale(1)",
                }}
              />
            </a>
          ))}
        </div>

        <h2 className="text-2xl mb-6 font-bold relative inline-block" style={{ color: "#CEFF67" }}>
          ROADMAP
          <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-[#CEFF67] opacity-70"></span>
        </h2>

        <div className="bg-black bg-opacity-50 text-white p-6 rounded-lg mb-12 max-w-3xl w-full border border-gray-800 backdrop-blur-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="transition-transform duration-300 hover:scale-105">
              <figure className="relative">
                <div className="absolute inset-0 bg-gradient-to-b from-[#CEFF67]/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                <Image src="/images/july.svg" alt="July" width={300} height={300} className="w-full h-auto" />
              </figure>
            </div>
            <div className="transition-transform duration-300 hover:scale-105">
              <figure className="relative">
                <div className="absolute inset-0 bg-gradient-to-b from-[#CEFF67]/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                <Image src="/images/aug.svg" alt="August" width={300} height={300} className="w-full h-auto" />
              </figure>
            </div>
            <div className="transition-transform duration-300 hover:scale-105">
              <figure className="relative">
                <div className="absolute inset-0 bg-gradient-to-b from-[#CEFF67]/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                <Image src="/images/sept.svg" alt="September" width={300} height={300} className="w-full h-auto" />
              </figure>
            </div>
          </div>
        </div>

        <a
          href="#"
          className="px-8 py-4 text-xl font-bold bg-black text-white rounded-md transition-all duration-300 mb-16"
          style={{
            border: "1px solid #CEFF67",
            boxShadow: "2px 4px 0 0 #CEFF67",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translate(-2px, -2px)"
            e.currentTarget.style.boxShadow = "4px 6px 0 0 #CEFF67"
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translate(0, 0)"
            e.currentTarget.style.boxShadow = "2px 4px 0 0 #CEFF67"
          }}
        >
          Whitepaper
        </a>
      </div>
    </div>
  )
}

export default LandingPage

