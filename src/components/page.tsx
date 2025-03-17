// "use client";

// import { useEffect, useState } from "react";
// import { useSession } from "next-auth/react";
// import { useParams } from "next/navigation";
// import DailyProgressBar from "@/components/DailyProgressBar";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Loader2, Trophy, Calendar, DollarSign, Users } from "lucide-react";
// import { CopyButton } from "@/components/copy-button";

// interface Participant {
//   email: string;
//   tournamentsteps: number;
// }

// interface TournamentData {
//   name: string;
//   code: string;
//   tournamentsteps: number;
//   duration: number;
//   amount: number;
//   participants: Participant[];
// }

// export default function TournamentDetailsPage() {
//   const { data: session, status } = useSession();
//   const params = useParams();
//   const [tournamentData, setTournamentData] = useState<TournamentData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const tournamentCode = params.code as string;

//   useEffect(() => {
//     if (status === "authenticated" && tournamentCode) {
//       const fetchTournamentData = async () => {
//         try {
//           const res = await fetch(`/api/tournaments/${tournamentCode}`);
//           if (res.ok) {
//             const data = await res.json();
//             setTournamentData({
//               ...data,
//               code: tournamentCode,
//             });
//           } else {
//             console.error("Failed to fetch tournament data");
//           }
//         } catch (error) {
//           console.error("Error fetching tournament data:", error);
//         } finally {
//           setLoading(false);
//         }
//       };

//       fetchTournamentData();
//     }
//   }, [status, tournamentCode]);

//   if (status === "loading" || loading) {
//     return (
//       <div className="flex justify-center items-center h-screen bg-gray-900">
//         <Loader2 className="h-12 w-12 animate-spin text-[#CEFF67]" />
//       </div>
//     );
//   }

//   if (!session) {
//     return <p className="text-center mt-24 text-white">You are not authenticated</p>;
//   }

//   if (!tournamentData) {
//     return <p className="text-center mt-24 text-white">No tournament data available</p>;
//   }

//   const sortedParticipants = [...tournamentData.participants].sort(
//     (a, b) => b.tournamentsteps - a.tournamentsteps
//   );

//   return (
//     <div className="text-white pt-24 pb-12 bg-black">
//       <div className="container mx-auto px-4 max-w-5xl">
//         <h1 className="text-4xl font-bold mb-8 text-center text-[#CEFF67]">
//           {tournamentData.name} Tournament
//         </h1>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
//           <Card className="bg-black text-white border-[#CEFF67] border-2">
//             <CardHeader>
//               <CardTitle className="text-2xl font-semibold text-[#CEFF67] flex items-center">
//                 <Trophy className="mr-2" /> Tournament Details
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div>
//                 <p className="text-sm text-gray-400 mb-1">Tournament Code</p>
//                 <div className="flex items-center justify-between p-3 bg-gray-700 rounded-md">
//                   <div className="font-mono text-lg">{tournamentCode}</div>
//                   <CopyButton className="text-black" text={tournamentCode} />
//                 </div>
//               </div>
//               <div className="flex items-center">
//                 <Users className="mr-2 text-[#CEFF67]" />
//                 <p>
//                   <span className="font-semibold">Total Steps Goal:</span>{" "}
//                   {tournamentData.tournamentsteps.toLocaleString()}
//                 </p>
//               </div>
//               <div className="flex items-center">
//                 <Calendar className="mr-2 text-[#CEFF67]" />
//                 <p>
//                   <span className="font-semibold">Duration:</span> {tournamentData.duration} days
//                 </p>
//               </div>
//               <div className="flex items-center">
//                 <DollarSign className="mr-2 text-[#CEFF67]" />
//                 <p>
//                   <span className="font-semibold">Prize Amount:</span> ${tournamentData.amount.toLocaleString()}
//                 </p>
//               </div>
//             </CardContent>
//           </Card>

//           <Card className="bg-black border-[#CEFF67] border-2">
//             <CardHeader>
//               <CardTitle className="text-2xl font-semibold text-[#CEFF67]">Your Progress</CardTitle>
//             </CardHeader>
//             <CardContent>
//               {session &&
//               tournamentData.participants.find((p) => p.email === session.user?.email) ? (
//                 <DailyProgressBar
//                   totalSteps={
//                     tournamentData.participants.find((p) => p.email === session.user?.email)
//                       ?.tournamentsteps || 0
//                   }
//                 />
//               ) : (
//                 <p className="text-center py-8 text-white">
//                   You are not participating in this tournament.
//                 </p>
//               )}
//             </CardContent>
//           </Card>
//         </div>

//         {/* Leaderboard Section */}
//         <Card className="bg-black border-[#CEFF67] border-2">
//           <CardHeader>
//             <CardTitle className="text-2xl font-semibold text-[#CEFF67]">Leaderboard</CardTitle>
//           </CardHeader>
//           <CardContent>
//             {/* Scrollable Table */}
//             <div className="max-h-80 overflow-y-auto">
//               <Table>
//                 <TableHeader>
//                   <TableRow className="border-b border-gray-700">
//                     <TableHead className="text-[#CEFF67]">Rank</TableHead>
//                     <TableHead className="text-[#CEFF67]">Participant</TableHead>
//                     <TableHead className="text-right text-[#CEFF67]">Steps</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {sortedParticipants.map((participant, index) => (
//                     <TableRow key={participant.email} className="border-b border-gray-700 text-white">
//                       <TableCell className="font-medium">{index + 1}</TableCell>
//                       <TableCell>{participant.email}</TableCell>
//                       <TableCell className="text-right">
//                         {participant.tournamentsteps.toLocaleString()}
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }
