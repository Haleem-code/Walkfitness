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

export default function CommunityPage() {
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
          <motion.h1
            className="text-5xl md:text-6xl font-bold text-center mb-8"
            variants={fadeInUp}
          >
            Walk Together, <span className="text-green-400">Win Together</span>
          </motion.h1>

          <motion.p
            className="text-center text-gray-300 max-w-3xl mx-auto text-lg mb-12"
            variants={fadeInUp}
          >
            WalkFit isn&apos;t just about you versus the leaderboard—it&apos;s about you with the people who push you forward.
            Build your social squad, create challenges, and earn rewards together.
          </motion.p>

          {/* Community Hero Image */}
          <motion.div
            className="relative max-w-2xl mx-auto mb-16"
            variants={fadeInUp}
          >
            <div className="w-60 h-60 mx-auto relative mb-8">
              <Image
                src={"/images/community.svg"}
                width={240}
                height={240}
                alt="Community"
                className="w-full h-full bg-[#D9D9D91A] p-16 rounded-full object-cover"
              />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Core Features Section */}
      <section className="relative z-10 py-20 px-4 max-w-7xl mx-auto">
        <motion.div
          className="mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <motion.h2 className="text-3xl font-bold mb-2 text-green-400" variants={fadeInUp}>
            Core Community Features
          </motion.h2>
          <motion.p className="text-gray-300" variants={fadeInUp}>
            Everything you need to build lasting fitness connections
          </motion.p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-3 gap-8 mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          {/* Feature 1 */}
          <motion.div
            className="bg-[#D9D9D91A] rounded-xl p-8 text-center"
            variants={fadeInUpOnScroll}
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3">Follow, Team Up, Cheer On</h3>
            <p className="text-gray-400 text-sm">
              Build your social squad, motivate friends, and join team tournaments with people who share your fitness goals.
            </p>
          </motion.div>

          {/* Feature 2 */}
          <motion.div
            className="bg-[#D9D9D91A] rounded-xl p-8 text-center"
            variants={fadeInUpOnScroll}
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3">Custom Challenges</h3>
            <p className="text-gray-400 text-sm">
              Create and share your own tournaments for local groups, DAOs, or brand tribes with personalized goals and rewards.
            </p>
          </motion.div>

          {/* Feature 3 */}
          <motion.div
            className="bg-[#D9D9D91A] rounded-xl p-8 text-center"
            variants={fadeInUpOnScroll}
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3">On-Chain Reputation</h3>
            <p className="text-gray-400 text-sm">
              Earn XP, NFTs, and badges that reflect your credibility and commitment in the decentralized health movement.
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
            className="grid md:grid-cols-3 gap-8"
            variants={staggerContainer}
          >
            <motion.div className="text-center" variants={fadeInUp}>
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Builds Stickiness</h3>
              <p className="text-gray-400">
                Social accountability and retention through meaningful connections with your fitness community.
              </p>
            </motion.div>

            <motion.div className="text-center" variants={fadeInUp}>
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Friendly Competition</h3>
              <p className="text-gray-400">
                Encourages healthy competition through visible progress tracking and meaningful rewards.
              </p>
            </motion.div>

            <motion.div className="text-center" variants={fadeInUp}>
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Ownership & Belonging</h3>
              <p className="text-gray-400">
                Fosters true ownership and belonging in a decentralized health movement that values your contribution.
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
            Your steps matter more when they&apos;re part of <span className="text-green-400">something bigger</span>
          </motion.h2>
          
          <motion.div className="flex justify-center gap-4" variants={fadeInUp}>
            <Link href="/authpage">
              <motion.button
                className="bg-green-500 hover:bg-green-600 text-black font-medium px-8 py-3 rounded-full text-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Join Community
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