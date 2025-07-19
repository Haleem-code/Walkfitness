"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { useSession } from "next-auth/react"


interface JoinGameModalProps {
  isOpen: boolean
  onClose: () => void
}

interface FormData {
  code: string
}

const JoinGameModal = ({ isOpen, onClose }: JoinGameModalProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { toast } = useToast()
  const { data: session, status } = useSession()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    defaultValues: {
      code: "",
    },
  })

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    setError("")

    if (status !== "authenticated") {
      toast({
        title: "Authentication Error",
        description: "Please sign in to join a game",
      })
      setIsLoading(false)
      return
    }

    try {
      const gameCode = data.code.trim()

      // First, fetch the game details
      const response = await fetch(`/api/games/${gameCode}`)

      if (!response.ok) {
        throw new Error("Game not found. Please check the code and try again.")
      }

      const game = await response.json()

      // Join the game
      const joinResponse = await fetch(`/api/games/${gameCode}/join`, {
        method: "POST",
      })

      if (!joinResponse.ok) {
        const errorData = await joinResponse.json()
        throw new Error(errorData.message || "Failed to join the game")
      }

      toast({
        title: "Success!",
        description: `Successfully joined "${game.name}"!`,
      })

      // Navigate to the game page
      router.push(`/games/${gameCode}`)

      // Close the modal
      onClose()

      // Reset form
      reset()
    } catch (err: unknown) {
      console.error("Error joining game:", err)

      let errorMessage = "An error occurred while joining the game. Please try again."
      if (err instanceof Error) {
        errorMessage = err.message
      }

      setError(errorMessage)

      toast({
        title: "Error",
        description: errorMessage,
      })
    }

    setIsLoading(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Join Game</DialogTitle>
        </DialogHeader>

        {status !== "authenticated" ? (
          <div className="flex flex-col items-center space-y-4 py-4">
            <p className="text-center text-sm">Sign in to join a game</p>
            <Button>Sign In</Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="code" className="text-right">
                  Game Code
                </Label>
                <div className="col-span-3">
                  <Input
                    id="code"
                    placeholder="Enter code"
                    {...register("code", {
                      required: "Game code is required",
                      minLength: { value: 4, message: "Code must be at least 4 characters" },
                    })}
                  />
                  {errors.code && <p className="text-red-500 text-sm mt-1">{errors.code.message}</p>}
                </div>
              </div>

              {error && <div className="text-red-500 text-sm">{error}</div>}
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
                  "Join Game"
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default JoinGameModal
