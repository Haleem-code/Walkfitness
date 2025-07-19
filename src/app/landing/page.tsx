"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ChevronDown, Twitter, Instagram, Youtube, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"


export default function WalkfitLanding() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0)
  const [showGetStartedDialog, setShowGetStartedDialog] = useState(false)
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [hasJoinedWaitlist, setHasJoinedWaitlist] = useState(false)
  const { toast } = useToast()

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index)
  }

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim()) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        //variant: "destructive",
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
          //variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        //variant: "destructive",
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

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.6 },
    },
  }

  const staggerOnScroll = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
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

  const faqs = [
    {
      question: "What is Eclipse L2?",
      answer:
        "Eclipse L2 is a high-performance Layer 2 scaling solution that provides fast, secure, and low-cost transactions. It enhances the capabilities of the base layer while maintaining security and decentralization.",
    },
    {
      question: "What is Walkfit?",
      answer:
        "Walkfit is a walk-to-earn platform that rewards users with cryptocurrency for physical activity. Track your steps and earn rewards while staying fit.",
    },
    {
      question: "What benefits do I get by using Walkfit?",
      answer:
        "Walkfit rewards you with cryptocurrency for staying active, lets you compete with friends, join tournaments, and access an exclusive marketplace for digital and physical goods.",
    },
    {
      question: "Team behind Walkfit?",
      answer:
        "Walkfit is developed by a team of blockchain and fitness enthusiasts dedicated to promoting healthy lifestyles through innovative technology.",
    },
    {
      question: "How do I get started?",
      answer:
        "Download the fitbit app on your mobile device, create an account, connect your fitbit account to walkfit, and start walking to earn rewards through points and tournaments. It's that simple!",
    },
    {
      question: "How does Walkfit ensure security?",
      answer:
        "Walkfit uses advanced encryption and blockchain technology to ensure all transactions and user data are secure and transparent.",
    },
  ]

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
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 border-b border-gray-700 backdrop-blur-sm"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center p-4 max-w-7xl mx-auto">

          <motion.div whileHover={{ scale: 1.05 }} className="text-2xl font-bold text-white">
            <Image src={"/images/logo2.svg"} height={50} width={60} alt="Logo" />
          </motion.div>

          <div className="hidden md:flex space-x-6 border border-gray-700 rounded-full px-6 py-4">
            <Link href="#features" className="hover:text-green-400 transition-colors">
              Tournaments
            </Link>
            <a href="#features" className="hover:text-green-400 transition-colors">
              Community
            </a>
            <a href="#features" className="hover:text-green-400 transition-colors">
              Marketplace
            </a>
            <a href="#faqs" className="hover:text-green-400 transition-colors">
              FAQs
            </a>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              className="bg-purple-600 hover:bg-purple-700 text-white"
              onClick={() => setShowGetStartedDialog(true)}
            >
              Get Started
            </Button>
          </motion.div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-28 pb-20 px-4 max-w-7xl mx-auto">
        <motion.div className="text-center mb-4" initial="hidden" animate="visible" variants={fadeInUp}>
          <motion.div
            className="inline-flex items-center bg-purple-900/50 rounded-full px-3 py-1 mb-6 border border-purple-500"
            whileHover={{ scale: 1.05 }}
          >
            <span className="bg-purple-600 text-xs px-2 py-0.5 rounded-full mr-2">NEW</span>
            <span className="text-sm">We have integrated new Sneakers🎉</span>
          </motion.div>
        </motion.div>

        <motion.h1
          className="text-5xl md:text-6xl font-bold text-center mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          Step into Crypto
        </motion.h1>

        <motion.h1
          className="text-5xl md:text-6xl font-bold text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          with <span className="text-purple-900">Walkfitness..</span>
        </motion.h1>

        <motion.p
          className="text-center text-gray-300 max-w-2xl mx-auto mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.6 }}
        >
          Earn crypto with every step - challenge friends, stay fit,
          <br />
          and get rewarded with WALKFIT. Walk to earn!
        </motion.p>

        <motion.div
          className="flex justify-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8 }}
        >
          <Link href="/authpage">
            <motion.button
              className="bg-white text-purple-900 font-medium px-6 py-2 rounded-full"
              whileHover={{ scale: 1.05, backgroundColor: "#f0f0f0" }}
              whileTap={{ scale: 0.95 }}
            >
              Launch Beta
            </motion.button>
          </Link>
        </motion.div>

        {/* App Preview */}
        <motion.div
          className="relative max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <Image src={"/images/hero-img.svg"} width={1800} height={600} alt="Hero Image" className="mx-auto" />
          <div className="flex justify-center mt-4">
            <a href="https://eclipse.xyz" target="_blank" rel="noopener noreferrer">
              <Image src={"/images/eclipse.svg"} width={120} height={40} alt="Eclipse" className="mx-auto" />
            </a>
          </div>
        </motion.div>
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
      </section>

      {/* Features Section */}
      
    <section id="features" className="relative z-10 py-20 px-4 max-w-7xl mx-auto">
      <motion.div
        className="mb-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <motion.h2 className="text-3xl font-bold mb-2 text-purple-900" variants={fadeInUp}>
          WALKFIT - Move, Compete, Earn
        </motion.h2>
        <motion.p className="text-gray-300" variants={fadeInUp}>
          Your steps unlock rewards, your movement fuels the game.
        </motion.p>
      </motion.div>

      <motion.div
        className="grid md:grid-cols-2 gap-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerOnScroll}
      >
        {/* Feature 1 - Tournaments */}
        <motion.div
          className="rounded-xl p-8 overflow-hidden relative min-h-[300px] bg-cover bg-center"
          style={{
            backgroundImage: `url('/images/tournament-img.jpg?height=900&width=400')`,
          }}
          variants={fadeInUpOnScroll}
          whileHover={{ y: -5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {/* Purple overlay */}
          <div className="absolute inset-0 bg-purple-900/50 rounded-xl"></div>

          <div className="relative z-10 flex flex-col h-full justify-end">
            <h3 className="text-2xl font-bold mb-3 text-white">Tournaments</h3>
            <p className="text-gray-200">
              Compete in step challenges against others and win crypto rewards. The more you move, the closer you are to
              the top.
            </p>
          </div>
        </motion.div>

        {/* Feature 2 - Marketplace */}
        <motion.div
          className="rounded-xl p-8 overflow-hidden relative min-h-[300px] bg-cover bg-center"
          style={{
            backgroundImage: `url('/images/marketplace-img.jpg?height=900&width=400')`,
          }}
          variants={fadeInUpOnScroll}
          whileHover={{ y: -5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {/* Purple overlay */}
          <div className="absolute inset-0 bg-purple-900/50 rounded-xl"></div>

          <div className="relative z-10 flex flex-col h-full justify-end">
            <h3 className="text-2xl font-bold mb-3 text-white">Marketplace</h3>
            <p className="text-gray-200">
              Buy, sell, or trade sneakers. Whether you're upgrading or cashing out, the marketplace keeps your fitness
              journey flexible and rewarding.
            </p>
          </div>
        </motion.div>

        {/* Feature 3 - Community */}
        <motion.div
          className="rounded-xl p-8 overflow-hidden relative min-h-[300px] bg-cover bg-center"
          style={{
            backgroundImage: `url('/images/community-img.jpg?height=900&width=400')`,
          }}
          variants={fadeInUpOnScroll}
          whileHover={{ y: -5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {/* Purple overlay */}
          <div className="absolute inset-0 bg-purple-900/50 rounded-xl"></div>

          <div className="relative z-10 flex flex-col h-full justify-end">
            <h3 className="text-2xl font-bold mb-3 text-white">Community</h3>
            <p className="text-gray-200">
              Exclusive games designed for fitness communities. Walk, play, and connect while earning in fun and
              engaging ways.
            </p>
          </div>
        </motion.div>

        {/* Feature 4 - Point System */}
        <motion.div
          className="rounded-xl p-8 overflow-hidden relative min-h-[300px] bg-cover bg-center"
          style={{
            backgroundImage: `url('/images/point-system-img.jpg?height=900&width=400')`,
          }}
          variants={fadeInUpOnScroll}
          whileHover={{ y: -5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {/* Purple overlay */}
          <div className="absolute inset-0 bg-purple-900/50 rounded-xl"></div>

          <div className="relative z-10 flex flex-col h-full justify-end">
            <h3 className="text-2xl font-bold mb-3 text-white">Point System</h3>
            <p className="text-gray-200">
              Earn points for every action—steps, wins, and achievements. Boost your points and unlock powerful future
              rewards.
            </p>
          </div>
        </motion.div>
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
      </section>

      {/* FAQ Section */}
      <section id="faqs" className="relative z-10 py-20 px-4 max-w-7xl mx-auto">
        <motion.div
          className="mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <motion.h2 className="text-3xl font-bold mb-2 text-purple-900" variants={fadeInUp}>
            FAQs
          </motion.h2>
          <motion.p className="text-gray-300" variants={fadeInUp}>
            Frequently asked questions
          </motion.p>
        </motion.div>

        <motion.div
          className="space-y-4 max-w-3xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerOnScroll}
        >
          {faqs.map((faq, index) => (
            <motion.div key={faq.question} className="border-b border-gray-800 pb-2" variants={fadeInUp}>
              <motion.button
                className="flex justify-between items-center w-full py-4 text-left"
                onClick={() => toggleFaq(index)}
                whileHover={{ x: 5 }}
              >
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-purple-900/50 mr-3 flex items-center justify-center text-white">
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${expandedFaq === index ? "rotate-180" : ""}`}
                    />
                  </div>
                  <span className="font-medium">{faq.question}</span>
                </div>
              </motion.button>

              <motion.div
                initial={false}
                animate={{
                  height: expandedFaq === index ? "auto" : 0,
                  opacity: expandedFaq === index ? 1 : 0,
                  marginBottom: expandedFaq === index ? 16 : 0,
                }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden pl-9 text-gray-400 text-sm"
              >
                <p>{faq.answer}</p>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
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

      </section>
      {/* Newsletter/Waitlist Section */}
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
            Walkfit <span className="text-purple-400">for</span>
            <br />
            everyone.
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
                Get Latest updates on new game - walkfit team
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
                You&apos;ve joined our waitlist! 🎉
              </motion.h3>

              <motion.p
                className="text-gray-300 mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                We&apos;ll notify you as soon as Walkfit launches. Get ready to turn your steps into crypto!
              </motion.p>

              <motion.p
                className="text-sm text-gray-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Follow us on social media for the latest updates
              </motion.p>
            </motion.div>
          )}
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 px-4 border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          {/* Top section with logo and columns */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Logo and social media - full width on mobile, 1 column on desktop */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="md:col-span-1"
            >
              <div className="mb-4">
                <Image src={"/images/logo2.svg"} width={60} height={50} alt="Walkfit Logo" />
              </div>
              <p className="text-sm text-gray-400 mb-4">Turn your daily steps into rewards with walkfit.</p>
              <motion.div
                className="flex space-x-6 mt-4"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <motion.a href="#" whileHover={{ y: -3, color: "#1DA1F2" }} className="text-gray-400 hover:text-white">
                  <Twitter className="w-5 h-5" />
                </motion.a>
                <motion.a href="#" whileHover={{ y: -3, color: "#E1306C" }} className="text-gray-400 hover:text-white">
                  <Instagram className="w-5 h-5" />
                </motion.a>
                <motion.a href="#" whileHover={{ y: -3, color: "#FF0000" }} className="text-gray-400 hover:text-white">
                  <Youtube className="w-5 h-5" />
                </motion.a>
              </motion.div>
            </motion.div>

            {/* Navigation columns - stacked on mobile, 3 columns on desktop */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 md:col-span-3">
              {/* Product column */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="space-y-3"
              >
                <h4 className="font-medium text-white mb-4">Product</h4>
                <p className="text-sm text-gray-400 hover:text-white transition-colors cursor-pointer"><a href="/tournament-page">Tournament</a></p>
                <p className="text-sm text-gray-400 hover:text-white transition-colors cursor-pointer"><a href="/marketplace-page">Marketplace</a></p>
                <p className="text-sm text-gray-400 hover:text-white transition-colors cursor-pointer"><a href="/community-page">Community</a></p>
              </motion.div>

              {/* Company column */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="space-y-3"
              >
                <h4 className="font-medium text-white mb-4">Company</h4>
                <p className="text-sm text-gray-400 hover:text-white transition-colors cursor-pointer"> <a href="/about-us-page">About Us</a></p>
              </motion.div>
            </div>
          </div>

          {/* Bottom section with copyright */}
          <motion.div
            className="pt-8 border-t border-gray-800 mt-8 text-center md:text-left text-sm text-gray-500"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p>© {new Date().getFullYear()} Walkfit. All rights reserved.</p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="#" className="hover:text-white transition-colors">
                  Terms
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  Privacy
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  Cookies
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </footer>

      {/* Get Started Dialog */}
      <Dialog open={showGetStartedDialog} onOpenChange={setShowGetStartedDialog}>
        <DialogContent className="bg-black border border-purple-600 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-green-400">Welcome to Walkfit</DialogTitle>
            <DialogDescription className="text-gray-300">
              Follow these simple steps to begin your fitness journey
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex items-start gap-3">
              <div className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">
                1
              </div>
              <div>
                <h4 className="font-medium text-white">Sign up with Google</h4>
                <p className="text-sm text-gray-300">
                  Create your account quickly and securely using your Google credentials.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">
                2
              </div>
              <div>
                <h4 className="font-medium text-white">Connect Fitbit</h4>
                <p className="text-sm text-gray-300">
                  Authorize Walkfit to access your Fitbit data to track your steps and activities.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">
                3
              </div>
              <div>
                <h4 className="font-medium text-white">Download Fitbit App</h4>
                <p className="text-sm text-gray-300">
                  Install the Fitbit app on your mobile device using the same account you connected to Walkfit.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">
                4
              </div>
              <div>
                <h4 className="font-medium text-white">Start Your Journey</h4>
                <p className="text-sm text-gray-300">
                  Join tournaments, compete with friends, and earn rewards as you improve your fitness.
                </p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Link href="/authpage" className="text-white">
              <Button
                className="w-full bg-green-500 hover:bg-green-600 text-black font-medium"
                onClick={() => setShowGetStartedDialog(false)}
              >
                Got it!
              </Button>
            </Link>
          </DialogFooter>
        </DialogContent>
      </Dialog>


    </div>
  )
}
