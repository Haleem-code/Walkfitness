'use client'

import { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { FaArrowRight } from 'react-icons/fa' // Arrow icon for direction
import CreateTournamentModal from './CreateTournamentModal'
import JoinTournamentModal from './JoinTournamentModal'

interface TournamentButtonsProps {
  createTournamentBg?: string;
  joinTournamentBg?: string;
}

export default function TournamentButtons({ 
  createTournamentBg = '/images/create-tournament.jpg',
  joinTournamentBg = '/images/join-tournament.jpg'
}: TournamentButtonsProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {/* Create Tournament Card */}
      <Card className="relative overflow-hidden h-[300px] md:h-[350px] xl:h-[400px] hover:bg-[#c5f9d7] transition-all duration-300">
        <div 
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ backgroundImage: `url(${createTournamentBg})` }}
        />
        <div className="absolute inset-0 bg-black/40 z-10" /> {/* Overlay for better text visibility */}
        <div className="absolute inset-0 bg-[#c5f9d7]/30 z-20 flex justify-center items-center flex-col text-white text-xl font-bold">
          {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
<button 
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center space-x-2 transform hover:scale-110 active:scale-95 transition-all duration-200"
          >
            <span>Create Tournament</span>
            <FaArrowRight />
          </button>
        </div>
      </Card>

      {/* Join Tournament Card */}
      <Card className="relative overflow-hidden h-[30 0px] md:h-[350px] xl:h-[400px] hover:bg-[#c5f9d7] transition-all duration-300">
        <div 
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ backgroundImage: `url(${joinTournamentBg})` }}
        />
        <div className="absolute inset-0 bg-black/40 z-10" /> {/* Overlay for better text visibility */}
        <div className="absolute inset-0 bg-[#c5f9d7]/30 z-20 flex justify-center items-center flex-col text-white text-xl font-bold">
          {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
<button 
            onClick={() => setIsJoinModalOpen(true)}
            className="flex items-center space-x-2 transform hover:scale-110 active:scale-95 transition-all duration-200"
          >
            <span>Join Tournament</span>
            <FaArrowRight />
          </button>
        </div>
      </Card>

      <CreateTournamentModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
      />
      <JoinTournamentModal 
        isOpen={isJoinModalOpen} 
        onClose={() => setIsJoinModalOpen(false)} 
      />
    </div>
  )
}