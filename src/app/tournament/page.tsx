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

      const response = await fetch("/api/waitlist", {
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
    
      {/* Main Content */} <motion.div className="px-4 py-6 md:px-6 lg:px-8" initial="hidden" animate="visible" variants={fadeInUp}>
                <TopNavbar />
              </motion.div>
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 pt-20">
        <div className="text-center max-w-4xl mx-auto">
          {/* Coming Soon Badge */}
          <motion.div
            className="inline-flex items-center bg-purple-900/50 rounded-full px-4 py-2 mb-8 border border-purple-500"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
          >
            <span className="bg-purple-600 text-xs px-3 py-1 rounded-full mr-3">Tournament coming soon...</span>
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
            <span className="text-green-400">Compete!</span>
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
            className="absolute -right-20 bottom-0 opacity-10 -z-10"
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
            className="absolute -left-20 bottom-0 opacity-10 -z-10"
          />
        </motion.div>
          {/* Tournament Feature Card */}
          <motion.div
            className="bg-[#D9D9D91A] rounded-xl p-8 mb-12 overflow-hidden relative max-w-md mx-auto"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            whileHover={{ y: -5 }}
          >
            <div className="flex flex-col h-full">
              <div className="mb-6 flex justify-center">
                <div className="w-32 h-32 relative">
                  <Image
                    src={"/images/tournament.svg"}
                    width={128}
                    height={128}
                    alt="Tournament"
                    className="w-full h-full"
                  />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-3">Tournaments</h3>
              <p className="text-gray-400">
                Compete in step challenges against others and win crypto rewards. The more you move, the closer you are
                to the top.
              </p>
            </div>
            
          </motion.div>

          {/* Launch Timeline */}
          <motion.div
            className="mb-12 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <p className="text-gray-400 text-sm mb-2">Expected Launch</p>
            <p className="text-2xl font-bold text-purple-400">Q2 2024</p>
          </motion.div>
        </div>

        
      </div>

      {/* Waitlist Section */}
      <section className="relative z-10 py-20 px-4 max-w-4xl mx-auto">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero-bg.svg"
            alt="Hero Background"
            fill
            className="object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-purple-900/40" />
        </div>

        {/* Content */}
        <motion.div
          className="text-center relative z-10 py-12"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2
            className="text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Be the First to <span className="text-purple-400">Compete</span>
          </motion.h2>

          {!hasJoinedWaitlist ? (
            <>
              <motion.form
                onSubmit={handleWaitlistSubmit}
                className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto mt-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Input
                  type="email"
                  placeholder="Your email"
                  className="bg-black/50 border-gray-700 text-white"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                />
                <Button type="submit" className="bg-white text-black hover:bg-gray-200" disabled={isLoading}>
                  {isLoading ? "Joining..." : "Join waitlist"}
                </Button>
              </motion.form>

              <motion.p
                className="text-sm text-gray-400 mt-6"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                Get notified when tournaments go live - walkfit team
              </motion.p>
            </>
          ) : (
            <motion.div
              className="mt-8"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className="flex items-center justify-center mb-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <CheckCircle className="w-16 h-16 text-green-400" />
              </motion.div>

              <motion.h3
                className="text-2xl font-bold text-green-400 mb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                You&apos;re in the tournament queue! 🏆
              </motion.h3>

              <motion.p
                className="text-gray-300 mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                We&apos;ll notify you as soon as tournaments launch. Get ready to compete and win crypto rewards!
              </motion.p>

              <motion.p
                className="text-sm text-gray-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Follow us on social media for tournament updates
              </motion.p>
            </motion.div>
          )}
        </motion.div>
      </section>

    </div>
  )
}