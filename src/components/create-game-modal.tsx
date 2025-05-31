"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Check, Copy } from "lucide-react"
import { useSession } from "next-auth/react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import Image from "next/image"

interface CreateGameModalProps {
  onClose: () => void
  onGameCreated: () => void
}

export default function CreateGameModal({ onClose, onGameCreated }: CreateGameModalProps) {
  const { data: session } = useSession()
  const [formData, setFormData] = useState({
    name: "",
    playerLimit: "",
    totalSteps: "",
    entryPrice: 15 as number | "custom",
    customEntryPrice: "",
    startDate: new Date().toISOString().split('T')[0],
    duration: "3 Days",
    customDuration: "",
    gameType: "public" as "public" | "private" | "sponsored",
    banner: null as File | null,
    bannerPreview: "" as string | null,
  })

  const [showCustomPrice, setShowCustomPrice] = useState(false)
  const [showCustomDuration, setShowCustomDuration] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [gameCreated, setGameCreated] = useState(false)
  const [inviteCode, setInviteCode] = useState("")
  const [copied, setCopied] = useState(false)

  const entryPriceOptions = [15, 20]
  const durationOptions = ["3 Days", "1 Week", "6 Days"]

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      setFormData((prev) => ({ 
        ...prev, 
        banner: file,
        bannerPreview: URL.createObjectURL(file)
      }))
    } else {
      alert('Please select a valid image file')
    }
  }

  const handleCustomPrice = () => {
    setShowCustomPrice(true)
    handleInputChange("entryPrice", "custom")
  }

  const handleCustomDuration = () => {
    setShowCustomDuration(true)
    handleInputChange("duration", "custom")
  }

  const handlePriceSelect = (price: number) => {
    setShowCustomPrice(false)
    handleInputChange("entryPrice", price)
    handleInputChange("customEntryPrice", "")
  }

  const handleDurationSelect = (duration: string) => {
    setShowCustomDuration(false)
    handleInputChange("duration", duration)
    handleInputChange("customDuration", "")
  }

  const parseDurationToDays = (duration: string): number => {
    const lowerDuration = duration.toLowerCase()
    if (lowerDuration.includes('week')) {
      const weeks = parseInt(lowerDuration) || 1
      return weeks * 7
    } else if (lowerDuration.includes('day')) {
      return parseInt(lowerDuration) || 1
    } else {
      return parseInt(duration) || 1
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(inviteCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy code')
    }
  }

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)
      
      if (!formData.name.trim()) {
        alert("Please enter a game name")
        return
      }
      if (!formData.playerLimit || Number(formData.playerLimit) <= 0) {
        alert("Invalid player limit")
        return
      }
      if (!formData.totalSteps || Number(formData.totalSteps) <= 0) {
        alert("Invalid total steps")
        return
      }
      if (!session?.user?.email) {
        alert("You must be logged in to create a game")
        return
      }

      const finalEntryPrice = formData.entryPrice === "custom" ? 
        Number(formData.customEntryPrice) : formData.entryPrice
      const finalDuration = formData.duration === "custom" ? 
        formData.customDuration : formData.duration
      const durationInDays = parseDurationToDays(finalDuration)

      const gameData = {
        name: formData.name.trim(),
        gameSteps: Number(formData.totalSteps),
        duration: durationInDays,
        entryPrice: finalEntryPrice,
        gameType: formData.gameType,
        creator: session.user.email,
        startDate: new Date(formData.startDate).toISOString(),
        maxPlayers: Number(formData.playerLimit),
        image: null
      }

      console.log("Sending game data:", gameData)

      // Create FormData to handle file upload
      const formDataToSend = new FormData()
      formDataToSend.append("data", JSON.stringify(gameData))
      if (formData.banner) {
        formDataToSend.append("banner", formData.banner)
      }

      const response = await fetch("/api/games/create-games", {
        method: "POST",
        body: formDataToSend,
      })

      const responseData = await response.json()
      console.log("API response:", responseData)

      if (response.ok && responseData.success) {
        setGameCreated(true)
        
        if (formData.gameType === "private" && responseData.inviteCode) {
          setInviteCode(responseData.inviteCode)
        } else {
          // For public and sponsored games, close immediately and refresh
          onGameCreated()
          onClose()
        }
      } else {
        alert(responseData.error || "Failed to create game")
      }
    } catch (error) {
      console.error("Failed to create game:", error)
      alert("Failed to create game. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFinish = () => {
    onGameCreated()
    window.location.href = '/walk'
  }

  if (gameCreated && formData.gameType === "private") {
    return (
      <div className="fixed inset-0 bg-gradient-to-b from-indigo-900 via-purple-900 to-black flex flex-col items-center justify-center px-4">
        <div className="max-w-md w-full bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 text-center">
          <div className="w-16 h-16 bg-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-8 h-8 text-black" />
          </div>
          
          <h2 className="text-white text-2xl font-bold mb-2">Game Created!</h2>
          <p className="text-gray-300 mb-6">Share this invite code with your friends</p>
          
          {/* Game Code Display */}
          <div className="bg-gray-700/50 rounded-2xl p-4 mb-6">
            <div className="text-gray-400 text-sm mb-2">Invite Code</div>
            <div className="flex items-center justify-between bg-gray-600/50 rounded-lg p-3">
              <div className="font-mono text-xl text-white font-bold tracking-widest">
                {inviteCode}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyToClipboard}
                className="h-10 w-10 p-0 hover:bg-gray-500/50"
              >
                {copied ? (
                  <Check className="h-5 w-5 text-green-400" />
                ) : (
                  <Copy className="h-5 w-5 text-gray-300" />
                )}
              </Button>
            </div>
            {copied && (
              <div className="text-green-400 text-sm mt-2">Copied to clipboard!</div>
            )}
          </div>
          
          <Button
            onClick={handleFinish}
            className="w-full bg-green-400 hover:bg-green-500 text-black font-bold py-4 text-lg rounded-2xl"
          >
            Done
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-indigo-900 via-purple-900 to-black flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="min-h-full px-4 sm:px-6 py-4 pb-20">
          <h1 className="text-white text-xl sm:text-2xl font-bold text-center mb-6 sm:mb-8 sticky top-0 pt-8 pb-4">
            Create New Game
          </h1>

          <div className="max-w-2xl mx-auto space-y-6">
            <div>
              <label htmlFor="banner-upload" className="cursor-pointer">
                {formData.bannerPreview ? (
                  <div className="relative w-full h-48 rounded-2xl overflow-hidden">
                    <Image
                      src={formData.bannerPreview}
                      alt="Game banner preview"
                      layout="fill"
                      objectFit="cover"
                      className="absolute inset-0"
                    />
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-600 rounded-2xl p-6 sm:p-8 text-center bg-gray-800/30">
                    <Plus className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-gray-400" />
                    <div className="text-gray-400 text-base sm:text-lg">Upload Banner Image</div>
                  </div>
                )}
              </label>
              <input
                id="banner-upload"
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            <Input
              placeholder="Enter Game Name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 rounded-2xl h-12 sm:h-14 text-base sm:text-lg"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <Input
                type="number"
                placeholder="Enter Player Limit"
                value={formData.playerLimit}
                onChange={(e) => handleInputChange("playerLimit", e.target.value)}
                className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 rounded-2xl h-12 sm:h-14"
                min="1"
              />
              <Input
                type="number"
                placeholder="Total Steps"
                value={formData.totalSteps}
                onChange={(e) => handleInputChange("totalSteps", e.target.value)}
                className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 rounded-2xl h-12 sm:h-14"
                min="1"
              />
            </div>

            {/* Game Type Radio Buttons */}
            <div>
              <div className="text-green-400 text-sm font-medium mb-3">Game Type</div>
              <RadioGroup 
                value={formData.gameType}
                onValueChange={(value: "public" | "private" | "sponsored") => 
                  handleInputChange("gameType", value)}
                className="grid grid-cols-3 gap-2"
              >
                <div>
                  <RadioGroupItem value="public" id="public" className="peer sr-only" />
                  <Label
                    htmlFor="public"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-gray-600 bg-gray-800/50 p-3 hover:bg-gray-700/50 peer-data-[state=checked]:border-green-400 [&:has([data-state=checked])]:border-green-400 cursor-pointer"
                  >
                    <span>Public</span>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="private" id="private" className="peer sr-only" />
                  <Label
                    htmlFor="private"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-gray-600 bg-gray-800/50 p-3 hover:bg-gray-700/50 peer-data-[state=checked]:border-green-400 [&:has([data-state=checked])]:border-green-400 cursor-pointer"
                  >
                    <span>Private</span>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="sponsored" id="sponsored" className="peer sr-only" />
                  <Label
                    htmlFor="sponsored"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-gray-600 bg-gray-800/50 p-3 hover:bg-gray-700/50 peer-data-[state=checked]:border-green-400 [&:has([data-state=checked])]:border-green-400 cursor-pointer"
                  >
                    <span>Sponsored</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <div className="text-green-400 text-sm font-medium mb-3">Entry Price</div>
              <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-3 mb-3">
                {entryPriceOptions.map((price) => (
                  <Button
                    key={price}
                    variant="ghost"
                    className={`${
                      formData.entryPrice === price ? "bg-green-400 text-black" : "bg-purple-600 text-white"
                    } rounded-full px-3 py-2 sm:px-6 sm:py-3 font-semibold text-sm sm:text-base`}
                    onClick={() => handlePriceSelect(price)}
                  >
                    $ {price}
                  </Button>
                ))}
                <Button
                  variant="ghost"
                  className={`${
                    showCustomPrice ? "bg-green-400 text-black" : "bg-purple-600 text-white"
                  } rounded-full px-3 py-2 sm:px-6 sm:py-3 font-semibold text-sm sm:text-base col-span-2 sm:col-span-1`}
                  onClick={handleCustomPrice}
                >
                  Custom
                </Button>
              </div>
              {showCustomPrice && (
                <Input
                  type="number"
                  placeholder="Enter custom price"
                  value={formData.customEntryPrice}
                  onChange={(e) => handleInputChange("customEntryPrice", e.target.value)}
                  className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 rounded-2xl h-12"
                  min="1"
                />
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <div className="text-green-400 text-sm font-medium mb-3">Start Date</div>
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange("startDate", e.target.value)}
                  className="bg-gray-800/50 border-gray-600 text-white rounded-2xl h-12 sm:h-14"
                />
              </div>
              <div>
                <div className="text-green-400 text-sm font-medium mb-3">Duration</div>
                <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-3 mb-3">
                  {durationOptions.map((duration) => (
                    <Button
                      key={duration}
                      variant="ghost"
                      className={`${
                        formData.duration === duration ? "bg-green-400 text-black" : "bg-purple-600 text-white"
                      } rounded-full px-3 py-2 sm:px-4 sm:py-2 font-semibold text-xs sm:text-sm`}
                      onClick={() => handleDurationSelect(duration)}
                    >
                      {duration}
                    </Button>
                  ))}
                  <Button
                    variant="ghost"
                    className={`${
                      showCustomDuration ? "bg-green-400 text-black" : "bg-purple-600 text-white"
                    } rounded-full px-3 py-2 sm:px-4 sm:py-2 font-semibold text-xs sm:text-sm col-span-2 sm:col-span-1`}
                    onClick={handleCustomDuration}
                  >
                    Custom
                  </Button>
                </div>
                {showCustomDuration && (
                  <Input
                    type="number"
                    placeholder="Enter days (e.g., 5)"
                    value={formData.customDuration}
                    onChange={(e) => handleInputChange("customDuration", e.target.value)}
                    className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 rounded-2xl h-12"
                    min="1"
                  />
                )}
              </div>
            </div>

            <div className="pt-4">
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full bg-green-400 hover:bg-green-500 text-black font-bold py-4 sm:py-6 text-lg sm:text-xl rounded-2xl disabled:opacity-50"
              >
                {isSubmitting ? "CREATING..." : "CREATE"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}