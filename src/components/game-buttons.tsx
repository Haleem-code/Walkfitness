'use client'

import { useState } from 'react'
import { Card } from "@/components/ui/card"
import { FaArrowRight } from 'react-icons/fa'
import CreateGameModal from '@/components/create-game-modal'
import JoinGameModal from '@/components/join-game-modal'

interface GameButtonsProps {
  createGameBg?: string;
  joinGameBg?: string;
}

export default function GameButtons({ 
  createGameBg = '/placeholder.svg?height=400&width=600',
  joinGameBg = '/placeholder.svg?height=400&width=600'
}: GameButtonsProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {/* Create Game Card */}
      <Card className="relative overflow-hidden h-[300px] md:h-[350px] xl:h-[400px] hover:bg-[#c5f9d7] transition-all duration-300">
        <div 
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ backgroundImage: `url(${createGameBg})` }}
        />
        <div className="absolute inset-0 bg-black/40 z-10" /> {/* Overlay for better text visibility */}
        <div className="absolute inset-0 bg-[#c5f9d7]/30 z-20 flex justify-center items-center flex-col text-white text-xl font-bold">
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center space-x-2 transform hover:scale-110 active:scale-95 transition-all duration-200"
            type="button"
          >
            <span>Create Game</span>
            <FaArrowRight />
          </button>
        </div>
      </Card>

      {/* Join Game Card */}
      <Card className="relative overflow-hidden h-[300px] md:h-[350px] xl:h-[400px] hover:bg-[#c5f9d7] transition-all duration-300">
        <div 
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ backgroundImage: `url(${joinGameBg})` }}
        />
        <div className="absolute inset-0 bg-black/40 z-10" /> {/* Overlay for better text visibility */}
        <div className="absolute inset-0 bg-[#c5f9d7]/30 z-20 flex justify-center items-center flex-col text-white text-xl font-bold">
          <button 
            onClick={() => setIsJoinModalOpen(true)}
            className="flex items-center space-x-2 transform hover:scale-110 active:scale-95 transition-all duration-200"
            type="button"
          >
            <span>Join Game</span>
            <FaArrowRight />
          </button>
        </div>
      </Card>

      <CreateGameModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
      />
      <JoinGameModal 
        isOpen={isJoinModalOpen} 
        onClose={() => setIsJoinModalOpen(false)} 
      />
    </div>
  )
}
