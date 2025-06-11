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

export default function AboutPage() {
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
            <span className="text-2xl mr-2">👟</span>
            <span className="text-lg font-medium">About WalkFit</span>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-6xl font-bold text-center mb-8"
            variants={fadeInUp}
          >
            Making Movement <span className="text-green-400">Meaningful</span>
          </motion.h1>

          <motion.p
            className="text-center text-gray-300 max-w-3xl mx-auto text-lg mb-12"
            variants={fadeInUp}
          >
            We empower people around the world to reclaim their health by rewarding physical activity 
            through the power of blockchain, gamification, and community.
          </motion.p>
        </motion.div>
      </section>

      {/* Mission Section */}
      <section className="relative z-10 py-20 px-4 max-w-7xl mx-auto">
        <motion.div
          className="bg-gradient-to-r from-purple-900/30 to-green-900/30 rounded-2xl p-12 mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUpOnScroll}
        >
          <motion.h2 className="text-3xl font-bold mb-8 text-center text-green-400" variants={fadeInUp}>
            Our Mission
          </motion.h2>
          
          <motion.div
            className="grid md:grid-cols-2 gap-12 items-center"
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp}>
              <p className="text-lg text-gray-300 mb-6">
                At WalkFit, our mission is simple: to make movement meaningful. We believe the future of fitness 
                isn&apos;t locked inside a gym—it&apos;s on the streets, the trails, the sidewalks, and wherever you walk.
              </p>
              <p className="text-lg text-gray-300">
                Every step you take is progress, and with WalkFit, it&apos;s also value. We&apos;re building a world where 
                staying healthy isn&apos;t just good for you—it&apos;s rewarding in every sense of the word.
              </p>
            </motion.div>
            
            <motion.div variants={fadeInUp} className="flex justify-center">
              <div className="w-80 h-80 bg-[#D9D9D91A] rounded-full flex items-center justify-center">
                <Image
                  src={"/images/community.svg"}
                  width={200}
                  height={200}
                  alt="Mission"
                  className="opacity-80"
                />
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Problem Section */}
        <motion.div
          className="mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUpOnScroll}
        >
          <motion.h2 className="text-3xl font-bold mb-8 text-center" variants={fadeInUp}>
            The Problem We're Solving
          </motion.h2>
          
          <motion.div
            className="grid md:grid-cols-3 gap-8"
            variants={staggerContainer}
          >
            <motion.div 
              className="bg-[#D9D9D91A] rounded-xl p-8 text-center"
              variants={fadeInUp}
            >
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-red-400">Rising Obesity</h3>
              <p className="text-gray-400">
                Global obesity rates have tripled since 1975, with 42.4% of US adults classified as obese.
              </p>
            </motion.div>

            <motion.div 
              className="bg-[#D9D9D91A] rounded-xl p-8 text-center"
              variants={fadeInUp}
            >
              <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-orange-400">Sedentary Lifestyle</h3>
              <p className="text-gray-400">
                Rise in sedentary work, screen time, and urbanization has reduced daily physical activity.
              </p>
            </motion.div>

            <motion.div 
              className="bg-[#D9D9D91A] rounded-xl p-8 text-center"
              variants={fadeInUp}
            >
              <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-purple-400">Health Crisis</h3>
              <p className="text-gray-400">
                Physical inactivity is one of the leading global risk factors for death and disease.
              </p>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Solution Section */}
        <motion.div
          className="bg-gradient-to-r from-green-900/30 to-blue-900/30 rounded-2xl p-12 mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUpOnScroll}
        >
          <motion.h2 className="text-3xl font-bold mb-8 text-center" variants={fadeInUp}>
            Our Solution
          </motion.h2>
          
          <motion.div className="text-center mb-8" variants={fadeInUp}>
            <p className="text-xl text-gray-300 mb-6">
              We combine real-world movement with real crypto incentives.
            </p>
            <p className="text-lg text-gray-300">
              Through step tracking, tokenized tournaments, and NFT-based gear, WalkFit helps users stay 
              accountable, engaged, and rewarded for the most human action of all: walking.
            </p>
          </motion.div>

          <motion.div
            className="flex justify-center items-center gap-8 text-2xl font-bold"
            variants={fadeInUp}
          >
            <span className="text-green-400">🚶 Walk</span>
            <span className="text-purple-400">→</span>
            <span className="text-yellow-400">💰 Earn XP</span>
            <span className="text-purple-400">→</span>
            <span className="text-blue-400">🛒 Redeem</span>
          </motion.div>

          <motion.p 
            className="text-center text-gray-300 mt-6"
            variants={fadeInUp}
          >
            It&apos;s fitness with purpose. On-chain, transparent, and globally scalable.
          </motion.p>
        </motion.div>

        {/* Research Section */}
        <motion.div
          className="mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUpOnScroll}
        >
          <motion.h2 className="text-3xl font-bold mb-8 text-center text-green-400" variants={fadeInUp}>
            Backed by Research
          </motion.h2>
          
          <motion.div
            className="grid md:grid-cols-2 gap-8"
            variants={staggerContainer}
          >
            <motion.div 
              className="bg-[#D9D9D91A] rounded-xl p-8"
              variants={fadeInUp}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3">University of Western Ontario</h3>
                  <p className="text-gray-400">
                    A 2023 study found that financial incentives increased average daily steps by 900+ among participants.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="bg-[#D9D9D91A] rounded-xl p-8"
              variants={fadeInUp}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3">Leibniz Institute</h3>
                  <p className="text-gray-400">
                    Meta-review concluded that financial incentives significantly improve fitness adherence, 
                    particularly in high-income sedentary populations.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.p 
            className="text-center text-lg text-gray-300 mt-8"
            variants={fadeInUp}
          >
            WalkFit takes that insight and builds an ecosystem where users, not platforms, benefit from their efforts.
          </motion.p>
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
            Ready to make your <span className="text-green-400">movement meaningful?</span>
          </motion.h2>
          
          <motion.div className="flex justify-center gap-4" variants={fadeInUp}>
            <Link href="/authpage">
              <motion.button
                className="bg-green-500 hover:bg-green-600 text-black font-medium px-8 py-3 rounded-full text-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Walking
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