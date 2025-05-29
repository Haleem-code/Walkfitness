import { getGameByCode } from "@/backend/data"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import DailyProgressBar from "@/components/DailyProgressBar"
import TopNavbar from "@/components/TopNav"

export default async function GamePage({ params }: { params: { code: string } }) {
  const game = await getGameByCode(params.code)

  if (!game) {
    notFound()
  }

  // Calculate days remaining
  const endDate = new Date(game.endDate)
  const now = new Date()
  const daysRemaining = Math.max(0, Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))

  // Calculate progress percentage
  const totalDays = game.duration
  const daysPassed = totalDays - daysRemaining
  const progressPercentage = Math.min(100, Math.round((daysPassed / totalDays) * 100))

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Section */}
        <div className="mb-8">
          <TopNavbar />
        </div>

        {/* Game Details */}
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700 mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl font-bold">{game.name}</CardTitle>
                <span
                  className={`px-3 py-1 rounded-full text-xs ${
                    game.gameType === "sponsored"
                      ? "bg-yellow-500/20 text-yellow-300"
                      : game.gameType === "private"
                        ? "bg-purple-500/20 text-purple-300"
                        : "bg-green-500/20 text-green-300"
                  }`}
                >
                  {game.gameType.charAt(0).toUpperCase() + game.gameType.slice(1)}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="flex flex-col items-center p-4 bg-gray-700/30 rounded-lg">
                  <span className="text-gray-400 text-sm mb-1">Target Steps</span>
                  <span className="text-2xl font-bold">{game.gameSteps.toLocaleString()}</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-gray-700/30 rounded-lg">
                  <span className="text-gray-400 text-sm mb-1">Days Remaining</span>
                  <span className="text-2xl font-bold">{daysRemaining}</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-gray-700/30 rounded-lg">
                  <span className="text-gray-400 text-sm mb-1">Participants</span>
                  <span className="text-2xl font-bold">{game.participants.length}</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-400 mb-2">
                  <span>Progress</span>
                  <span>{progressPercentage}%</span>
                </div>
                <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-400"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>

              {/* Game Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Game Details</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between">
                      <span className="text-gray-400">Start Date:</span>
                      <span>{new Date(game.startDate).toLocaleDateString()}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-400">End Date:</span>
                      <span>{new Date(game.endDate).toLocaleDateString()}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-400">Entry Fee:</span>
                      <span>{game.entryPrice > 0 ? `$${game.entryPrice}` : "Free"}</span>
                    </li>
                    {game.gameType === "private" && (
                      <li className="flex justify-between">
                        <span className="text-gray-400">Game Code:</span>
                        <span className="font-mono">{game.code}</span>
                      </li>
                    )}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Your Progress</h3>
                  <div className="bg-gray-700/30 p-4 rounded-lg">
                    <DailyProgressBar totalSteps={0} />
                    <div className="mt-4 text-center text-sm text-gray-400">
                      Connect your fitness tracker to update your steps
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Leaderboard */}
          <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
            <CardHeader>
              <CardTitle>Leaderboard</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {game.participants.length === 0 ? (
                  <p className="text-center text-gray-400 py-8">No participants yet</p>
                ) : (
                  <div className="space-y-2">
                    {/* This would be populated with actual participant data */}
                    <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 flex items-center justify-center bg-yellow-500/20 text-yellow-300 rounded-full">
                          1
                        </div>
                        <span>User123</span>
                      </div>
                      <span>8,432 steps</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 flex items-center justify-center bg-gray-500/20 text-gray-300 rounded-full">
                          2
                        </div>
                        <span>StepMaster</span>
                      </div>
                      <span>7,215 steps</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 flex items-center justify-center bg-amber-500/20 text-amber-300 rounded-full">
                          3
                        </div>
                        <span>WalkChampion</span>
                      </div>
                      <span>6,891 steps</span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
