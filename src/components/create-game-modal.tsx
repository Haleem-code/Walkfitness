"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Upload } from "lucide-react"
import { useForm } from "react-hook-form"
import { useSession } from "next-auth/react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { nanoid } from "nanoid"
import GameCodeDisplay from "@/components/game-code-display"

interface CreateGameModalProps {
  isOpen: boolean
  onClose: () => void
}

type FormData = {
  name: string
  gameSteps: number
  duration: number
  entryPrice: number
  gameType: "public" | "private" | "sponsored"
  image?: FileList
}

export default function CreateGameModal({ isOpen, onClose }: CreateGameModalProps) {
  const { data: session, status } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [generatedCode, setGeneratedCode] = useState("")
  const [error, setError] = useState("")
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    setValue,
  } = useForm<FormData>({
    defaultValues: {
      name: "",
      gameSteps: 10000,
      duration: 7,
      entryPrice: 0,
      gameType: "public",
    },
  })

  const gameType = watch("gameType")

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const onSubmit = async (data: FormData) => {
    if (status !== "authenticated") {
      toast({
        title: "Authentication Error",
        description: "Please sign in to create a game",
      })
      return
    }

    setIsLoading(true)
    setError("")

    try {
      // Generate a unique code for private games
      const gameCode = data.gameType === "private" ? nanoid(8).toUpperCase() : null

      // Format data for API
      const formData = new FormData()
      formData.append("name", data.name)
      formData.append("gameSteps", data.gameSteps.toString())
      formData.append("duration", data.duration.toString())
      formData.append("entryPrice", data.entryPrice.toString())
      formData.append("gameType", data.gameType)

      if (gameCode) {
        formData.append("code", gameCode)
      }

      if (data.image && data.image[0]) {
        formData.append("image", data.image[0])
      }

      const response = await fetch("/api/games", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `Error: ${response.status}`)
      }

      const responseData = await response.json()

      // Set success state with the generated code for private games
      setSuccess(true)
      if (gameCode) {
        setGeneratedCode(gameCode)
      }

      toast({
        title: "Success",
        description: "Game created successfully!",
      })

      // Reset form after success
      reset()
      setImagePreview(null)

      // Refresh the games list
      router.refresh()
    } catch (err: unknown) {
      console.error("Error creating game:", err)

      let errorMessage = "An error occurred while creating the game. Please try again."
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
    <Dialog open={isOpen} onOpenChange={(open) => !isLoading && !open && onClose()}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-center">Create New Game</DialogTitle>
        </DialogHeader>

        {status === "authenticated" ? (
          <form onSubmit={handleSubmit(onSubmit)} className="mt-2">
            <div className="space-y-6 py-3">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Game Name
                </Label>
                <Input
                  id="name"
                  placeholder="Enter a unique game name"
                  {...register("name", { required: "Game name is required" })}
                  className={`w-full ${errors.name ? "border-red-500" : ""}`}
                />
                {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="gameType" className="text-sm font-medium">
                  Game Type
                </Label>
                <RadioGroup
                  defaultValue="public"
                  onValueChange={(value) => setValue("gameType", value as "public" | "private" | "sponsored")}
                  className="flex flex-col space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="public" id="public" />
                    <Label htmlFor="public">Public - Anyone can join</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="private" id="private" />
                    <Label htmlFor="private">Private - Join with code only</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="sponsored" id="sponsored" />
                    <Label htmlFor="sponsored">Sponsored - Featured game</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="gameImage" className="text-sm font-medium">
                  Game Image
                </Label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-md bg-gray-100 flex items-center justify-center overflow-hidden">
                    {imagePreview ? (
                      <img
                        src={imagePreview || "/placeholder.svg"}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Upload className="h-6 w-6 text-gray-400" />
                    )}
                  </div>
                  <Input
                    id="gameImage"
                    type="file"
                    accept="image/*"
                    {...register("image")}
                    onChange={handleImageChange}
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="gameSteps" className="text-sm font-medium">
                  Target Steps
                </Label>
                <Input
                  id="gameSteps"
                  type="number"
                  placeholder="Total steps to achieve during the game"
                  {...register("gameSteps", {
                    required: "Target steps is required",
                    min: { value: 1, message: "Steps must be greater than 0" },
                  })}
                  className={`w-full ${errors.gameSteps ? "border-red-500" : ""}`}
                />
                {errors.gameSteps && <p className="text-xs text-red-500">{errors.gameSteps.message}</p>}
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
                      min: { value: 1, message: "Duration must be at least 1 day" },
                    })}
                    className={`w-full ${errors.duration ? "border-red-500" : ""}`}
                  />
                  {errors.duration && <p className="text-xs text-red-500">{errors.duration.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="entryPrice" className="text-sm font-medium">
                    Entry Fee
                  </Label>
                  <Input
                    id="entryPrice"
                    type="number"
                    placeholder="0 for free games"
                    {...register("entryPrice", {
                      required: "Entry fee is required",
                      min: { value: 0, message: "Fee cannot be negative" },
                    })}
                    className={`w-full ${errors.entryPrice ? "border-red-500" : ""}`}
                    step="0.01"
                  />
                  {errors.entryPrice && <p className="text-xs text-red-500">{errors.entryPrice.message}</p>}
                </div>
              </div>

              {success && gameType === "private" && generatedCode && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
                  <Label className="block font-medium text-green-800 mb-2">Game Code</Label>
                  <GameCodeDisplay code={generatedCode} />
                  <p className="mt-2 text-xs text-green-700">
                    Share this code with participants so they can join your game.
                  </p>
                </div>
              )}

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">{error}</div>
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
                  "Create Game"
                )}
              </Button>
            </div>
          </form>
        ) : (
          <div className="py-8 text-center">
            <div className="inline-block p-3 mb-4 rounded-full bg-gray-100">
              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">🔒</span>
              </div>
            </div>
            <h3 className="text-lg font-medium mb-2">Sign In Required</h3>
            <p className="mb-6 text-gray-500 text-sm">Please sign in to create and manage games.</p>
            <div className="space-y-3">
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
