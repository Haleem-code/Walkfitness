"use client"

import { useEffect, useState } from "react"
import { Trophy, Search } from "lucide-react"
import { Input } from "@/components/ui/input"


interface LeaderboardEntry {
  email: string
  name: string
  img?: string | null
  steps: number
  rank: number
}

interface GameLeaderboardProps {
  gameIdOrCode: string
  userEmail?: string
  className?: string
}

export default function GameLeaderboard({ gameIdOrCode: gameId, userEmail, className = "" }: GameLeaderboardProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true)
        console.log(`Fetching leaderboard for game: ${gameId}`)

        // Make sure gameId is properly formatted for the API call
        const formattedGameId = gameId.toString().trim()

        const response = await fetch(`/api/games/leaderboard/${formattedGameId}`)

        if (!response.ok) {
          console.error(`API error: ${response.status} ${response.statusText}`)
          setError(`Error ${response.status}: ${response.statusText}`)
          setLoading(false)
          return
        }

        const data = await response.json()

        if (data.success) {
          console.log(`Leaderboard data received: ${data.leaderboard.length} entries`)
          setLeaderboard(data.leaderboard || [])
        } else {
          console.error(`API returned error: ${data.error}`)
          setError(data.error || "Failed to fetch leaderboard")
        }
      } catch (err) {
        console.error("Error fetching leaderboard:", err)
        setError("An error occurred while fetching the leaderboard")
      } finally {
        setLoading(false)
      }
    }

    if (gameId) {
      fetchLeaderboard()
    }
  }, [gameId])

  const filteredLeaderboard = leaderboard.filter(
    (entry) =>
      entry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getRankIcon = (rank: number) => {
    if (rank === 1) return "🥇"
    if (rank === 2) return "🥈"
    if (rank === 3) return "🥉"
    return `#${rank}`
  }

  if (loading) {
    return (
      <div className="bg-black/30 backdrop-blur-md rounded-2xl p-6 border border-gray-600/50">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-400" />
          Leaderboard
        </h3>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-black/30 backdrop-blur-md rounded-2xl p-6 border border-gray-600/50">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-400" />
          Leaderboard
        </h3>
        <div className="text-center py-8">
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-black/30 backdrop-blur-md rounded-2xl p-6 border border-gray-600/50 ${className}`}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-400" />
          Leaderboard
        </h3>
        {leaderboard.length > 5 && (
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search participants..."
              className="pl-8 bg-gray-800/50 border-gray-700"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        )}
      </div>

      <div className="space-y-3">
        {filteredLeaderboard.length > 0 ? (
          filteredLeaderboard.map((entry, index) => (
            <div
              key={entry.email}
              className={`flex items-center justify-between p-4 rounded-xl transition-all duration-300 hover:scale-[1.02] ${
                entry.email === userEmail
                  ? "bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-400/30"
                  : "bg-gray-700/30 hover:bg-gray-700/50"
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-10 h-10 flex items-center justify-center rounded-full font-bold ${
                    index === 0
                      ? "bg-gradient-to-r from-yellow-400 to-yellow-600 text-black"
                      : index === 1
                        ? "bg-gradient-to-r from-gray-300 to-gray-500 text-black"
                        : index === 2
                          ? "bg-gradient-to-r from-amber-400 to-amber-600 text-black"
                          : "bg-gray-600/50 text-white"
                  }`}
                >
                  {getRankIcon(index + 1)}
                </div>
                <div>
                  <div className="font-semibold flex items-center">
                    {entry.name || entry.email.split("@")[0]}
                    {entry.email === userEmail && (
                      <span className="ml-2 text-xs bg-green-400/20 text-green-400 px-2 py-1 rounded-full">You</span>
                    )}
                  </div>
                  <div className="text-sm text-gray-400">{entry.email}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold">{entry.steps.toLocaleString()}</div>
                <div className="text-sm text-gray-400">steps</div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No participants yet</p>
            <p className="text-gray-500 text-sm">Be the first to join and start tracking your steps!</p>
          </div>
        )}
      </div>
    </div>
  )
}
