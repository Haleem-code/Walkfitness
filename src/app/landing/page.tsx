"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ChevronDown, Trophy, Store, DollarSign, Twitter, Instagram, Youtube } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"

export default function WalkfitLanding() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0)

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index)
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

  const faqs = [
    {
      question: "What is Eclipse L2?",
      answer:
        "Eclipse L2 is a high-performance Layer 2 scaling solution that provides fast, secure, and low-cost transactions. It enhances the capabilities of the base layer while maintaining security and decentralization.",
    },
    {
      question: "What is Walkfit?",
      answer:
        "Walkfit is a move-to-earn platform that rewards users with cryptocurrency for physical activity. Track your steps and earn rewards while staying fit.",
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
        "Download the Walkfit app, create an account, connect your wallet, and start walking to earn rewards. It's that simple!",
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
        className="relative z-10 flex justify-between items-center p-4 max-w-7xl mx-auto border-b border-gray-600"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center">
          <motion.div whileHover={{ scale: 1.05 }} className="text-2xl font-bold text-white">
          <Image src={"/images/logo2.svg"} width={120} height={80} alt="Logo"/>
          </motion.div>
        </div>
        <div className="hidden md:flex space-x-6 border border-gray-600 rounded-full px-6 py-4">
          <Link href="#" className="hover:text-green-400 transition-colors">
            Tournaments
          </Link>
          <Link href="#" className="hover:text-green-400 transition-colors">
            Developer
          </Link>
          <Link href="#" className="hover:text-green-400 transition-colors">
            Marketplace
          </Link>
          <Link href="#" className="hover:text-green-400 transition-colors">
            Blog
          </Link>
          <Link href="#" className="hover:text-green-400 transition-colors">
            FAQs
          </Link>
        </div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button className="bg-purple-600 hover:bg-purple-700 text-white">Get Started</Button>
        </motion.div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-10 pb-20 px-4 max-w-7xl mx-auto">
        <motion.div className="text-center mb-4" initial="hidden" animate="visible" variants={fadeInUp}>
          <motion.div
        className="inline-flex items-center bg-purple-900/50 rounded-full px-3 py-1 mb-6 border border-purple-500"
        whileHover={{ scale: 1.05 }}
          >
        <span className="bg-purple-600 text-xs px-2 py-0.5 rounded-full mr-2">NEW</span>
        <span className="text-sm">We have integrated new Sneakers for web</span>
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
          with <span className="text-green-400">Walkfitness..</span>
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
              className="bg-white text-black font-medium px-6 py-2 rounded-full"
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
          <Image 
        src={"/images/hero-img.svg"} 
        width={1800} 
        height={600} 
        alt="Hero Image"
        className="mx-auto" 
          />
          <div className="flex justify-center mt-4">
        <Image 
          src={"/images/eclipse.svg"} 
          width={120} 
          height={40} 
          alt="Eclipse"
          className="mx-auto" 
        />
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-20 px-4 max-w-7xl mx-auto">
        <motion.div
          className=" mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <motion.h2 className="text-3xl font-bold mb-2 text-green-400" variants={fadeInUp}>
            WALKFIT - Move, Compete, Earn
          </motion.h2>
          <motion.p className="text-gray-300" variants={fadeInUp}>
            Your steps unlock rewards, your movement fuels the game.
          </motion.p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          {/* Feature 1 */}
          <motion.div
            className="bg-black/50 border border-gray-800 rounded-xl p-6"
            variants={fadeInUp}
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="mb-4 bg-yellow-900/30 w-16 h-16 rounded-lg flex items-center justify-center">
              <Trophy className="w-8 h-8 text-yellow-500" />
            </div>
            <h3 className="text-xl font-bold mb-2">Tournaments</h3>
            <p className="text-gray-400 text-sm">
              Compete in step challenges against others and win crypto rewards. The more you move, the closer you are to
              the top.
            </p>
          </motion.div>

          {/* Feature 2 */}
          <motion.div
            className="bg-black/50 border border-gray-800 rounded-xl p-6"
            variants={fadeInUp}
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="mb-4 bg-red-900/30 w-16 h-16 rounded-lg flex items-center justify-center">
              <Store className="w-8 h-8 text-red-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">Marketplace</h3>
            <p className="text-gray-400 text-sm">
              Buy, sell, or trade sneakers. Whether you &apos;re upgrading or cashing out, the marketplace keeps your fitness
              journey flexible and rewarding.
            </p>
          </motion.div>

          {/* Feature 3 */}
          <motion.div
            className="bg-black/50 border border-gray-800 rounded-xl p-6"
            variants={fadeInUp}
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="mb-4 bg-blue-900/30 w-16 h-16 rounded-lg flex items-center justify-center">
              <div className="relative">
                <motion.div
                  className="absolute -left-4 w-6 h-6 rounded-full bg-orange-400"
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 0 }}
                />
                <motion.div
                  className="absolute left-0 w-6 h-6 rounded-full bg-blue-400"
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 0.3 }}
                />
                <motion.div
                  className="absolute left-4 w-6 h-6 rounded-full bg-green-400"
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 0.6 }}
                />
              </div>
            </div>
            <h3 className="text-xl font-bold mb-2">Community</h3>
            <p className="text-gray-400 text-sm">
              Exclusive games designed for fitness communities. Walk, play, and connect while earning in fun and
              engaging ways.
            </p>
          </motion.div>

          {/* Feature 4 */}
          <motion.div
            className="bg-black/50 border border-gray-800 rounded-xl p-6"
            variants={fadeInUp}
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="mb-4 bg-green-900/30 w-16 h-16 rounded-lg flex items-center justify-center">
              <motion.div
                className="relative"
                animate={{ rotate: [0, 10, 0, -10, 0] }}
                transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY }}
              >
                <DollarSign className="w-8 h-8 text-yellow-400" />
              </motion.div>
            </div>
            <h3 className="text-xl font-bold mb-2">Point System</h3>
            <p className="text-gray-400 text-sm">
              Earn points for every action—steps, wins, and achievements. Boost your points and unlock powerful future
              rewards.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* FAQ Section */}
      <section className="relative z-10 py-20 px-4 max-w-7xl mx-auto">
        <motion.div
          className="mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <motion.h2 className="text-3xl font-bold mb-2 text-green-400" variants={fadeInUp}>
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
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          {faqs.map((faq, index) => (
            <motion.div key={index} className="border-b border-gray-800 pb-2" variants={fadeInUp}>
              <motion.button
                className="flex justify-between items-center w-full py-4 text-left"
                onClick={() => toggleFaq(index)}
                whileHover={{ x: 5 }}
              >
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-green-500 mr-3 flex items-center justify-center text-black">
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
      </section>

      {/* Newsletter Section */}
      <section className="relative z-10 py-20 px-4 max-w-4xl mx-auto">
        <motion.div
          className="bg-purple-900/20 border border-purple-800/30 rounded-xl p-12 text-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
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

          <motion.div
            className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto mt-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Input type="email" placeholder="Your email" className="bg-black/50 border-gray-700 text-white" />
            <Button className="bg-white text-black hover:bg-gray-200">Join waitlist</Button>
          </motion.div>

          <motion.p
            className="text-sm text-gray-400 mt-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            Get Latest updates on new game - walkfit team
          </motion.p>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 px-4 border-t border-gray-800">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-2xl font-bold mb-4"><Image src={"/images/logo2.svg"} width={120} height={40} alt="Walkfit Logo" className="mx-auto" /></div>
            <motion.div
          className="flex justify-center space-x-6 mt-12"
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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-2"
          >
            <h4 className="font-medium mb-3">Product</h4>
            <p className="text-sm text-gray-400 hover:text-white transition-colors cursor-pointer">Features</p>
            <p className="text-sm text-gray-400 hover:text-white transition-colors cursor-pointer">Developers</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-2"
          >
            <h4 className="font-medium mb-3">Resources</h4>
            <p className="text-sm text-gray-400 hover:text-white transition-colors cursor-pointer">Tournaments</p>
            <p className="text-sm text-gray-400 hover:text-white transition-colors cursor-pointer">Documentation</p>
            <p className="text-sm text-gray-400 hover:text-white transition-colors cursor-pointer">Marketplace</p>
            <p className="text-sm text-gray-400 hover:text-white transition-colors cursor-pointer">Whitepaper</p>
          </motion.div>

          
        </div>

        
      </footer>
    </div>
  )
}
