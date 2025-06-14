"use client"

import { useSession } from "next-auth/react"
import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import TopNavbar from "@/components/TopNav"
import GamesList from "@/components/game-list"
import Image from "next/image"
import DailyProgressBar from "@/components/DailyProgressBar"


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
  const [refreshingSteps, setRefreshingSteps] = useState(false)
  const [publicGames, setPublicGames] = useState<Game[]>([])
  const [sponsoredGames, setSponsoredGames] = useState<Game[]>([])
  const [gameCode, setGameCode] = useState("")
  const [joiningGame, setJoiningGame] = useState<string | null>(null)
  const router = useRouter()

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const refreshSteps = async () => {
    if (!session) return
    setRefreshingSteps(true)
    try {
      const emailRes = await fetch(`/api/getemail`)
      const { email } = await emailRes.json()
      console.log("email", email)
      const updateRes = await fetch(`/api/update-steps`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      if (updateRes.ok) {
        // Fetch updated steps data
        const res = await fetch(`/api/steps?email=${email}`)
        const data = await res.json()

        if (res.status === 200) {
          setStepsData(data)
          setUser((prev) => (prev ? { ...prev, steps: data?.totalSteps || 0 } : null))
        }
      } else {
        throw new Error("Failed to update steps")
      }
    } catch (error) {
      console.error("Error refreshing steps:", error)
      setError("Failed to refresh steps data")
    } finally {
      setRefreshingSteps(false)
    }
  }

  // Function to convert API game format to GamesList component format
  const convertApiGameToGame = (apiGame: ApiGame): Game => {
    let banner = "/images/sneaker.svg" //default banner
    if (apiGame.image) {
      if (apiGame.image.startsWith("http") || apiGame.image.startsWith("/")) {
        banner = apiGame.image
      } else {
        banner = `/images/${apiGame.image}` // Assuming images are stored in the public/images directory
      }
    }
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
      banner: apiGame.image || "/images/sneaker.svg",
    }
  }

  // Use useCallback to memoize fetchGames function
  const fetchGames = useCallback(async () => {
    try {
      const publicResponse = await fetch(`/api/games/public`)
      if (publicResponse.ok) {
        const publicData = await publicResponse.json()
        const convertedPublicGames = (publicData.games || []).map(convertApiGameToGame)
        setPublicGames(convertedPublicGames)
      }

      const sponsoredResponse = await fetch(`/api/games/sponsored`)
      if (sponsoredResponse.ok) {
        const sponsoredData = await sponsoredResponse.json()
        const convertedSponsoredGames = (sponsoredData.games || []).map(convertApiGameToGame)
        setSponsoredGames(convertedSponsoredGames)
      }
    } catch (error) {
      console.error("Failed to fetch games:", error)
    }
  }, []) // Empty dependency array since fetchGames doesn't depend on any external values

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

          setUser({
            email: email,
            username: email.split("@")[0],
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

  // Fetch games - now includes fetchGames in dependency array
  useEffect(() => {
    fetchGames()
  }, [fetchGames])

  const handleJoinWithCode = async () => {
    if (!gameCode.trim()) {
      alert("Please enter a game code")
      return
    }

    setJoiningGame("code")
    try {
      const response = await fetch(`/api/games/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ gameCode: gameCode.trim() }),
      })

      const data = await response.json()

      if (data.error) {
        alert(data.error)
      } else {
        router.push(`/game/${gameCode.trim()}`)
      }
    } catch (error) {
      console.error("Failed to join game:", error)
      alert("Failed to join game")
    } finally {
      setJoiningGame(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-600/30 via-purple-900/20 to-black" />
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mx-auto mb-4" />
            <p>Loading your steps data...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-black text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-600/30 via-purple-900/20 to-black" />
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <p className="text-white">You need to sign in to view your steps</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-600/30 via-purple-900/20 to-black" />
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
          <p className="text-white mb-4 text-center">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-green-400 hover:bg-green-500 text-black font-bold py-2 px-4 rounded"
          >
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  if (!stepsData) {
    return (
      <div className="min-h-screen bg-black text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-600/30 via-purple-900/20 to-black" />
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mx-auto mb-4" />
            <p>Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Background with purple gradient at top */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-600/30 via-purple-900/20 to-black" />

      {/* Blurred background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute right-0 top-1/4 w-64 h-64 md:w-96 md:h-96 opacity-5 blur-sm">
          <Image
            src="/images/footer-sneak.png"
            width={400}
            height={400}
            alt="Sneaker"
            className="w-full h-full object-contain"
          />
        </div>
        <div className="absolute left-0 bottom-1/4 w-64 h-64 md:w-96 md:h-96 opacity-5 blur-sm">
          <Image
            src="/images/blue-sneak.png"
            width={400}
            height={400}
            alt="Sneaker"
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      <div className="relative z-10 min-h-screen">
        {/* Header Section */}
        <motion.div className="px-4 py-6 md:px-6 lg:px-8" initial="hidden" animate="visible" variants={fadeInUp}>
          <TopNavbar />
        </motion.div>

        {/* Main Content Container */}
        <div className="px-4 md:px-6 lg:px-8 mt-8 max-w-7xl mx-auto">
          {/* Action Buttons */}
          <motion.div
            className="flex flex-wrap gap-3 mb-8 items-center justify-center"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp}>
              <Button
                onClick={() => router.push("/createGame")}
                className="bg-green-400 hover:bg-green-500 text-black font-semibold px-4 py-2 h-10 sm:px-6 sm:py-3 sm:h-12 rounded-xl transition-all duration-300 hover:scale-105 text-sm sm:text-base"
              >
                Create Game
              </Button>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Button
                onClick={() => router.push("/#walk")}
                className="bg-white hover:bg-white/90 hover:text-purple-700 text-purple-600 font-semibold px-4 py-2 h-10 sm:px-6 sm:py-3 sm:h-12 rounded-xl transition-all duration-300 hover:scale-105 text-sm sm:text-base"
              >
                Create Group
              </Button>
            </motion.div>

            <motion.div variants={fadeInUp} className="flex gap-2">
              <Input
                placeholder="Enter game code"
                value={gameCode}
                onChange={(e) => setGameCode(e.target.value)}
                className="w-32 sm:w-64 md:w-80 bg-black/30 border-gray-600 text-white placeholder-gray-400 rounded-xl h-10 sm:h-12 px-3 sm:px-4 focus:border-green-400 transition-colors backdrop-blur-sm text-sm sm:text-base"
                onKeyPress={(e) => e.key === "Enter" && handleJoinWithCode()}
                maxLength={8}
              />

              {gameCode.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <Button
                    onClick={handleJoinWithCode}
                    disabled={joiningGame === "code"}
                    className="bg-green-400 hover:bg-green-500 text-black px-4 py-2 h-10 sm:px-6 sm:py-3 sm:h-12 rounded-xl font-semibold transition-all duration-300 hover:scale-105 text-sm sm:text-base"
                  >
                    {joiningGame === "code" ? "Joining..." : "Join"}
                  </Button>
                </motion.div>
              )}
            </motion.div>
          </motion.div>

          {/* Steps Progress Circle */}
          <motion.div
            className="flex justify-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="w-full max-w-lg md:max-w-xl lg:max-w-2xl">
              <div className="bg-black/30 backdrop-blur-md rounded-3xl p-8 md:p-12 lg:p-16 border border-gray-600/50 shadow-2xl">
                <div className="flex items-center justify-center">
                  <div className="relative w-48 h-48 md:w-56 md:h-56">
                    {/* Progress circle */}

                    {/* Center content */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <DailyProgressBar
                        stepsForLastUpdate={stepsData.stepsForLastUpdate}
                        onRefresh={refreshSteps}
                        isRefreshing={refreshingSteps}
                      />

                      {/* Remove the following section since it's now integrated into DailyProgressBar
                    <p className="text-xs text-gray-400 mt-2">
                      Click sneaker to refresh steps
                    </p>
                    <div className="mb-4">
                      <button
                        onClick={refreshSteps}
                        disabled={refreshingSteps}
                        className="relative group transition-all duration-300 hover:scale-110 disabled:opacity-50"
                      >
                        <Image
                          src="/images/sneaker.svg"
                          alt="Update Steps"
                          width={40}
                          height={40}
                          className={`${
                            refreshingSteps ? "animate-spin" : ""
                          } group-hover:brightness-110`}
                        />
                        {refreshingSteps && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="animate-spin rounded-full h-6 w-6 border-2 border-green-400 border-t-transparent"></div>
                          </div>
                        )}
                      </button>
                      
                    </div>
                    */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Public Games */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h2 className="text-xl md:text-2xl font-bold mb-6 text-white">Public Games</h2>
            <div className="space-y-4">
              <GamesList games={publicGames} type="public" />
            </div>
          </motion.div>

          {/* Sponsored Games */}
          <motion.div
            className="mb-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <h2 className="text-xl md:text-2xl font-bold mb-6 text-white">Sponsored Games</h2>
            <div className="space-y-4">
              <GamesList games={sponsoredGames} type="sponsored" />
            </div>
          </motion.div>

          <div className="h-16"/>
        </div>
      </div>
    </div>
  )
}
