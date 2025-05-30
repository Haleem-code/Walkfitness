"use client"

import CreateGameModal from "@/components/create-game-modal"

export default function Page() {
  return (
    <div>
      <CreateGameModal onClose={() => {}} onGameCreated={() => {}} />
    </div>
  )
}
