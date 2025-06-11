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

export default function MarketplacePage() {
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
            className="inline-flex items-center bg-purple-900/50 rounded-full px-4 py-2 mb-8 border border-purple-500"
            variants={fadeInUp}
          >
            <span className="text-2xl mr-2">🛒</span>
            <span className="text-lg font-medium">Trade to Upgrade</span>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-6xl font-bold text-center mb-8"
            variants={fadeInUp}
          >
            Move to Earn <span className="text-green-400">More</span>
          </motion.h1>

          <motion.p
            className="text-center text-gray-300 max-w-3xl mx-auto text-lg mb-12"
            variants={fadeInUp}
          >
            The WalkFit Marketplace is the engine behind your fitness economy—where every asset has utility, 
            and every upgrade pushes you closer to the top.
          </motion.p>

          {/* Marketplace Hero Image */}
          <motion.div
            className="relative max-w-2xl mx-auto mb-16"
            variants={fadeInUp}
          >
            <div className="w-60 h-60 mx-auto relative mb-8">
              <Image
                src={"/images/marketplace.svg"}
                width={240}
                height={240}
                alt="Marketplace"
                className="w-full h-full bg-[#D9D9D91A] p-16 rounded-full object-cover"
              />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Sneakers Section */}
      <section className="relative z-10 py-20 px-4 max-w-7xl mx-auto">
        <motion.div
          className="bg-gradient-to-r from-green-900/30 to-blue-900/30 rounded-2xl p-12 mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUpOnScroll}
        >
          <motion.div className="text-center mb-12" variants={fadeInUp}>
            <h2 className="text-4xl font-bold mb-4">
              Sneakers: Your <span className="text-green-400">Movement Multiplier</span>
            </h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Buy, sell, or trade sneakers. Whether you&apos;re upgrading or cashing out, the marketplace keeps your
              fitness journey flexible and rewarding. Each sneaker has unique attributes that impact how much XP
              or points you earn per step.
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-8"
            variants={staggerContainer}
          >
            <motion.div 
              className="bg-[#D9D9D91A] rounded-xl p-8 text-center"
              variants={fadeInUp}
            >
              <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Distance Boost</h3>
              <p className="text-gray-400">
                Some sneakers enhance your distance tracking, giving you more points for longer walks and runs.
              </p>
            </motion.div>

            <motion.div 
              className="bg-[#D9D9D91A] rounded-xl p-8 text-center"
              variants={fadeInUp}
            >
              <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Consistency Bonuses</h3>
              <p className="text-gray-400">
                Others enhance consistency bonuses, rewarding you more for maintaining daily streaks.
              </p>
            </motion.div>

            <motion.div 
              className="bg-[#D9D9D91A] rounded-xl p-8 text-center"
              variants={fadeInUp}
            >
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Premium Access</h3>
              <p className="text-gray-400">
                Elite sneakers unlock access to premium tournaments with higher stakes and bigger rewards.
              </p>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Marketplace Highlights Section */}
        <motion.div
          className="mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUpOnScroll}
        >
          <motion.div className="text-center mb-12" variants={fadeInUp}>
            <h2 className="text-3xl font-bold mb-4 text-green-400">
              Marketplace Highlights
            </h2>
            <motion.div
              className="inline-flex items-center bg-yellow-900/50 rounded-full px-4 py-2 border border-yellow-500"
              variants={fadeInUp}
            >
              <span className="text-sm font-medium">Coming Soon</span>
            </motion.div>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-5 gap-8"
            variants={staggerContainer}
          >
            {/* Sneaker Utility */}
            <motion.div
              className="bg-[#D9D9D91A] rounded-xl p-8 overflow-hidden relative"
              variants={fadeInUpOnScroll}
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-3">Sneaker Utility</h3>
              <p className="text-gray-400 text-sm">
                Equip sneakers to multiply your step rewards, earn faster, and unlock streak-based bonuses.
              </p>
            </motion.div>

            {/* Open Economy */}
            <motion.div
              className="bg-[#D9D9D91A] rounded-xl p-8 overflow-hidden relative"
              variants={fadeInUpOnScroll}
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-3">Open Economy</h3>
              <p className="text-gray-400 text-sm">
                Buy, sell, or list sneakers freely on the WalkFit marketplace using accepted tokens.
              </p>
            </motion.div>

            {/* XP-Boost Items */}
            <motion.div
              className="bg-[#D9D9D91A] rounded-xl p-8 overflow-hidden relative"
              variants={fadeInUpOnScroll}
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-3">XP-Boost Items</h3>
              <p className="text-gray-400 text-sm">
                Discover consumables and perks that temporarily increase your daily XP gains.
              </p>
            </motion.div>

            {/* NFT Ownership */}
            <motion.div
              className="bg-[#D9D9D91A] rounded-xl p-8 overflow-hidden relative"
              variants={fadeInUpOnScroll}
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-3">NFT Ownership</h3>
              <p className="text-gray-400 text-sm">
                Every sneaker and item is a tradable NFT, stored securely on Eclipse.
              </p>
            </motion.div>

            {/* Rarity Tiers */}
            <motion.div
              className="bg-[#D9D9D91A] rounded-xl p-8 overflow-hidden relative"
              variants={fadeInUpOnScroll}
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-3">Rarity Tiers</h3>
              <p className="text-gray-400 text-sm">
                From basic trainers to elite gear, higher-tier sneakers offer stronger boosts.
              </p>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Rarity Tiers Section */}
        <motion.div
          className="bg-gradient-to-r from-purple-900/30 to-red-900/30 rounded-2xl p-12 mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUpOnScroll}
        >
          <motion.h2 className="text-3xl font-bold mb-8 text-center" variants={fadeInUp}>
            Sneaker Rarity Tiers
          </motion.h2>
          
          <motion.div
            className="grid md:grid-cols-4 gap-8"
            variants={staggerContainer}
          >
            <motion.div 
              className="bg-gradient-to-b from-gray-500/20 to-gray-600/20 rounded-xl p-8 text-center border border-gray-500/30"
              variants={fadeInUp}
            >
              <div className="w-20 h-20 bg-gray-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-400">Common</h3>
              <p className="text-sm font-semibold mb-2">Basic Trainers</p>
              <p className="text-gray-400 text-sm">Standard earning multiplier. Perfect for getting started.</p>
            </motion.div>

            <motion.div 
              className="bg-gradient-to-b from-green-500/20 to-green-600/20 rounded-xl p-8 text-center border border-green-500/30"
              variants={fadeInUp}
            >
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-green-400">Uncommon</h3>
              <p className="text-sm font-semibold mb-2">Sport Sneakers</p>
              <p className="text-gray-400 text-sm">Enhanced earning rate with minor attribute boosts.</p>
            </motion.div>

            <motion.div 
              className="bg-gradient-to-b from-blue-500/20 to-blue-600/20 rounded-xl p-8 text-center border border-blue-500/30"
              variants={fadeInUp}
            >
              <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-blue-400">Rare</h3>
              <p className="text-sm font-semibold mb-2">Performance Gear</p>
              <p className="text-gray-400 text-sm">Significant boosts to XP gains and special abilities.</p>
            </motion.div>

            <motion.div 
              className="bg-gradient-to-b from-purple-500/20 to-purple-600/20 rounded-xl p-8 text-center border border-purple-500/30"
              variants={fadeInUp}
            >
              <div className="w-20 h-20 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-purple-400">Legendary</h3>
              <p className="text-sm font-semibold mb-2">Elite Equipment</p>
              <p className="text-gray-400 text-sm">Maximum earning potential and exclusive tournament access.</p>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* How Trading Works Section */}
        <motion.div
          className="mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUpOnScroll}
        >
          <motion.h2 className="text-3xl font-bold mb-8 text-center text-green-400" variants={fadeInUp}>
            How Trading Works
          </motion.h2>
          
          <motion.div
            className="grid md:grid-cols-3 gap-8"
            variants={staggerContainer}
          >
            <motion.div 
              className="bg-[#D9D9D91A] rounded-xl p-8 text-center"
              variants={fadeInUp}
            >
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Browse & Buy</h3>
              <p className="text-gray-400">
                Explore the marketplace for sneakers that match your fitness goals and budget using accepted tokens.
              </p>
            </motion.div>

            <motion.div 
              className="bg-[#D9D9D91A] rounded-xl p-8 text-center"
              variants={fadeInUp}
            >
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Equip & Earn</h3>
              <p className="text-gray-400">
                Equip your sneakers to start earning enhanced rewards, XP boosts, and unlock special features.
              </p>
            </motion.div>

            <motion.div 
              className="bg-[#D9D9D91A] rounded-xl p-8 text-center"
              variants={fadeInUp}
            >
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Trade & Upgrade</h3>
              <p className="text-gray-400">
                Sell your gear when ready to upgrade or cash out your fitness journey investments.
              </p>
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
            Ready to upgrade your <span className="text-green-400">fitness economy?</span>
          </motion.h2>
          
          <motion.p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto" variants={fadeInUp}>
            Every asset has utility, and every upgrade pushes you closer to the top. 
            Start building your fitness portfolio today.
          </motion.p>
          
          <motion.div className="flex justify-center gap-4" variants={fadeInUp}>
            <Link href="/authpage">
              <motion.button
                className="bg-green-500 hover:bg-green-600 text-black font-medium px-8 py-3 rounded-full text-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Explore Marketplace
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


