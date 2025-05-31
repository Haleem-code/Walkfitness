"use client"

import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Users, TrendingUp, Coins, Target, Clock, Star } from "lucide-react"
import { useRouter } from "next/navigation"
import TopNavbar from "@/components/TopNav"
import DailyProgressBar from "@/components/DailyProgressBar"
import GamesList from "@/components/game-list" // Import the GamesList component

interface ApiGame {
  _id: string
  name: string
  gameSteps: number
  duration: number
  entryPrice: number
  gameType: "public" | "private" | "sponsored"
  code?: string
  creator: string
  participants: string[]
  maxPlayers: number
  startDate: string
  endDate: string
  image?: string
}

// Interface to match GamesList component expectations
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
  banner: string
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
  const [publicGames, setPublicGames] = useState<Game[]>([])
  const [sponsoredGames, setSponsoredGames] = useState<Game[]>([])
  const [gameCode, setGameCode] = useState("")
  const [joiningGame, setJoiningGame] = useState<string | null>(null)
  const router = useRouter()

  // Function to convert API game format to GamesList component format
  const convertApiGameToGame = (apiGame: ApiGame): Game => {
    return {
      id: apiGame._id,
      name: apiGame.name,
      days: apiGame.duration,
      steps: apiGame.gameSteps,
      players: apiGame.participants.length,
      maxPlayers: apiGame.maxPlayers,
      entryFee: apiGame.entryPrice,
      type: apiGame.gameType,
      reward: apiGame.gameType === "sponsored" ? "Prize Pool Available" : undefined,
      isActive: new Date() < new Date(apiGame.endDate),
      banner: apiGame.image || "/default-game-banner.jpg" // Provide default image
    }
  }

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

          const res = await fetch(`/api/steps?email=${email}`)
          const data = await res.json()

          if (res.status === 200) {
            setStepsData(data)
          } else {
            console.error("Failed to fetch steps data:", data.message || "Unknown error")
            setError(data.message || "Failed to fetch steps data")
          }

          // Set a default user object
          setUser({
            email: email,
            username: email.split('@')[0],
            steps: data?.totalSteps || 0,
            targetSteps: 10000,
          })
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
      // Fetch public games
      const publicResponse = await fetch("/api/games/public")
      if (publicResponse.ok) {
        const publicData = await publicResponse.json()
        const convertedPublicGames = (publicData.games || []).map(convertApiGameToGame)
        setPublicGames(convertedPublicGames)
      }

      // Fetch sponsored games
      const sponsoredResponse = await fetch("/api/games/sponsored")
      if (sponsoredResponse.ok) {
        const sponsoredData = await sponsoredResponse.json()
        const convertedSponsoredGames = (sponsoredData.games || []).map(convertApiGameToGame)
        setSponsoredGames(convertedSponsoredGames)
      }
    } catch (error) {
      console.error("Failed to fetch games:", error)
    }
  }

  const handleJoinWithCode = async () => {
    if (!gameCode.trim()) {
      alert("Please enter a game code")
      return
    }

    setJoiningGame("code")
    try {
      const response = await fetch('/api/games/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ gameCode: gameCode.trim().toUpperCase() }),
      })

      const data = await response.json()

      if (data.error) {
        alert(data.error)
      } else {
        // Redirect to game page
        router.push(`/game/${gameCode.trim().toUpperCase()}`)
      }
    } catch (error) {
      console.error("Failed to join game:", error)
      alert("Failed to join game")
    } finally {
      setJoiningGame(null)
    }
  }

  const handleJoinById = async (gameId: string) => {
    setJoiningGame(gameId)
    try {
      const response = await fetch('/api/games/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ gameId }),
      })

      const data = await response.json()

      if (data.error) {
        alert(data.error)
      } else {
        // Redirect to game page
        router.push(`/game/id/${gameId}`)
      }
    } catch (error) {
      console.error("Failed to join game:", error)
      alert("Failed to join game")
    } finally {
      setJoiningGame(null)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const getGameStatus = (game: ApiGame) => {
    const now = new Date()
    const startDate = new Date(game.startDate)
    const endDate = new Date(game.endDate)
    
    if (now < startDate) return 'Starting Soon'
    if (now > endDate) return 'Ended'
    return 'Active'
  }

  const GameCard = ({ game }: { game: ApiGame }) => (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all">
      {game.image && (
        <img 
          src={game.image} 
          alt={game.name}
          className="w-full h-40 object-cover rounded-lg mb-4"
        />
      )}
      
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold text-white">{game.name}</h3>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          game.gameType === 'sponsored' 
            ? 'bg-yellow-100 text-yellow-800' 
            : 'bg-green-100 text-green-800'
        }`}>
          {game.gameType === 'sponsored' && <Star className="w-3 h-3 inline mr-1" />}
          {game.gameType}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
        <div className="flex items-center gap-2 text-gray-400">
          <Target className="w-4 h-4" />
          <span>{game.gameSteps.toLocaleString()} steps</span>
        </div>
        <div className="flex items-center gap-2 text-gray-400">
          <Clock className="w-4 h-4" />
          <span>{game.duration} days</span>
        </div>
        <div className="flex items-center gap-2 text-gray-400">
          <Users className="w-4 h-4" />
          <span>{game.participants.length}/{game.maxPlayers}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-400">
          <Coins className="w-4 h-4" />
          <span>${game.entryPrice}</span>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4 text-sm">
        <span className="text-gray-400">
          {formatDate(game.startDate)} - {formatDate(game.endDate)}
        </span>
        <span className={`px-2 py-1 rounded text-xs ${
          getGameStatus(game) === 'Active' 
            ? 'bg-green-600 text-white' 
            : getGameStatus(game) === 'Starting Soon'
            ? 'bg-yellow-600 text-white'
            : 'bg-red-600 text-white'
        }`}>
          {getGameStatus(game)}
        </span>
      </div>

      <Button
        onClick={() => handleJoinById(game._id)}
        disabled={joiningGame === game._id || game.participants.length >= game.maxPlayers}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg disabled:opacity-50"
      >
        {joiningGame === game._id ? 'Joining...' : 
         game.participants.length >= game.maxPlayers ? 'Full' : 'Join Game'}
      </Button>
    </div>
  )

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

  if (!stepsData) {
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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-purple-800 text-white">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Section */}
        <div className="mb-8">
          <TopNavbar />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-6">
          <Button onClick={() => router.push("/createGame")} className="bg-green-400 hover:bg-green-500 text-black font-semibold px-6 py-3 rounded-xl">
            Create Game
          </Button>
          <Button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-xl">
            Create Group
          </Button>
        </div>

        {/* Join Private Game Section */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 mb-8">
          <h2 className="text-xl font-bold mb-4">Join Private Game</h2>
          <p className="text-gray-400 mb-4">Enter the game code you received to join a private game.</p>
          <div className="flex gap-4">
            <Input
              placeholder="Enter game code (e.g., ABC12345)"
              value={gameCode}
              onChange={(e) => setGameCode(e.target.value.toUpperCase())}
              className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 rounded-xl py-3 px-4 flex-1"
              onKeyPress={(e) => e.key === "Enter" && handleJoinWithCode()}
              maxLength={8}
            />
            <Button
              onClick={handleJoinWithCode}
              disabled={joiningGame === "code"}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl"
            >
              {joiningGame === "code" ? 'Joining...' : 'Join'}
            </Button>
          </div>
        </div>

        {/* Main Content - Steps Progress */}
        <div className="flex justify-center mb-8">
          <div className="w-full max-w-2xl">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold mb-4">Your Steps Progress</h3>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-400">Total Steps: {stepsData.totalSteps.toLocaleString()}</span>
                <span className="text-sm text-gray-400">Target: {(user?.targetSteps || 10000).toLocaleString()} steps</span>
              </div>
              <DailyProgressBar totalSteps={stepsData.stepsForLastUpdate} />
            </div>
          </div>
        </div>

        {/* Public Games */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-6">Public Games</h2>
          <GamesList games={publicGames} type="public" />
        </div>

        {/* Sponsored Games */}
        <div className="mb-20">
          <h2 className="text-xl font-bold mb-6">Sponsored Games</h2>
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
