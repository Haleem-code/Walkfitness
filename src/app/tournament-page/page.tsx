"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const fadeInUpOnScroll = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

export default function TournamentPage() {
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
          <div className="flex items-center">
            <motion.div whileHover={{ scale: 1.05 }} className="text-2xl font-bold text-white">
              <Link href="/landing">
                <Image src={"/images/logo2.svg"} width={120} height={80} alt="Logo" />
              </Link>
            </motion.div>
          </div>
          <div className="hidden md:flex space-x-6 border border-gray-700 rounded-full px-6 py-4">
            <Link href="/tournament-page" className="hover:text-green-400 transition-colors">
              Tournaments
            </Link>
            <Link href="#" className="hover:text-green-400 transition-colors">
              Developer
            </Link>
            <Link href="/marketplace-page" className="hover:text-green-400 transition-colors">
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
            <Link href="/authpage">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                Get Started
              </Button>
            </Link>
          </motion.div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-28 pb-20 px-4 max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div
            className="inline-flex items-center bg-green-900/50 rounded-full px-4 py-2 mb-8 border border-green-500"
            variants={fadeInUp}
          >
            <span className="text-2xl mr-2">🏆</span>
            <span className="text-lg font-medium">Challenge the Community</span>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-6xl font-bold text-center mb-8"
            variants={fadeInUp}
          >
            Win Real <span className="text-green-400">Rewards</span>
          </motion.h1>

          <motion.p
            className="text-center text-gray-300 max-w-3xl mx-auto text-lg mb-12"
            variants={fadeInUp}
          >
            Walkfit&apos;s tournament system is where motivation meets competition. Whether you&apos;re walking solo or rolling with your crew, 
            tournaments bring the heat with time-bound, high-stakes step battles that reward consistency, leadership, and hustle.
          </motion.p>

          {/* Tournament Hero Image */}
          <motion.div
            className="relative max-w-2xl mx-auto mb-16"
            variants={fadeInUp}
          >
            <div className="w-60 h-60 mx-auto relative mb-8">
              <Image
                src={"/images/tournament.svg"}
                width={240}
                height={240}
                alt="Tournament"
                className="w-full h-full bg-[#D9D9D91A] p-16 rounded-full object-cover"
              />
            </div>
          </motion.div>

          <motion.div
            className="flex justify-center items-center gap-8 text-lg font-semibold"
            variants={fadeInUp}
          >
            <span className="text-purple-400">The more you move, the closer you get to the top.</span>
          </motion.div>
          <motion.div
            className="flex justify-center items-center gap-8 text-lg font-semibold mt-4"
            variants={fadeInUp}
          >
            <span className="text-green-400">Winners earn.</span>
            <span className="text-red-400">Slackers pay.</span>
          </motion.div>
          <motion.p
            className="text-center text-gray-300 mt-4 text-lg font-medium"
            variants={fadeInUp}
          >
            It&apos;s fitness with skin in the game.
          </motion.p>
        </motion.div>
      </section>

      {/* How It Works Section */}
      <section className="relative z-10 py-20 px-4 max-w-7xl mx-auto">
        <motion.div
          className="mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <motion.h2 className="text-3xl font-bold mb-2 text-green-400" variants={fadeInUp}>
            How It Works
          </motion.h2>
          <motion.p className="text-gray-300" variants={fadeInUp}>
            Simple steps to join the competition and start earning
          </motion.p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          {/* Step 1 */}
          <motion.div
            className="bg-[#D9D9D91A] rounded-xl p-8 text-center"
            variants={fadeInUpOnScroll}
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg  className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3">Join Tournaments</h3>
            <p className="text-gray-400 text-sm">
              Participate in daily, weekly, or custom tournaments against users worldwide or just your crew.
            </p>
          </motion.div>

          {/* Step 2 */}
          <motion.div
            className="bg-[#D9D9D91A] rounded-xl p-8 text-center"
            variants={fadeInUpOnScroll}
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg alt="svg" className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3">Stake to Play</h3>
            <p className="text-gray-400 text-sm">
              Pay an entry fee in USDC then walk to win. Put your money where your movement is.
            </p>
          </motion.div>

          {/* Step 3 */}
          <motion.div
            className="bg-[#D9D9D91A] rounded-xl p-8 text-center"
            variants={fadeInUpOnScroll}
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg alt="svg" className="w-10 h-10 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3">Climb Leaderboard</h3>
            <p className="text-gray-400 text-sm">
              Steps are tracked in real time. Rankings are transparent and powered by Eclipse blockchain for tamper-proof results.
            </p>
          </motion.div>

          {/* Step 4 */}
          <motion.div
            className="bg-[#D9D9D91A] rounded-xl p-8 text-center"
            variants={fadeInUpOnScroll}
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg alt="svg" className="w-10 h-10 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3">Win or Forfeit</h3>
            <p className="text-gray-400 text-sm">
              Those who hit their goals and place in the top ranks split the prize pool. Those who fall behind forfeit a share of their stake.
            </p>
          </motion.div>
        </motion.div>

        {/* Why It Works Section */}
        <motion.div
          className="bg-gradient-to-r from-purple-900/30 to-green-900/30 rounded-2xl p-12 mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUpOnScroll}
        >
          <motion.h2 className="text-3xl font-bold mb-8 text-center" variants={fadeInUp}>
            Why It Works
          </motion.h2>
          
          <motion.div
            className="grid md:grid-cols-2 gap-8"
            variants={staggerContainer}
          >
            <motion.div className="space-y-6" variants={fadeInUp}>
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg alt="svg" className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Financial Accountability</h3>
                  <p className="text-gray-400">Combines financial accountability with social motivation to keep you moving.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg alt="svg" className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Transparent Fair Play</h3>
                  <p className="text-gray-400">Transparent, fair play enforced via smart contracts on Eclipse blockchain.</p>
                </div>
              </div>
            </motion.div>

            <motion.div className="space-y-6" variants={fadeInUp}>
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg alt="svg" className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Individual & Team Competition</h3>
                  <p className="text-gray-400">Supports individual and team-based competition for all fitness levels.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg alt="svg" className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Real Rewards</h3>
                  <p className="text-gray-400">Move-to-Earn with real-world tokens and lasting behavioral change.</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Tournament Types Section */}
        <motion.div
          className="mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUpOnScroll}
        >
          <motion.h2 className="text-3xl font-bold mb-8 text-center text-green-400" variants={fadeInUp}>
            Tournament Types
          </motion.h2>
          
          <motion.div
            className="grid md:grid-cols-3 gap-8"
            variants={staggerContainer}
          >
            <motion.div 
              className="bg-[#D9D9D91A] rounded-xl p-8 text-center"
              variants={fadeInUp}
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg alt="svg" className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Daily Challenges</h3>
              <p className="text-gray-400">
                Quick 24-hour step competitions with instant rewards and daily leaderboards.
              </p>
            </motion.div>

            <motion.div 
              className="bg-[#D9D9D91A] rounded-xl p-8 text-center"
              variants={fadeInUp}
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg alt="svg" className="w-10 h-10 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Weekly Tournaments</h3>
              <p className="text-gray-400">
                Extended competitions with bigger prize pools and more strategic gameplay.
              </p>
            </motion.div>

            <motion.div 
              className="bg-[#D9D9D91A] rounded-xl p-8 text-center"
              variants={fadeInUp}
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg alt="svg" className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Custom Tournaments</h3>
              <p className="text-gray-400">
                Create private tournaments for your friends, community, or organization.
              </p>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Prize Pool Section */}
        <motion.div
          className="bg-gradient-to-r from-green-900/30 to-yellow-900/30 rounded-2xl p-12 mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUpOnScroll}
        >
          <motion.h2 className="text-3xl font-bold mb-8 text-center" variants={fadeInUp}>
            Prize Distribution
          </motion.h2>
          
          <motion.div
            className="grid md:grid-cols-3 gap-8"
            variants={staggerContainer}
          >
            <motion.div 
              className="bg-gradient-to-b from-yellow-500/20 to-yellow-600/20 rounded-xl p-8 text-center border border-yellow-500/30"
              variants={fadeInUp}
            >
              <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg alt="svg" className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-yellow-400">Winners</h3>
              <p className="text-lg font-semibold mb-2">Split the Prize Pool</p>
              <p className="text-gray-400">Top performers share the rewards based on ranking and performance.</p>
            </motion.div>

            <motion.div 
              className="bg-gradient-to-b from-red-500/20 to-red-600/20 rounded-xl p-8 text-center border border-red-500/30"
              variants={fadeInUp}
            >
              <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg alt="svg" className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-red-400">Non-performers</h3>
              <p className="text-lg font-semibold mb-2">Forfeit Stakes</p>
              <p className="text-gray-400">Those who don&apos;t meet goals forfeit their entry fee to the prize pool.</p>
            </motion.div>

            <motion.div 
              className="bg-gradient-to-b from-purple-500/20 to-purple-600/20 rounded-xl p-8 text-center border border-purple-500/30"
              variants={fadeInUp}
            >
              <div className="w-20 h-20 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg alt="svg" className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-purple-400">USDC Stakes</h3>
              <p className="text-lg font-semibold mb-2">Real Money</p>
              <p className="text-gray-400">All entry fees and prizes are in USDC for real value and instant payouts.</p>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className="text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUpOnScroll}
        >
          <motion.h2 className="text-4xl font-bold mb-6" variants={fadeInUp}>
            Ready to put your <span className="text-green-400">fitness on the line?</span>
          </motion.h2>
          
          <motion.p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto" variants={fadeInUp}>
            Join tournaments where your commitment pays off and your consistency gets rewarded. 
            The community is waiting for you to make your move.
          </motion.p>
          
          <motion.div className="flex justify-center gap-4" variants={fadeInUp}>
            <Link href="/authpage">
              <motion.button
                className="bg-green-500 hover:bg-green-600 text-black font-medium px-8 py-3 rounded-full text-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Join Tournament
              </motion.button>
            </Link>
            <Link href="/landing">
              <motion.button
                className="border border-gray-600 hover:border-green-400 text-white font-medium px-8 py-3 rounded-full text-lg"
                whileHover={{ scale: 1.05, borderColor: "#22c55e" }}
                whileTap={{ scale: 0.95 }}
              >
                Learn More
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Background decorative elements */}
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
    </div>
  );
}