// // app/tournaments/components/TournamentList.tsx
// import { getTournaments } from '@/backend/data'
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"

// export default async function TournamentList() {
//   try {
//     const tournaments = await getTournaments();

//     if (!tournaments || tournaments.length === 0) {
//       return <p>No tournaments available.</p>;
//     }

//     return (
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//         {tournaments.map((tournament) => (
//           <Card key={tournament._id}>
//             <CardHeader>
//               <CardTitle>{tournament.name}</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <p>Steps: {tournament.tournamentsteps}</p>
//               <p>Duration: {tournament.duration}</p>
//               <p>Amount: ${tournament.amount}</p>
//               <Button className="mt-2">Join</Button>
//             </CardContent>
//           </Card>
//         ))}
//       </div>
//     );
//   } catch (error: any) {
//     return <p className="text-red-500">Error loading tournaments: {error.message}</p>;
//   }
// }