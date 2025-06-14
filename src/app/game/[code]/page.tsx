"use client";

import { useCallback, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getGameByCode } from "@/backend/data"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import DailyProgressBar from "@/components/DailyProgressBar"
import GameLeaderboard from "@/components/game-leaderboard"
import TopNavbar from "@/components/TopNav"
import { motion } from "framer-motion"
import { Trophy, Users, Calendar, Target, Clock, DollarSign } from "lucide-react"
import Image from "next/image"
import { APP_URL } from '@/config';

interface StepsData {
  totalSteps: number
  lastSevenDaysSteps: number[]
  stepsForLastUpdate: number
}

export default function GamePage() {
  const { code } = useParams();
  const router = useRouter();
  const [userSteps, setUserSteps] = useState(0);

  // Fetch user email
  const { data: userEmailData } = useQuery({
    queryKey: ['userEmail'],
    queryFn: async () => {
      const response = await fetch(`${APP_URL}/api/getemail`);
      const data = await response.json();
      return data.email as string;
    },
  });

  // Fetch game data
  const {
    data: gameData,
    isLoading: isLoadingGame,
    error: gameError
  } = useQuery({
    queryKey: ['game', code],
    queryFn: async () => {
      if (!code) throw new Error('Game code is required');
      const response = await fetch(`${APP_URL}/api/games/${code}`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch game data');
      }
      return response.json();
    },
    enabled: !!code,
  });


  // Fetch steps data
  const {
    data: stepsData,
    isLoading: isLoadingSteps
  } = useQuery({
    queryKey: ['steps', userEmailData, code],
    queryFn: async () => {
      if (!userEmailData || !code) throw new Error('User email and game code are required');
      const response = await fetch(`${APP_URL}/api/users/${userEmailData}/games/${code}/steps`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch steps data');
      }
      return response.json();
    },
    enabled: !!userEmailData && !!code,
  });

  const game = gameData?.game;

  const loading = isLoadingGame || isLoadingSteps;
  const error = gameError?.message || '';
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getGameStatus = () => {
    if (!game) return '';

    const now = new Date();
    const startDate = new Date(game.startDate);
    const endDate = new Date(game.endDate);

    if (now < startDate) return 'Not Started';
    if (now > endDate) return 'Ended';
    return 'Active';
  };



  const getGameTypeColor = (type) => {
    switch (type) {
      case 'sponsored': return 'from-yellow-500 to-orange-500'
      case 'private': return 'from-purple-500 to-pink-500'
      case 'public': return 'from-green-500 to-blue-500'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  const getRankIcon = (rank) => {
    if (rank === 1) return "🥇"
    if (rank === 2) return "🥈"
    if (rank === 3) return "🥉"
    return `#${rank}`
  }

  const getUserProgressPercentage = () => {
    if (!game || !stepsData) return 0;
    return Math.min(100, Math.round((stepsData.stepsForLastUpdate / game.gameSteps) * 100));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-600/30 via-purple-900/20 to-black" />
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mx-auto mb-4" />
            <p>Loading game...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="min-h-screen bg-black text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-600/30 via-purple-900/20 to-black" />
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-400 mb-4">Game Not Found</h1>
            <p className="text-gray-400 mb-4">{error || 'This game does not exist or you do not have access to it.'}</p>
            <Button
              onClick={() => router.push('/walk')}
              className="bg-green-400 hover:bg-green-500 text-black font-bold py-2 px-4 rounded-xl transition-all duration-300"
            >
              Back to Walk Page
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Calculate days remaining and progress
  const endDate = new Date(game.endDate)
  const startDate = new Date(game.startDate)
  const now = new Date()
  const daysRemaining = Math.max(0, Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
  const totalDays = game.duration
  const daysPassed = Math.max(0, totalDays - daysRemaining)
  const progressPercentage = Math.min(100, Math.round((daysPassed / totalDays) * 100))
  const userProgressPercentage = getUserProgressPercentage();

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Background with purple gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-600/30 via-purple-900/20 to-black" />

      {/* Decorative background elements */}
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
        {/* Header */}
        <motion.div
          className="px-4 py-6 md:px-6 lg:px-8"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <div className="max-w-7xl mx-auto">
            <TopNavbar />
            <div className="h-8" />
            <Button
              variant="ghost"
              onClick={() => router.push('/walk')}
              className="text-green-400 hover:text-green-300 hover:bg-transparent mt-4 flex items-center gap-2 px-0"
            >
              ← Back to Games
            </Button>
          </div>
        </motion.div>

        <div className="px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
          {/* Game Header */}
          <motion.div
            className="mb-8"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <div className="bg-black/30 backdrop-blur-md rounded-3xl p-8 border border-gray-600/50">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4 flex-wrap">
                    <h1 className="text-3xl md:text-4xl font-bold">{game.name}</h1>
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r ${getGameTypeColor(game.gameType)} text-white`}>
                      {game.gameType.charAt(0) + game.gameType.slice(1)}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getGameStatus() === 'Active' ? 'bg-green-500/20 text-green-400' :
                      getGameStatus() === 'Ended' ? 'bg-red-500/20 text-red-400' :
                        'bg-yellow-500/20 text-yellow-400'
                      }`}>
                      {getGameStatus()}
                    </span>
                  </div>
                  <p className="text-gray-400 text-lg">
                    {daysRemaining > 0 ? `${daysRemaining} days remaining` : 'Game ended'}
                  </p>
                </div>

                {/* Progress Circle */}
                <div className="flex justify-center lg:justify-end">
                  <div className="relative w-32 h-32">
                    <svg
                      className="absolute inset-0 w-full h-full transform -rotate-90"
                      viewBox="0 0 100 100"
                      role="img"
                      aria-label={`Progress: ${progressPercentage}% complete`}
                    >
                      <title>Game progress: {progressPercentage}% complete</title>
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="6"
                        className="text-gray-700"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="6"
                        className="text-green-400"
                        strokeDasharray={`${(progressPercentage / 100) * 251} 251`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-bold">{progressPercentage}%</span>
                      <span className="text-xs text-gray-400">Complete</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp}>
              <div className="bg-black/30 backdrop-blur-md rounded-2xl p-6 border border-gray-600/50 text-center">
                <Target className="w-8 h-8 text-green-400 mx-auto mb-3" />
                <div className="text-2xl font-bold mb-1">{game.gameSteps?.toLocaleString() || 0}</div>
                <div className="text-sm text-gray-400">Target Steps</div>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <div className="bg-black/30 backdrop-blur-md rounded-2xl p-6 border border-gray-600/50 text-center">
                <Users className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                <div className="text-2xl font-bold mb-1">{game.participants?.length || 0}</div>
                <div className="text-sm text-gray-400">Participants</div>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <div className="bg-black/30 backdrop-blur-md rounded-2xl p-6 border border-gray-600/50 text-center">
                <Clock className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                <div className="text-2xl font-bold mb-1">{daysRemaining}</div>
                <div className="text-sm text-gray-400">Days Left</div>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <div className="bg-black/30 backdrop-blur-md rounded-2xl p-6 border border-gray-600/50 text-center">
                <DollarSign className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
                <div className="text-2xl font-bold mb-1">{game.entryPrice > 0 ? `${game.entryPrice} ETH` : 'Free'}</div>
                <div className="text-sm text-gray-400">Entry Fee</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
            {/* Left Column - Game Details & Your Progress */}
            <div className="lg:col-span-1 space-y-6">
              {/* Game Details */}
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
              >
                <div className="bg-black/30 backdrop-blur-md rounded-2xl p-6 border border-gray-600/50">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-green-400" />
                    Game Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Start Date</span>
                      <span>{new Date(game.startDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">End Date</span>
                      <span>{new Date(game.endDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Duration</span>
                      <span>{game.duration} days</span>
                    </div>
                    {game.gameType === "private" && game.code && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Game Code</span>
                        <span className="font-mono bg-gray-700/50 px-2 py-1 rounded">{game.code}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Entry Fee</span>
                      <span>{game.entryPrice > 0 ? `${game.entryPrice} ETH` : "Free"}</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Your Progress */}
              <motion.div
                             initial="hidden"
                             animate="visible"
                             variants={fadeInUp}
                           >
                             <div className="bg-black/30 backdrop-blur-md rounded-2xl p-6 border border-gray-600/50">
                               <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                 <Trophy className="w-5 h-5 text-green-400" />
                                 Your Progress
                               </h3>
                               <div className="text-center">
                                 <div className="relative w-24 h-24 mx-auto mb-4">
                                   <Image src="/images/sneaker.svg" alt="Steps" width={96} height={96} />
                                 </div>
                                 <div className="text-3xl font-bold mb-2">
                                   {(stepsData?.stepsForLastUpdate || userSteps || 0).toLocaleString()}
                                 </div>
                                 <div className="text-sm text-gray-400 mb-4">Total Steps</div>
                                 <div className="bg-gray-700/50 rounded-full h-2 mb-2">
                                   <div className="bg-gradient-to-r from-green-400 to-blue-400 h-2 rounded-full transition-all duration-500" style={{ width: `${userProgressPercentage}%` }} />
                                 </div>
                                 <div className="text-sm text-gray-400">{userProgressPercentage}% of target reached</div>
                               </div>
             
                             </div>
                           </motion.div>
                         </div>
             
            {/* Right Column - Leaderboard */}
            <div className="lg:col-span-2">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
              >
                <GameLeaderboard
                  gameIdOrCode={code as string}
                  userEmail={userEmailData}
                  className="h-full"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}