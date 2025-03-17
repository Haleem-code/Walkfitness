"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { useAnchorWallet, useWallet } from "@solana/wallet-adapter-react"
import { Connection, PublicKey, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js"
import { AnchorProvider, BN, Program } from "@coral-xyz/anchor"
import type { Idl } from "@coral-xyz/anchor"
import idl from "@/lib/idl.json"
import type { Walkfit } from "@/lib/idlType"
import { CustomWalletMultiButton } from "@/providers/WalletConnect"
import { useNetwork } from "@/hooks/useNetwork"

interface JoinTournamentModalProps {
  isOpen: boolean
  onClose: () => void
}

interface FormData {
  code: string;
}

const JoinTournamentModal: React.FC<JoinTournamentModalProps> = ({ isOpen, onClose }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { toast } = useToast()
  const anchorWallet = useAnchorWallet()
  const { publicKey, connected } = useWallet()
  const { network } = useNetwork()
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    defaultValues: {
      code: ""
    }
  })

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    setError("")

    if (!connected || !publicKey || !anchorWallet) {
      toast({
        title: "Wallet Error",
        description: "Please connect your wallet first",
      })
      setIsLoading(false)
      return
    }

    try {
      const gameCode = data.code.trim().toUpperCase();
      
      // Convert gameCode to a numeric value for use as gameId
      // Use the same conversion logic as CreateTournamentModal
      let numericValue = 0;
      for (let i = 0; i < gameCode.length; i++) {
        numericValue = (numericValue * 31 + gameCode.charCodeAt(i)) % 1000000000;
      }
      console.log("Tournament code:", gameCode);
      console.log("Calculated numeric value:", numericValue);
      
      // Create a BN from the numeric value
      const gameId = new BN(numericValue);
      console.log("BN gameId:", gameId.toString());
      
      // First, fetch the tournament details to get the creator and entry price
      const response = await fetch(`/api/tournaments/${gameCode}`);
      
      if (!response.ok) {
        throw new Error("Tournament not found. Please check the code and try again.");
      }
      
      const tournament = await response.json();
      console.log("Tournament data from API:", tournament);
      
      if (!tournament.walletId) {
        throw new Error("Tournament creator wallet ID is missing. Cannot join this tournament.");
      }
      
      try {
        console.log("Attempting to create PublicKey from walletId:", tournament.walletId);
        const creatorPubkey = new PublicKey(tournament.walletId);
        console.log("CreatorPubkey created successfully:", creatorPubkey.toString());
        
        // Establish connection to the Solana network
        const connection = new Connection(network.endpoint);
        
        // Create a provider
        const provider = new AnchorProvider(
          connection,
          anchorWallet,
          { commitment: "processed" }
        );
        
        // Create a program instance
        const programId = new PublicKey(idl.address);
        const program = new Program(idl as Idl, provider) as Program<Walkfit>;
        
        // Find the Game PDA (same as in CreateTournamentModal)
        const [gamePda] = PublicKey.findProgramAddressSync(
          [
            Buffer.from("game"),
            creatorPubkey.toBuffer(),
            gameId.toArrayLike(Buffer, "le", 8)
          ],
          programId
        );
        
        console.log("Game PDA:", gamePda.toString());
        
        // Create a descriptive message for the transaction
        toast({
          title: "Joining Tournament",
          description: `Please approve the transaction in your wallet to join "${tournament.name}" with ${tournament.amount} SOL entry fee`,
        });
        
        // Call the joinGame instruction
        const txSignature = await program.methods
          .joinGame()
          .accounts({
            game: gamePda,
            player: publicKey,
          })
          .rpc({
            commitment: "confirmed",
            skipPreflight: false,
            preflightCommitment: "processed",
          });
        
        console.log("Transaction signature:", txSignature);
        
        toast({
          title: "Success!",
          description: "Successfully joined the tournament!",
        });
        
        // Navigate to the tournament page
        router.push(`/tournaments/${gameCode}`);
        
        // Close the modal
        onClose();
        
        // Reset form
        reset();
      } catch (err: unknown) {
        console.error("Error creating PublicKey from walletId:", err);
        
        let errorMessage = "An error occurred while creating PublicKey from walletId. Please try again.";
        if (err instanceof Error) {
          errorMessage = err.message;
        }
        
        setError(errorMessage);
        
        toast({
          title: "Error",
          description: errorMessage,
        });
      }
    } catch (err: unknown) {
      console.error("Error joining tournament:", err);
      
      let errorMessage = "An error occurred while joining the tournament. Please try again.";
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      
      toast({
        title: "Error",
        description: errorMessage,
      });
    }
    
    setIsLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="text-black">
        <DialogHeader>
          <DialogTitle>Join Tournament</DialogTitle>
        </DialogHeader>
        
        {!connected ? (
          <div className="flex flex-col items-center space-y-4 py-4">
            <p className="text-center text-sm">Connect your wallet to join a tournament</p>
            <CustomWalletMultiButton />
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="code" className="text-right">
                  Tournament Code
                </Label>
                <div className="col-span-3">
                  <Input 
                    id="code"
                    placeholder="Enter code"
                    {...register("code", { 
                      required: "Tournament code is required",
                      minLength: { value: 4, message: "Code must be at least 4 characters" }
                    })}
                  />
                  {errors.code && (
                    <p className="text-red-500 text-sm mt-1">{errors.code.message}</p>
                  )}
                </div>
              </div>
              
              {error && (
                <div className="text-red-500 text-sm">{error}</div>
              )}
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button type="button" onClick={onClose} variant="outline">
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading}
                className="bg-[#CEFF67] text-black hover:bg-[#B9E94C] border-2 border-double border-black"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Joining...
                  </>
                ) : (
                  "Join Tournament"
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default JoinTournamentModal;
