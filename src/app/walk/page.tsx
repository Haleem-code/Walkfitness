"use client"
import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Footprints, ChevronDown, Plus } from "lucide-react"
import CreateGameModal from "@/components/create-game-modal"
import GameCard from "@/components/game-card"
import { toast } from "@/hooks/use-toast"
import DailyProgressBar from "../../components/DailyProgressBar"
import { APP_URL } from "@/config"
import TopNavbar from "@/components/TopNav"

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
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [gameCode, setGameCode] = useState("")
  const [publicGames, setPublicGames] = useState([])
  const [sponsoredGames, setSponsoredGames] = useState([])
  const [isLoading, setIsLoading] = useState(true)
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

          // Fetch user data
          const userRes = await fetch(`${APP_URL}/api/user?email=${email}`)
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
    if (user) {
      fetchGames()
    }
  }, [user])

  const fetchGames = async () => {
    try {
      setIsLoading(true)

      const [publicResponse, sponsoredResponse] = await Promise.all([
        fetch("/api/games?type=public"),
        fetch("/api/games?type=sponsored"),
      ])

      const publicData = await publicResponse.json()
      const sponsoredData = await sponsoredResponse.json()

      if (publicData.success) {
        setPublicGames(publicData.games)
      }

      if (sponsoredData.success) {
        setSponsoredGames(sponsoredData.games)
      }
    } catch (error) {
      console.error("Error fetching games:", error)
      toast({
        title: "Error",
        description: "Failed to load games",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleJoinByCode = async () => {
    if (!gameCode.trim()) {
      toast({
        title: "Error",
        description: "Please enter a game code",
      })
      return
    }

    if (!user) {
      toast({
        title: "Error",
        description: "Please log in to join games",
      })
      return
    }

    try {
      const response = await fetch("/api/games/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: gameCode.trim(),
          userEmail: user.email,
          username: user.username,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Joined Game!",
          description: `You have successfully joined ${data.game.name}`,
        })
        setGameCode("")
        fetchGames()
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to join game",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to join game",
      })
    }
  }

  const handleGameCreated = (newGame: any) => {
    if (newGame.type === "public") {
      setPublicGames((prev) => [newGame, ...prev])
    } else if (newGame.type === "sponsored") {
      setSponsoredGames((prev) => [newGame, ...prev])
    }
  }

  const handleJoinGame = (updatedGame: any) => {
    if (updatedGame.type === "public") {
      setPublicGames((prev) => prev.map((game) => (game._id === updatedGame._id ? updatedGame : game)))
    } else if (updatedGame.type === "sponsored") {
      setSponsoredGames((prev) => prev.map((game) => (game._id === updatedGame._id ? updatedGame : game)))
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-black flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4" />
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4" />
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
          <h1 className="text-4xl font-bold mb-2">Walk & Win</h1>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Actions & Progress */}
          <div className="lg:col-span-1 space-y-6">
            {/* Action Buttons */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
              <div className="space-y-3">
                <Button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-medium rounded-xl py-3 flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Create Game
                </Button>
                <Button
                  variant="outline"
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white border-purple-500 font-medium rounded-xl py-3"
                >
                  Create Group
                </Button>
              </div>
            </div>

            {/* Game Code Input */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold mb-4">Join Private Game</h3>
              <div className="flex gap-2">
                <Input
                  value={gameCode}
                  onChange={(e) => setGameCode(e.target.value)}
                  placeholder="Enter game code"
                  className="flex-1 bg-gray-700 border-gray-600 text-white rounded-xl"
                  onKeyPress={(e) => e.key === "Enter" && handleJoinByCode()}
                />
                <Button onClick={handleJoinByCode} className="bg-gray-600 hover:bg-gray-500 text-white rounded-xl px-6">
                  Join
                </Button>
              </div>
            </div>

            {/* Steps Progress */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold mb-4">Your Steps Progress</h3>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-400">Total Steps: {stepsData.totalSteps}</span>
                <span className="text-sm text-gray-400">Target: {user.targetSteps} steps</span>
              </div>
              <DailyProgressBar totalSteps={stepsData.stepsForLastUpdate} />
            </div>
          </div>

          {/* Right Column - Games */}
          <div className="lg:col-span-2 space-y-8">
            {/* Public Games */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Public Games</h2>
                <ChevronDown className="w-5 h-5 text-gray-400" />
              </div>

              {isLoading ? (
                <div className="text-center py-12 text-gray-400">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-4"></div>
                  Loading games...
                </div>
              ) : publicGames.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <Footprints className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  No public games available
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {publicGames.map((game: any) => (
                    <GameCard
                      key={game._id}
                      game={game}
                      userEmail={user.email}
                      username={user.username}
                      onJoinGame={handleJoinGame}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Sponsored Games */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Sponsored Games</h2>
                <ChevronDown className="w-5 h-5 text-gray-400" />
              </div>

              {isLoading ? (
                <div className="text-center py-12 text-gray-400">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                  Loading games...
                </div>
              ) : sponsoredGames.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <Footprints className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  No sponsored games available
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sponsoredGames.map((game: any) => (
                    <GameCard
                      key={game._id}
                      game={game}
                      userEmail={user.email}
                      username={user.username}
                      onJoinGame={handleJoinGame}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Create Game Modal */}
        <CreateGameModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onGameCreated={handleGameCreated}
          userEmail={user.email}
          username={user.username}
        />
      </div>
    </div>
  )
}