"use client"

import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Users, TrendingUp, Coins } from "lucide-react"
import { useRouter } from "next/navigation"
import CreateGameModal from "@/components/create-game-modal"
import GamesList from "@/components/game-list"
import TopNavbar from "@/components/TopNav"
import DailyProgressBar from "@/components/DailyProgressBar"

interface Game {
  id: string
  name: string
  days: number
  steps: number
  players: number
  maxPlayers: number
  entryFee: number
  type: "public" | "private" | "sponsored"
  reward?: string
  isActive: boolean
}

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
  const [games, setGames] = useState<Game[]>([])
  const [gameCode, setGameCode] = useState("")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const router = useRouter()

  // Fetch user data and steps
  useEffect(() => {
    if (session && status === "authenticated") {
      const fetchStepsData = async () => {
        try {
          setLoading(true)
          setError(null)

          const emailRes = await fetch(`http://localhost:3000/api/getemail`)
          const { email } = await emailRes.json()
          console.log("email", email)

          const res = await fetch(`http://localhost:3000/api/get/steps?email=${email}`)
          const data = await res.json()

          if (res.status === 200) {
            setStepsData(data)
          } else {
            console.error("Failed to fetch steps data:", data.message || "Unknown error")
            setError(data.message || "Failed to fetch steps data")
          }

          // Fetch user data
          const userRes = await fetch(`http://localhost:3000/api/user?email=${email}`)
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

  // Fetch games
  useEffect(() => {
    fetchGames()
  }, [])

  const fetchGames = async () => {
    try {
      const response = await fetch("/api/games")
      const data = await response.json()
      setGames(data)
    } catch (error) {
      console.error("Failed to fetch games:", error)
    }
  }

  const handleJoinWithCode = async () => {
    if (!gameCode.trim()) return

    try {
      const response = await fetch(`/api/games/${gameCode}`)
      if (response.ok) {
        router.push(`/game/${gameCode}`)
      } else {
        alert("Invalid game code")
      }
    } catch (error) {
      console.error("Failed to join game:", error)
      alert("Failed to join game")
    }
  }

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

  const publicGames = games.filter((game) => game.type === "public")
  const sponsoredGames = games.filter((game) => game.type === "sponsored")

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-purple-800 text-white">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Section */}
        <div className="mb-8">
          <TopNavbar />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-6">
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-400 hover:bg-green-500 text-black font-semibold px-6 py-3 rounded-xl">
                Create Game
              </Button>
            </DialogTrigger>
            <DialogContent className="p-0 border-0 bg-transparent">
              <CreateGameModal onClose={() => setIsCreateModalOpen(false)} onGameCreated={fetchGames} />
            </DialogContent>
          </Dialog>

          <Button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-xl">
            Create Group
          </Button>
        </div>

        {/* Join Game Input */}
        <div className="mb-6">
          <div className="relative">
            <Input
              placeholder="Enter game code"
              value={gameCode}
              onChange={(e) => setGameCode(e.target.value)}
              className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 rounded-xl py-3 px-4 pr-20"
              onKeyPress={(e) => e.key === "Enter" && handleJoinWithCode()}
            />
            <Button
              onClick={handleJoinWithCode}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-green-400 hover:bg-green-500 text-black px-4 py-1 rounded-lg text-sm"
            >
              Join
            </Button>
          </div>
        </div>

        {/* Main Content - Steps Progress with Dynamic Progress Bar */}
        <div className="flex justify-center mb-8">
          <div className="w-full max-w-2xl">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold mb-4">Your Steps Progress</h3>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-400">Total Steps: {stepsData.totalSteps.toLocaleString()}</span>
                <span className="text-sm text-gray-400">Target: {user.targetSteps.toLocaleString()} steps</span>
              </div>
              <DailyProgressBar totalSteps={stepsData.stepsForLastUpdate} />
            </div>
          </div>
        </div>

        {/* Public Games */}
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4">Public Games</h2>
          <GamesList games={publicGames} type="public" />
        </div>

        {/* Sponsored Games */}
        <div className="mb-20">
          <h2 className="text-xl font-bold mb-4">Sponsored Games</h2>
          <GamesList games={sponsoredGames} type="sponsored" />
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900/90 backdrop-blur-lg border-t border-gray-700">
          <div className="flex items-center justify-around py-3">
            <Button variant="ghost" size="sm" className="flex flex-col items-center gap-1 text-gray-400">
              <TrendingUp className="w-5 h-5" />
              <span className="text-xs">Steps</span>
            </Button>
            <Button variant="ghost" size="sm" className="flex flex-col items-center gap-1 text-gray-400">
              <Users className="w-5 h-5" />
              <span className="text-xs">Groups</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center gap-1 text-green-400 bg-green-400/20 rounded-full p-3"
            >
              <div className="text-sm font-semibold">Walk</div>
            </Button>
            <Button variant="ghost" size="sm" className="flex flex-col items-center gap-1 text-gray-400">
              <Coins className="w-5 h-5" />
              <span className="text-xs">Rewards</span>
            </Button>
            <Button variant="ghost" size="sm" className="flex flex-col items-center gap-1 text-gray-400">
              <Users className="w-5 h-5" />
              <span className="text-xs">Profile</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
