"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { CheckCircle, Twitter, Instagram, Youtube } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import TopNavbar from "@/components/TopNav"
import { useToast } from "@/hooks/use-toast"


export default function ComingSoon() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [hasJoinedWaitlist, setHasJoinedWaitlist] = useState(false)
  const { toast } = useToast()

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim()) {
      toast({
        title: "Error",
        description: "Please enter your email address",
      })
      return
    }

    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.append("email", email.trim())

      const response = await fetch(`/api/waitlist`, {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (result.success) {
        setHasJoinedWaitlist(true)
        setEmail("")
      } else {
        toast({
          title: "Error",
          description: result.message,
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  const fadeInUpOnScroll = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <div className="fixed inset-0 z-0">
        <Image
          src="/images/community-img.jpg"
          alt="Community Background"
          fill
          className="object-cover opacity-2"
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>
      
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-purple-900/40 via-black to-black pointer-events-none"
        animate={{
          opacity: [0.5, 0.7, 0.5],
        }}
        transition={{
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
      />

      {/* Navigation */}
     <motion.div className="px-4 py-6 md:px-6 lg:px-8" initial="hidden" animate="visible" variants={fadeInUp}>
          <TopNavbar />
        </motion.div>
      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 -mt-20">
        <div className="text-center max-w-4xl mx-auto ">
          {/* Coming Soon Badge */}
          <motion.div
            className="inline-flex items-center bg-purple-900/50 rounded-full px-4 py-2 -mt-10 border border-purple-500"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
          >
            <span className="bg-purple-600 text-xs px-3 py-1 rounded-full mr-3"> Groups coming soon..</span>
          </motion.div>

          {/* Hero Title */}
          <motion.h1
            className="text-5xl md:text-6xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Get Ready to
          </motion.h1>

          <motion.h1
            className="text-5xl md:text-6xl font-bold mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <span className="text-purple-400">Compete!</span>
          </motion.h1>

          <motion.p
            className="text-center text-gray-300 max-w-2xl mx-auto mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.6 }}
          >
            Epic tournaments are coming to Walkfit! Challenge players worldwide,
            <br />
            climb the leaderboards, and win amazing crypto rewards.
          </motion.p>
   <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="relative w-full"
        >
          <Image
            src={"/images/footer-sneak.png"}
            width={600}
            height={600}
            alt="Sneaker"
            className="absolute -right-20 bottom-0 opacity-5 -z-10"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="relative w-full"
        >
          <Image
            src={"/images/blue-sneak.png"}
            width={600}
            height={600}
            alt="Sneaker"
            className="absolute -left-20 bottom-0 opacity-5 -z-10"
          />
        </motion.div>
          {/*Group Feature Card */}
        

          {/* Launch Timeline */}
          <motion.div
            className="mb-12 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <p className="text-gray-400 text-sm mb-2">Expected Launch</p>
            <p className="text-2xl font-bold text-purple-400">Q4 2025</p>
          </motion.div>
        </div>

        
      </div>

    

    </div>
  )
}