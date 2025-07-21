"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Trophy, Flame, Star, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface StreakNotificationProps {
  isVisible: boolean
  streakCount: number
  xpAwarded: number
  isNewRecord: boolean
  onClose: () => void
}

export default function StreakNotification({
  isVisible,
  streakCount,
  xpAwarded,
  isNewRecord,
  onClose,
}: StreakNotificationProps) {
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    if (isVisible) {
      setShowConfetti(true)
      const timer = setTimeout(() => setShowConfetti(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [isVisible])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          {/* Confetti Effect */}
          {showConfetti && (
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                  initial={{
                    x: "50vw",
                    y: "50vh",
                    scale: 0,
                  }}
                  animate={{
                    x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 800),
                    y: Math.random() * (typeof window !== "undefined" ? window.innerHeight : 600),
                    scale: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2,
                    delay: Math.random() * 0.5,
                    ease: "easeOut",
                  }}
                />
              ))}
            </div>
          )}

          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <Card className="w-full max-w-md bg-gradient-to-br from-purple-900/90 to-black/90 border-none shadow-2xl">
              <CardContent className="p-8 text-center relative">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="absolute top-4 right-4 text-gray-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </Button>

                {/* Main Icon */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="mb-6"
                >
                  <div className="relative mx-auto w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                    <Flame className="h-10 w-10 text-white" />
                    {isNewRecord && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5 }}
                        className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"
                      >
                        
                      </motion.div>
                    )}
                  </div>
                </motion.div>

                {/* Title */}
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl font-bold text-white mb-2"
                >
                  Daily Streak Earned! 🔥
                </motion.h2>

                {/* Streak Count */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                  className="mb-4"
                >
                  <div className="text-4xl font-bold text-purple-400 mb-1">{streakCount}</div>
                  <div className="text-gray-300 text-sm">{streakCount === 1 ? "Day Streak" : "Days Streak"}</div>
                </motion.div>

                {/* XP Award */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-purple-500/20 border border-purple-500/30 rounded-lg p-4 mb-4"
                >
                  <div className="flex items-center justify-center gap-2 text-purple-400">
                    <Star className="h-5 w-5" />
                    <span className="text-xl font-bold">+{xpAwarded} XP</span>
                  </div>
                  <div className="text-gray-300 text-sm mt-1">Experience Points Earned</div>
                </motion.div>

                {/* New Record Badge */}
                {isNewRecord && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 }}
                    className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-3 mb-4"
                  >
                    <div className="flex items-center justify-center gap-2 text-yellow-400">
                      <Trophy className="h-4 w-4" />
                      <span className="font-semibold">New Personal Record!</span>
                    </div>
                  </motion.div>
                )}

                {/* Motivational Message */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="text-gray-300 text-sm mb-6"
                >
                  Keep up the great work! Come back tomorrow to continue your streak.
                </motion.p>

                {/* Continue Button */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
                  <Button
                    onClick={onClose}
                    className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 rounded-lg transition-colors"
                  >
                    Woohoo🤞!!!
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
