"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { X } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import Image from "next/image"

interface CreateGameModalProps {
  isOpen: boolean
  onClose: () => void
  onGameCreated: (game: any) => void
  userEmail: string
  username: string
}

export default function CreateGameModal({ isOpen, onClose, onGameCreated, userEmail, username }: CreateGameModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
    type: "public",
    days: "",
    steps: "",
    maxPlayers: "",
    entryFee: "",
    reward: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setFormData((prev) => ({
          ...prev,
          image: e.target?.result as string,
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/games", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          createdBy: username,
          createdByEmail: userEmail,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Game Created!",
          description:
            data.game.type === "private"
              ? `Private game created with code: ${data.game.code}`
              : "Your game has been created successfully",
        })
        onGameCreated(data.game)
        onClose()
        // Reset form
        setFormData({
          name: "",
          description: "",
          image: "",
          type: "public",
          days: "",
          steps: "",
          maxPlayers: "",
          entryFee: "",
          reward: "",
        })
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to create game",
          
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create game",
    
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-gray-900 border-gray-700 text-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">Create New Game</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Game Type Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Game Type</Label>
            <RadioGroup
              value={formData.type}
              onValueChange={(value) => handleInputChange("type", value)}
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2 p-3 rounded-lg border border-gray-600 hover:border-green-500 transition-colors">
                <RadioGroupItem value="public" id="public" />
                <Label htmlFor="public" className="flex-1 cursor-pointer">
                  <div className="font-medium">Public Game</div>
                  <div className="text-sm text-gray-400">Anyone can join this game</div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 rounded-lg border border-gray-600 hover:border-purple-500 transition-colors">
                <RadioGroupItem value="private" id="private" />
                <Label htmlFor="private" className="flex-1 cursor-pointer">
                  <div className="font-medium">Private Game</div>
                  <div className="text-sm text-gray-400">Invite-only with game code</div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 rounded-lg border border-gray-600 hover:border-blue-500 transition-colors">
                <RadioGroupItem value="sponsored" id="sponsored" />
                <Label htmlFor="sponsored" className="flex-1 cursor-pointer">
                  <div className="font-medium">Sponsored Game</div>
                  <div className="text-sm text-gray-400">Featured game with rewards</div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Game Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Game Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Enter game name"
              className="bg-gray-800 border-gray-600 text-white"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Describe your game..."
              className="bg-gray-800 border-gray-600 text-white min-h-[80px]"
              required
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label>Game Image</Label>
            <div className="flex items-center space-x-3">
              <div className="flex-1">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="bg-gray-800 border-gray-600 text-white file:bg-gray-700 file:text-white file:border-0"
                />
              </div>
              {formData.image && (
                <div className="relative w-16 h-16">
                  <Image
                    src={formData.image || "/placeholder.svg"}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => handleInputChange("image", "")}
                    className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Game Settings Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="days">Duration (Days)</Label>
              <Input
                id="days"
                type="number"
                value={formData.days}
                onChange={(e) => handleInputChange("days", e.target.value)}
                placeholder="7"
                min="1"
                max="365"
                className="bg-gray-800 border-gray-600 text-white"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="steps">Target Steps</Label>
              <Input
                id="steps"
                type="number"
                value={formData.steps}
                onChange={(e) => handleInputChange("steps", e.target.value)}
                placeholder="10000"
                min="100"
                className="bg-gray-800 border-gray-600 text-white"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="maxPlayers">Max Players</Label>
              <Input
                id="maxPlayers"
                type="number"
                value={formData.maxPlayers}
                onChange={(e) => handleInputChange("maxPlayers", e.target.value)}
                placeholder="100"
                min="2"
                max="1000"
                className="bg-gray-800 border-gray-600 text-white"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="entryFee">Entry Fee</Label>
              <Input
                id="entryFee"
                type="number"
                value={formData.entryFee}
                onChange={(e) => handleInputChange("entryFee", e.target.value)}
                placeholder="0"
                min="0"
                step="0.01"
                className="bg-gray-800 border-gray-600 text-white"
                required
              />
            </div>
          </div>

          {/* Reward for sponsored games */}
          {formData.type === "sponsored" && (
            <div className="space-y-2">
              <Label htmlFor="reward">Reward Amount</Label>
              <Input
                id="reward"
                type="number"
                value={formData.reward}
                onChange={(e) => handleInputChange("reward", e.target.value)}
                placeholder="100"
                min="0"
                step="0.01"
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3"
          >
            {isLoading ? "Creating Game..." : "Create Game"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
