"use client"
import type React from "react"
import { CircularProgressbar, buildStyles } from "react-circular-progressbar"
import Image from "next/image"
import "react-circular-progressbar/dist/styles.css"

type DailyProgressBarProps = {
  stepsForLastUpdate: number
  onRefresh?: () => void
  isRefreshing?: boolean
}

const DailyProgressBar: React.FC<DailyProgressBarProps> = ({ stepsForLastUpdate, onRefresh, isRefreshing = false }) => {
  const maxSteps = 15000 // Default max steps
  const percentage = (stepsForLastUpdate / maxSteps) * 100

  return (
    <div className="relative flex flex-col items-center">
      {/* Responsive progress bar container */}
      <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-52 lg:h-52">
        <CircularProgressbar
          value={percentage}
          styles={buildStyles({
            textColor: "#fff",
            pathColor: "#4ade80",
            trailColor: "#C0B6FF",
          })}
        />
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-105"
          style={{ marginTop: "-0.5rem" }}
          onClick={onRefresh}
        >
          <div className="relative -mt-6">
            <Image
              src="/images/sneaker.svg"
              alt="Sneaker"
              width={180}
              height={180}
              className={`w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 ${isRefreshing ? "animate-pulse" : ""}`}
            />
            {isRefreshing && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 border-2 border-green-400 border-t-transparent"></div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="text-center mt-2 sm:mt-3 md:mt-4 text-white text-sm sm:text-base">
        {stepsForLastUpdate.toLocaleString()} / {maxSteps.toLocaleString()} <span className="text-[#4ade80]">steps</span>
      </div>
      {onRefresh && <p className="text-xs text-gray-400 mt-1">Click sneaker to refresh steps</p>}
    </div>
  )
}

export default DailyProgressBar
