"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import Image from "next/image"
import { Copy, Flame, Trophy, Star } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import TopNavbar from "@/components/TopNav"

interface StreakData {
  currentStreak: number
  longestStreak: number
  streakXP: number
  lastStreakDate: string | null
}

interface UserStats {
  completedGames: string
  totalXP:number
  ranking: string
  referrals: string
}

const ProfilePage = () => {
  const { data: session } = useSession()
  const [streakData, setStreakData] = useState<StreakData>({
    currentStreak: 0,
    longestStreak: 0,
    streakXP: 0,
    lastStreakDate: null,
  })
  const [userStats, setUserStats] = useState<UserStats>({
    completedGames: "-",
    totalXP: 0,
    ranking: "",
    referrals: "-",
  })
  const [loading, setLoading] = useState(true)

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

  useEffect(() => {
    if (session) {
      fetchStreakData()
    }
  }, [session])

  const fetchStreakData = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/streak")

      if (response.ok) {
        const data = await response.json()
        setStreakData(data)
      } else {
        console.error("Failed to fetch streak data:", await response.json())
      }
    } catch (error) {
      console.error("Error fetching streak data:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatXP = (xp: number) => {
    if (xp >= 1000000) {
      return `${(xp / 1000000).toFixed(1)}M`
    }
    if (xp >= 1000) {
      return `${(xp / 1000).toFixed(1)}K`
    }
    return xp.toString()
  }

  const copyReferralCode = () => {
    navigator.clipboard.writeText("REF123456")
    // You could add a toast notification here
  }

  return (
    <div className="min-h-screen text-white overflow-hidden">
      {/* Full page background gradient */}
      <div className="fixed inset-0 bg-gradient-to-b from-purple-600 via-purple-900/80 to-black -z-10" />

      {/* Blurred background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
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
        <div className="px-4 md:px-6 lg:px-8 mt-8 max-w-7xl mx-auto pb-24">
          {/* Profile Header */}
          <motion.div
            className="flex justify-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="w-full max-w-lg">
              <div className="bg-black/30 backdrop-blur-md rounded-3xl p-8 border border-gray-600/50 shadow-2xl">
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-6">
                    <div className="w-32 h-32 rounded-full border-4 border-green-400 overflow-hidden shadow-lg">
                      <Image
                        src={session?.user?.image || "/images/profileImg.svg"}
                        alt="Profile"
                        width={128}
                        height={128}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{session?.user?.name || "User"}</h1>
                  <p className="text-gray-400 text-sm">{session?.user?.email}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div className="mb-8" initial="hidden" animate="visible" variants={staggerContainer}>
            <h2 className="text-xl md:text-2xl font-bold mb-6 text-white">Your Stats</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <motion.div variants={fadeInUp}>
                <Card className="bg-black/30 backdrop-blur-md border-gray-600/50 hover:border-green-400/50 transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="text-2xl md:text-3xl font-bold text-white mb-2">{userStats.completedGames}</div>
                    <div className="text-sm text-gray-400">Completed Games</div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <Card className="bg-black/30 backdrop-blur-md border-gray-600/50 hover:border-green-400/50 transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="text-2xl md:text-3xl font-bold text-white mb-2">
                      {formatXP(userStats.totalXP + streakData.streakXP)}
                    </div>
                    <div className="text-sm text-gray-400">Total XP</div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <Card className="bg-black/30 backdrop-blur-md border-red-500/30 hover:border-red-500/50 transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="text-2xl md:text-3xl font-bold text-red-400 mb-2">#{userStats.ranking}</div>
                    <div className="text-sm text-gray-400">Ranking</div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <Card className="bg-black/30 backdrop-blur-md border-gray-600/50 hover:border-green-400/50 transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="text-2xl md:text-3xl font-bold text-white mb-2">{userStats.referrals}</div>
                    <div className="text-sm text-gray-400">Referrals</div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>

          {/* Streak Stats */}
          <motion.div className="mb-8" initial="hidden" animate="visible" variants={staggerContainer}>
            <h2 className="text-xl md:text-2xl font-bold mb-6 text-white">Streak Performance</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <motion.div variants={fadeInUp}>
                <Card className="bg-gradient-to-br from-orange-500/20 to-red-500/20 border-orange-500/30 hover:border-orange-500/50 transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="flex items-center justify-center mb-3">
                      <Flame className="h-6 w-6 text-orange-400 mr-2" />
                      <span className="text-sm text-orange-200 font-medium">Current Streak</span>
                    </div>
                    {loading ? (
                      <div className="h-8 w-12 bg-orange-400/20 animate-pulse rounded mx-auto" />
                    ) : (
                      <div className="text-3xl font-bold text-orange-400">{streakData.currentStreak}</div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <Card className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/30 hover:border-yellow-500/50 transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="flex items-center justify-center mb-3">
                      <Trophy className="h-6 w-6 text-yellow-400 mr-2" />
                      <span className="text-sm text-yellow-200 font-medium">Best Streak</span>
                    </div>
                    {loading ? (
                      <div className="h-8 w-12 bg-yellow-400/20 animate-pulse rounded mx-auto" />
                    ) : (
                      <div className="text-3xl font-bold text-yellow-400">{streakData.longestStreak}</div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <Card className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/30 hover:border-green-500/50 transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="flex items-center justify-center mb-3">
                      <Star className="h-6 w-6 text-green-400 mr-2" />
                      <span className="text-sm text-green-200 font-medium">Streak XP</span>
                    </div>
                    {loading ? (
                      <div className="h-8 w-16 bg-green-400/20 animate-pulse rounded mx-auto" />
                    ) : (
                      <div className="text-3xl font-bold text-green-400">{formatXP(streakData.streakXP)}</div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>

          {/* Referral Section */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <h2 className="text-xl md:text-2xl font-bold mb-6 text-white">Referral Code</h2>
            <Card className="bg-black/30 backdrop-blur-md border-gray-600/50 hover:border-green-400/50 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-lg font-semibold text-white mb-1">Share & Earn</div>
                    <div className="text-sm text-gray-400">Invite friends to earn rewards</div>
                  </div>
                  <Button
                    variant="outline"
                    onClick={copyReferralCode}
                    className="bg-green-400 hover:bg-green-500 text-black border-none font-semibold px-6 py-2 rounded-xl transition-all duration-300 hover:scale-105"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Code
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Settings Section */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
          >
            <h2 className="text-xl md:text-2xl font-bold mb-6 text-white">Settings</h2>
            <Card className="bg-black/30 backdrop-blur-md border-gray-600/50">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Step Provider</h3>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full bg-transparent border-gray-600 text-white hover:bg-gray-800/50 hover:border-green-400 py-3 rounded-xl transition-all duration-300"
                  >
                    <Image src="/images/google.svg" alt="Google" width={20} height={20} className="mr-3" />
                    Continue with Google
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full bg-transparent border-gray-600 text-white hover:bg-gray-800/50 hover:border-red-400 py-3 rounded-xl transition-all duration-300"
                  >
                    <Image
                                         src="/images/fitbit.svg"
                                         alt="Connect with Fitbit"
                                         width={140}
                                         height={40}
                                         className="h-8 w-auto"
                                       />
                    Disconnect Fitbit
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Danger Zone */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            <Card className="bg-red-500/10 border-red-500/30">
              <CardContent className="p-6 text-center">
                <Button
                  variant="ghost"
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/20 font-semibold px-6 py-2 rounded-xl transition-all duration-300"
                >
                  Delete Profile
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
