"use client"

import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import DailyProgressBar from "../../components/DailyProgressBar"
import TopNavbar from "@/components/TopNav"
import GameButtons from "@/components/game-buttons"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Suspense } from "react"
import { Loader2 } from 'lucide-react'

interface User {
  email: string
  username: string
  steps: number
  targetSteps: number
}

interface StepsData {
  totalSteps: number
  lastSevenDaysSteps: number[]
  stepsForLastUpdate: number
}

export default function WalkPage() {
  const { data: session, status } = useSession()
  const [stepsData, setStepsData] = useState<StepsData | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch user data and steps
  useEffect(() => {
    if (session && status === "authenticated") {
      const fetchStepsData = async () => {
        try {
          setLoading(true)
          setError(null)

          const emailRes = await fetch(`/api/getemail`)
          const { email } = await emailRes.json()
          console.log("email", email)

          const res = await fetch(`/api/get/steps?email=${email}`)
          const data = await res.json()

          if (res.status === 200) {
            setStepsData(data)
          } else {
            console.error("Failed to fetch steps data:", data.message || "Unknown error")
            setError(data.message || "Failed to fetch steps data")
          }

          // Fetch user data
          const userRes = await fetch(`/api/user?email=${email}`)
          const userData = await userRes.json()
          
          if (userRes.status === 200) {
            setUser(userData)
          } else {
            console.error("Failed to fetch user data:", userData.message || "Unknown error")
            setError(userData.message || "Failed to fetch user data")
          }
        } catch (error) {
          console.error("Error fetching data:", error)
          setError("An error occurred while fetching your data")
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
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-black flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p>Loading your steps data...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-black flex items-center justify-center">
        <p className="text-white">You need to sign in to view your steps</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-black flex flex-col items-center justify-center">
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

  if (!stepsData || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-black flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Section */}
        <div className="mb-8">
          <TopNavbar/>
        </div>

        {/* Main Content - Steps Progress */}
        <div className="flex justify-center mb-8">
          <div className="w-full max-w-2xl">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold mb-4">Your Steps Progress</h3>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-400">Total Steps: {stepsData.totalSteps}</span>
                <span className="text-sm text-gray-400">Target: {user.targetSteps} steps</span>
              </div>
              <DailyProgressBar totalSteps={stepsData.stepsForLastUpdate} />
            </div>
          </div>
        </div>

        {/* Game Buttons */}
        <GameButtons />

        {/* Games Tabs */}
        <Tabs defaultValue="public" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="public">Public Games</TabsTrigger>
            <TabsTrigger value="sponsored">Sponsored Games</TabsTrigger>
          </TabsList>
          <TabsContent value="public">
            <Suspense fallback={
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            }>
              <iframe src="/api/games/public" className="w-full h-[500px] border-none"></iframe>
            </Suspense>
          </TabsContent>
          <TabsContent value="sponsored">
            <Suspense fallback={
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            }>
              <iframe src="/api/games/sponsored" className="w-full h-[500px] border-none"></iframe>
            </Suspense>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
