"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Plus } from 'lucide-react'

interface CreateGameModalProps {
  onClose: () => void
  onGameCreated: () => void
}

export default function CreateGameModal({ onClose, onGameCreated }: CreateGameModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    playerLimit: "",
    totalSteps: "",
    entryPrice: 15,
    customEntryPrice: "",
    startDate: "06-31-2025",
    duration: "3 Days",
    customDuration: "",
    isSponsored: false,
    banner: null as File | null,
  })

  const entryPriceOptions = [15, 20]
  const durationOptions = ["3 Days", "1 Week", "6 Days"]

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setFormData((prev) => ({ ...prev, banner: file }))
    }
  }

  const handleSubmit = async () => {
    try {
      const formDataToSend = new FormData()

      // Add all form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "banner" && value) {
          formDataToSend.append(key, value)
        } else if (key !== "banner") {
          formDataToSend.append(key, String(value))
        }
      })

      const response = await fetch("/api/games", {
        method: "POST",
        body: formDataToSend,
      })

      if (response.ok) {
        onGameCreated()
        onClose()
      } else {
        alert("Failed to create game")
      }
    } catch (error) {
      console.error("Failed to create game:", error)
      alert("Failed to create game")
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto bg-gray-900 border-gray-700 text-white">
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold text-center mb-6">Create New Game</h2>

        {/* Banner Upload */}
        <div className="mb-6">
          <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center bg-gray-800/50">
            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" id="banner-upload" />
            <label htmlFor="banner-upload" className="cursor-pointer">
              <Plus className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <div className="text-gray-400">Add Game Banner</div>
            </label>
          </div>
        </div>

        {/* Game Name */}
        <Input
          placeholder="Enter Game Name"
          value={formData.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
          className="mb-4 bg-gray-800 border-gray-600 text-white placeholder-gray-400"
        />

        {/* Player Limit and Total Steps */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Input
            placeholder="Enter Player Limit"
            value={formData.playerLimit}
            onChange={(e) => handleInputChange("playerLimit", e.target.value)}
            className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
          />
          <Input
            placeholder="Total Steps"
            value={formData.totalSteps}
            onChange={(e) => handleInputChange("totalSteps", e.target.value)}
            className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
          />
        </div>

        {/* Entry Price */}
        <div className="mb-6">
          <div className="grid grid-cols-4 gap-2">
            <Button
              className="bg-green-400 text-black font-semibold"
              onClick={() => handleInputChange("entryPrice", "custom")}
            >
              Entry Price
            </Button>
            {entryPriceOptions.map((price) => (
              <Button
                key={price}
                variant={formData.entryPrice === price ? "default" : "secondary"}
                className={`${formData.entryPrice === price ? "bg-purple-600" : "bg-purple-500"} text-white`}
                onClick={() => handleInputChange("entryPrice", price)}
              >
                ₹ {price}
              </Button>
            ))}
            <Button
              variant={formData.entryPrice === "custom" ? "default" : "secondary"}
              className={`${formData.entryPrice === "custom" ? "bg-purple-600" : "bg-purple-500"} text-white`}
              onClick={() => handleInputChange("entryPrice", "custom")}
            >
              Custom
            </Button>
          </div>
        </div>

        {/* Start Date and Sponsored */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <Button className="w-full bg-green-400 text-black font-semibold mb-2">Start Date</Button>
            <Input
              value={formData.startDate}
              onChange={(e) => handleInputChange("startDate", e.target.value)}
              className="bg-gray-800 border-gray-600 text-white"
            />
          </div>
          <Button
            variant={formData.isSponsored ? "default" : "secondary"}
            className={`${formData.isSponsored ? "bg-green-400 text-black" : "bg-green-500 text-white"} font-semibold`}
            onClick={() => handleInputChange("isSponsored", !formData.isSponsored)}
          >
            Sponsored
          </Button>
        </div>

        {/* Duration */}
        <div className="mb-8">
          <div className="grid grid-cols-4 gap-2">
            <Button className="bg-green-400 text-black font-semibold">Days</Button>
            {durationOptions.map((duration) => (
              <Button
                key={duration}
                variant={formData.duration === duration ? "default" : "secondary"}
                className={`${formData.duration === duration ? "bg-purple-600" : "bg-purple-500"} text-white text-xs`}
                onClick={() => handleInputChange("duration", duration)}
              >
                {duration}
              </Button>
            ))}
            <Button
              variant={formData.duration === "custom" ? "default" : "secondary"}
              className={`${formData.duration === "custom" ? "bg-purple-600" : "bg-purple-500"} text-white`}
              onClick={() => handleInputChange("duration", "custom")}
            >
              Custom
            </Button>
          </div>
        </div>

        {/* Create Button */}
        <Button
          onClick={handleSubmit}
          className="w-full bg-green-400 hover:bg-green-500 text-black font-bold py-4 text-lg rounded-xl"
        >
          CREATE
        </Button>
      </CardContent>
    </Card>
  )
}
