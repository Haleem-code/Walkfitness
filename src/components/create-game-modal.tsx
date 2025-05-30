"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus } from "lucide-react"
import TopNavbar from "./TopNav"

interface CreateGameModalProps {
  onClose: () => void
  onGameCreated: () => void
}

export default function CreateGameModal({ onClose, onGameCreated }: CreateGameModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    playerLimit: "",
    totalSteps: "",
    entryPrice: 15 as number | "custom",
    customEntryPrice: "",
    startDate: "06-31-2025",
    duration: "3 Days",
    customDuration: "",
    isSponsored: false,
    banner: null as File | null,
  })

  const [showCustomPrice, setShowCustomPrice] = useState(false)
  const [showCustomDuration, setShowCustomDuration] = useState(false)

  const entryPriceOptions = [15, 20]
  const durationOptions = ["3 Days", "1 Week", "6 Days"]

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) setFormData((prev) => ({ ...prev, banner: file }))
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

  const handleSubmit = async () => {
    try {
      if (!formData.name.trim()) return alert("Please enter a game name")
      if (!formData.playerLimit || Number(formData.playerLimit) <= 0) return alert("Invalid player limit")
      if (!formData.totalSteps || Number(formData.totalSteps) <= 0) return alert("Invalid total steps")

      const finalEntryPrice =
        formData.entryPrice === "custom" ? Number(formData.customEntryPrice) : formData.entryPrice
      const finalDuration = formData.duration === "custom" ? formData.customDuration : formData.duration

      const formDataToSend = new FormData()
      formDataToSend.append("name", formData.name)
      formDataToSend.append("playerLimit", formData.playerLimit)
      formDataToSend.append("totalSteps", formData.totalSteps)
      formDataToSend.append("entryPrice", String(finalEntryPrice))
      formDataToSend.append("startDate", formData.startDate)
      formDataToSend.append("duration", finalDuration)
      formDataToSend.append("isSponsored", String(formData.isSponsored))
      if (formData.banner) formDataToSend.append("banner", formData.banner)

      const response = await fetch("/api/games/create-games", {
        method: "POST",
        body: formDataToSend,
      })

      if (response.ok) {
        onGameCreated()
        onClose()
      } else {
        const errorData = await response.json()
        alert(errorData.message || "Failed to create game")
      }
    } catch (error) {
      console.error("Failed to create game:", error)
      alert("Failed to create game")
    }
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-indigo-900 via-purple-900 to-black flex flex-col 
    ">
      {/* <TopNavbar /> */}

      {/* Scrollable content container */}
      <div className="flex-1 overflow-y-auto">
        <div className="min-h-full px-4 sm:px-6 py-4 pb-20">
          <h1 className="text-white text-xl sm:text-2xl font-bold text-center mb-6 sm:mb-8 sticky top-0 bg-gradient-to-b from-indigo-900 via-purple-900 to-transparent mt-8">
            Create New Game
          </h1>

          {/* Form content */}
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Banner Upload */}
            <div>
              <div className="border-2 border-dashed border-gray-600 rounded-2xl p-6 sm:p-8 text-center bg-gray-800/30">
                <input id="banner-upload" type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                <label htmlFor="banner-upload" className="cursor-pointer block">
                  {formData.banner ? (
                    <div>
                      <div className="text-green-400 mb-2">✓ Banner uploaded</div>
                      <div className="text-sm text-gray-400">{formData.banner.name}</div>
                    </div>
                  ) : (
                    <>
                      <Plus className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-gray-400" />
                      <div className="text-gray-400 text-base sm:text-lg">Add Game Banner</div>
                    </>
                  )}
                </label>
              </div>
            </div>

            {/* Game Name */}
            <Input
              placeholder="Enter Game Name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 rounded-2xl h-12 sm:h-14 text-base sm:text-lg"
            />

            {/* Player Limit and Total Steps */}
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

            {/* Entry Price */}
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

            {/* Start Date and Sponsored */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <div className="text-green-400 text-sm font-medium mb-3">Start Date</div>
                <div className="bg-gray-800/50 border border-gray-600 rounded-2xl h-12 sm:h-14 flex items-center px-4 text-white">
                  {formData.startDate}
                </div>
              </div>
              <div>
                <div className="text-green-400 text-sm font-medium mb-3">Sponsored</div>
                <Button
                  variant="ghost"
                  className={`${
                    formData.isSponsored ? "bg-green-400 text-black" : "bg-green-600 text-white"
                  } rounded-2xl h-12 sm:h-14 w-full font-semibold hover:opacity-80`}
                  onClick={() => handleInputChange("isSponsored", !formData.isSponsored)}
                >
                  {formData.isSponsored ? "Yes" : "Sponsored"}
                </Button>
              </div>
            </div>

            {/* Duration */}
            <div>
              <div className="text-green-400 text-sm font-medium mb-3">Days</div>
              <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-3 mb-3">
                {durationOptions.map((duration) => (
                  <Button
                    key={duration}
                    variant="ghost"
                    className={`${
                      formData.duration === duration ? "bg-green-400 text-black" : "bg-purple-600 text-white"
                    } rounded-full px-3 py-2 sm:px-6 sm:py-3 font-semibold text-sm sm:text-base`}
                    onClick={() => handleDurationSelect(duration)}
                  >
                    {duration}
                  </Button>
                ))}
                <Button
                  variant="ghost"
                  className={`${
                    showCustomDuration ? "bg-green-400 text-black" : "bg-purple-600 text-white"
                  } rounded-full px-3 py-2 sm:px-6 sm:py-3 font-semibold text-sm sm:text-base col-span-2 sm:col-span-1`}
                  onClick={handleCustomDuration}
                >
                  Custom
                </Button>
              </div>
              {showCustomDuration && (
                <Input
                  placeholder="Enter custom duration"
                  value={formData.customDuration}
                  onChange={(e) => handleInputChange("customDuration", e.target.value)}
                  className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 rounded-2xl h-12"
                />
              )}
            </div>

            {/* Create Button */}
            <div className="pt-4">
              <Button
                onClick={handleSubmit}
                className="w-full bg-green-400 hover:bg-green-500 text-black font-bold py-4 sm:py-6 text-lg sm:text-xl rounded-2xl"
              >
                CREATE
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
