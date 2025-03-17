// app/tournaments/page.tsx
import TournamentButtons from '@/components/TournamentButtons'
import TournamentList from '@/components/TournamentList'

export default function TournamentPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4 text-center">Tournaments</h1>
        <TournamentButtons />
    </div>
    </div>
  )
}