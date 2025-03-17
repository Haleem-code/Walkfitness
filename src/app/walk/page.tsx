"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import DailyProgressBar from "../../components/DailyProgressBar"
import { APP_URL } from "@/config"

interface StepsData {
  totalSteps: number
  lastSevenDaysSteps: number[]
  stepsForLastUpdate: number
}

const Walk: React.FC = () => {
  const { data: session, status } = useSession()
  const [stepsData, setStepsData] = useState<StepsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (session && status === "authenticated") {
      const fetchStepsData = async () => {
        try {
          setLoading(true)
          setError(null)

          const emailRes = await fetch(`${APP_URL}/api/getEmail`)
          const { email } = await emailRes.json()
          console.log("email", email)

          const res = await fetch(`${APP_URL}/api/steps?email=${email}`)

          const data = await res.json()

          if (res.status === 200) {
            setStepsData(data)
          } else {
            console.error("Failed to fetch steps data:", data.message || "Unknown error")
            setError(data.message || "Failed to fetch steps data")
          }
        } catch (error) {
          console.error("Error fetching steps data:", error)
          setError("An error occurred while fetching your steps data")
        } finally {
          setLoading(false)
        }
      }

      fetchStepsData()
    } else if (status !== "loading") {
      setLoading(false)
    }
  }, [status, session])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-white">Loading your steps data...</p>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-white">You need to sign in to view your steps</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-white mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Try Again
        </button>
      </div>
    )
  }

  if (!stepsData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-white">No steps data available yet. Start walking to track your progress!</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white">
      <div className="p-2 rounded-lg flex flex-col items-center">
        <DailyProgressBar totalSteps={stepsData.stepsForLastUpdate} />
        <a href="#" className="underline decoration-green-800 underline-thick p-2 text-center">
          How to play
        </a>
      </div>
    </div>
  )
}

export default Walk

