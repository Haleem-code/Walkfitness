"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { CopyButton } from "@/components/copy-button"
import { useAnchorWallet, useWallet } from "@solana/wallet-adapter-react"
import { CustomWalletMultiButton } from "@/providers/WalletConnect"
import Image from "next/image"
import { useForm } from 
"react-hook-form"
import { Connection, SystemProgram, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js"
import { AnchorProvider, BN, Program } from "@coral-xyz/anchor"
import type { Idl } from "@coral-xyz/anchor"
import { nanoid } from "nanoid"
import idl from "@/lib/idl.json"
import type { Walkfit } from "@/lib/idlType"
import bs58 from "bs58"
import { useNetwork } from "@/hooks/useNetwork"

interface CreateTournamentModalProps {
  isOpen: boolean
  onClose: () => void
}

type FormData = {
  name: string;
  tournamentsteps: number;
  duration: number;
  amount: number;
}

export default function CreateTournamentModal({ isOpen, onClose }: CreateTournamentModalProps) {
  const { publicKey, connected } = useWallet()
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [generatedCode, setGeneratedCode] = useState("")
  const { network } = useNetwork()
  const [error, setError] = useState("")
  const { toast } = useToast()
  const anchorWallet = useAnchorWallet()

  const {
    register,
    handleSubmit: hookFormSubmit,
    formState: { errors },
    reset
  } = useForm<FormData>({
    defaultValues: {
      name: "",
      tournamentsteps: 10000,
      duration: 7,
      amount: 0.5
    }
  })

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    setError("")

    if (!connected || !publicKey || !anchorWallet) {
      toast({
        title: "Wallet Error",
        description: "Please connect your wallet first",
        // variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    try {
      // Generate a unique code using nanoid
      const gameCode = nanoid(8).toUpperCase();

      // Convert gameCode to a numeric value for use as gameId
      // We need to create a numeric hash from the string that's suitable for BN
      // Use a simpler approach to avoid numeric overflow
      let numericValue = 0;
      for (let i = 0; i < gameCode.length; i++) {
        // Just use character codes with a simple multiplier
        numericValue = (numericValue * 31 + gameCode.charCodeAt(i)) % 1000000000;
      }
      console.log("Original gameCode:", gameCode);
      console.log("Calculated numeric value:", numericValue);

      // Create a BN from the numeric value
      const gameId = new BN(numericValue);
      console.log("BN gameId:", gameId.toString());

      // Convert the entry fee from SONIC to lamports
      const entryPrice = new BN(Math.floor(data.amount * LAMPORTS_PER_SOL)); // Convert to lamports (assuming 9 decimals)
      console.log("Entry price:", entryPrice.toString());

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

      // Find the Game PDA
      try {
        const [gamePda] = PublicKey.findProgramAddressSync(
          [
            Buffer.from("game"),
            publicKey.toBuffer(),
            gameId.toArrayLike(Buffer, "le", 8)
          ],
          programId
        );

        console.log("Game PDA:", gamePda.toString());

        // Create a descriptive message for the transaction
        // This will be displayed to the user while creating the tournament
        toast({
          title: "Creating Tournament",
          description: `Please approve the transaction in your wallet to create "${data.name}" with ${data.amount} SOL entry fee`,
        });

        // Call the createGame instruction
        const txSignature = await program.methods
          .createGame(gameId, entryPrice)
          .accounts({
            // systemProgram: SystemProgram.programId,
            creator: publicKey,
            game: gamePda,
          })
          .rpc({
            commitment: "confirmed",
            skipPreflight: false,
            preflightCommitment: "processed",
          });

        console.log("Transaction signature:", txSignature);

        toast({
          title: "Blockchain Success",
          description: "Game created successfully on-chain!",
        });

        // Now that blockchain transaction succeeded, proceed with API call
        // Format data for API
        const formData = {
          ...data,
          code: gameCode,
          walletId: publicKey.toString()
        };

        console.log("Submitting form data:", formData);

        const response = await fetch("/api/tournaments", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          const errorMessages = {
            400: "Invalid input data",
            401: "Unauthorized. Please make sure your wallet is connected and you have permission to create tournaments.",
            500: "Server error. Please try again later."
          };
          const errorData = await response.json();
          const errorMessage = errorData.message || errorMessages[response.status as keyof typeof errorMessages] || `Unknown error: ${response.status}`;
          throw new Error(errorMessage);
        }

        const responseData = await response.json();
        console.log("Tournament created:", responseData);

        // Set success state with the generated code
        setSuccess(true);
        setGeneratedCode(gameCode);

        toast({
          title: "Success",
          description: "Tournament created successfully!",
        });

        // Reset form after success
        reset();
      } catch (pdaError: unknown) {
        console.error("PDA generation error:", pdaError);
        const errorMessage = pdaError instanceof Error ? pdaError.message : "Failed to generate the game address. Please try again.";
        setError(errorMessage);
        toast({
          title: "Error",
          description: errorMessage,
          //variant: "destructive",
        });
      }
    } catch (err: unknown) {
      console.error("Error creating tournament:", err);

      let errorMessage = "An error occurred while creating the tournament. Please try again."
      if (err instanceof Error) {
        errorMessage = err.message
      }

      setError(errorMessage);

      toast({
        title: "Error",
        description: errorMessage,
        //variant: "destructive",
      });
    }

    setIsLoading(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !isLoading && !open && onClose()}>
      <DialogContent className="text-black max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-center">Create New Tournament</DialogTitle>

        </DialogHeader>

        {connected ? (
          <form onSubmit={hookFormSubmit(onSubmit)} className="mt-2">
            <div className="space-y-6 py-3">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Tournament Name
                </Label>
                <Input
                  id="name"
                  placeholder="Enter a unique tournament name"
                  {...register("name", { required: "Tournament name is required" })}
                  className={`w-full ${errors.name ? "border-red-500" : ""}`}
                />
                {errors.name && (
                  <p className="text-xs text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="tournamentsteps" className="text-sm font-medium">
                  Tournament Target Steps
                </Label>
                <Input
                  id="tournamentsteps"
                  type="number"
                  placeholder="Total steps to achieve during the tournament"
                  {...register("tournamentsteps", {
                    required: "Target steps is required",
                    min: { value: 1, message: "Steps must be greater than 0" }
                  })}
                  className={`w-full ${errors.tournamentsteps ? "border-red-500" : ""}`}
                />
                {errors.tournamentsteps && (
                  <p className="text-xs text-red-500">{errors.tournamentsteps.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration" className="text-sm font-medium">
                    Duration (days)
                  </Label>
                  <Input
                    id="duration"
                    type="number"
                    placeholder="Number of days"
                    {...register("duration", {
                      required: "Duration is required",
                      min: { value: 1, message: "Duration must be at least 1 day" }
                    })}
                    className={`w-full ${errors.duration ? "border-red-500" : ""}`}
                  />
                  {errors.duration && (
                    <p className="text-xs text-red-500">{errors.duration.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-sm font-medium">
                    Entry Fee ($SONIC)
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0 for free tournaments"
                    {...register("amount", {
                      required: "Entry fee is required",
                      min: { value: 0, message: "Fee cannot be negative" }
                    })}
                    className={`w-full ${errors.amount ? "border-red-500" : ""}`}
                    step="0.01"
                  />
                  {errors.amount && (
                    <p className="text-xs text-red-500">{errors.amount.message}</p>
                  )}
                </div>
              </div>

              {success && generatedCode && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
                  <Label className="block font-medium text-green-800 mb-2">Tournament Code</Label>
                  <div className="flex items-center justify-between p-3 bg-white rounded-md border border-green-200">
                    <div className="font-mono text-sm">{generatedCode}</div>
                    <CopyButton text={generatedCode} />
                  </div>
                  <p className="mt-2 text-xs text-green-700">
                    Share this code with participants so they can join your tournament.
                  </p>
                </div>
              )}

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
                  {error}
                </div>
              )}
            </div>

            <div className="flex justify-end items-center gap-4 pt-4 border-t border-gray-200">
              {success && <div className="text-green-600 flex items-center text-sm">Created successfully!</div>}
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
                className="border-gray-300"
              >
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
                    Creating...
                  </>
                ) : (
                  "Create Tournament"
                )}
              </Button>
            </div>
          </form>
        ) : (
          <div className="py-8 text-center">
            <div className="inline-block p-3 mb-4 rounded-full bg-gray-100">
              <Image
                src="/images/wallet.svg"
                alt="Connect Wallet"
                width={40}
                height={40}
              />
            </div>
            <h3 className="text-lg font-medium mb-2">Wallet Connection Required</h3>
            <p className="mb-6 text-gray-500 text-sm">
              Please connect your wallet to create and manage tournaments.
            </p>
            <div className="space-y-3">
              <div className="w-full">
                <CustomWalletMultiButton />
              </div>
              <Button variant="outline" onClick={onClose} className="w-full">
                Cancel
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}