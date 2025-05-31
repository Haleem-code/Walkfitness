"use client"

import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import Link from "next/link"

const AuthPage = () => {
  const [isButtonHovered, setIsButtonHovered] = useState(false)
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "authenticated") {
      console.log(session)
      // Redirect to the "walk" page after 2 seconds if authenticated
      setTimeout(() => {
        router.push("/walk")
      }, 1000)
    }
  }, [session, status, router])

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

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/fitbitLogin", {
        method: "POST", 
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("response", response);

      if (response.ok) {
        const data = await response.json();
        console.log("data", data.url);
        if (data.url) {
          // Redirect to the URL provided by signIn
          window.location.href = data.url;
        }
      } else {
        console.error("Login failed:", await response.json());
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-black text-white overflow-hidden flex items-center justify-center">
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

        <motion.div
          className="relative z-10 text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className="w-12 h-12 border-4 border-green-400 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-white text-lg">Loading your fitness journey...</p>
        </motion.div>
      </div>
    )
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

      {/* Background decorative elements - hidden on mobile */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 0.7, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="absolute top-10 md:top-20 -right-5 md:-right-2 w-48 h-48 md:w-72 lg:w-96 md:h-72 lg:h-96  md:block"
      >
        <Image
          src="/images/footer-sneak.png"
          width={400}
          height={400}
          alt="Sneaker"
          className="w-full h-full object-contain"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 0.7, y: 0 }}
        transition={{ duration: 1, delay: 0.7 }}
        className="absolute bottom-10 md:bottom-20 -left-5 md:-left-10 w-48 h-48 md:w-72 lg:w-96 md:h-72 lg:h-96  md:block"
      >
        <Image
          src="/images/blue-sneak.png"
          width={400}
          height={400}
          alt="Sneaker"
          className="w-full h-full object-contain"
        />
      </motion.div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4 md:p-6">
        <motion.div
          className="w-full max-w-sm md:max-w-md"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          {/* Logo */}
          <motion.div className="mb-8 md:mb-12 text-center" variants={fadeInUp}>
            <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 300 }}>
              <Image
                src="/images/logo.svg"
                alt="Walkfit Logo"
                width={120}
                height={48}
                className="h-12 w-auto mx-auto"
              />
            </motion.div>
          </motion.div>

          {/* Welcome text */}
          <motion.div className="text-center mb-8" variants={fadeInUp}>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
              Welcome to <span className="text-green-400">Walkfit</span>
            </h1>
          </motion.div>

          {/* Auth Card */}
          <motion.div
            className="bg-black/60 backdrop-blur-sm rounded-2xl border border-green-400/30 p-6 md:p-8 w-full"
            variants={fadeInUp}
            whileHover={{
              borderColor: "rgba(206, 255, 103, 0.5)",
              boxShadow: "0 0 30px rgba(206, 255, 103, 0.1)",
            }}
            transition={{ duration: 0.3 }}
          >
            <motion.div className="text-center mb-6 md:mb-8" variants={fadeInUp}>
              <div className="inline-flex items-center bg-purple-900/50 rounded-full px-3 md:px-4 py-2 mb-4 md:mb-6 border border-purple-500/50">
                <span className="bg-green-500 text-xs px-2 py-0.5 rounded-full mr-2 text-black font-medium">SYNC</span>
                <span className="text-xs md:text-sm text-gray-300">Connect your accounts</span>
              </div>

              <p className="text-gray-300 text-xs md:text-sm leading-relaxed px-2 md:px-0">
                We&apos;ll sync your profile and activity data to track your steps and reward your fitness journey
              </p>
            </motion.div>
            
            {/* Google Connect Button */}
            <motion.div className="mb-4" variants={fadeInUp}>
              <motion.button
                type="button"
                onClick={() => signIn("google", { callbackUrl: "/walk" })}
                onMouseEnter={() => setIsButtonHovered(true)}
                onMouseLeave={() => setIsButtonHovered(false)}
                className="w-full bg-black/80 text-white p-4 md:p-6 border-2 border-green-400 rounded-xl transition-all duration-300 relative overflow-hidden group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  boxShadow: isButtonHovered
                    ? "0 8px 25px rgba(206, 255, 103, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)"
                    : "0 4px 15px rgba(206, 255, 103, 0.2)",
                }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-green-400/10 to-purple-600/10"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.6 }}
                />

                <div className="relative flex items-center justify-center">
                  <Image
                    src="/images/google.svg"
                    alt="Connect with Google"
                    width={140}
                    height={40}
                    className="h-8 w-auto"
                  />
                </div>

                <motion.div
                  className="absolute inset-0 border-2 border-green-400 rounded-xl"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    background:
                      "linear-gradient(45deg, transparent 30%, rgba(206, 255, 103, 0.1) 50%, transparent 70%)",
                  }}
                />
              </motion.button>
            </motion.div>

            {/* Fitbit Connect Button with new handleLogin function */}
            <motion.div className="mb-8" variants={fadeInUp}>
              <motion.button
                type="button"
                onClick={handleLogin}
                onMouseEnter={() => setIsButtonHovered(true)}
                onMouseLeave={() => setIsButtonHovered(false)}
                className="w-full bg-black/80 text-white p-4 md:p-6 border-2 border-green-400 rounded-xl transition-all duration-300 relative overflow-hidden group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  boxShadow: isButtonHovered
                    ? "0 8px 25px rgba(206, 255, 103, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)"
                    : "0 4px 15px rgba(206, 255, 103, 0.2)",
                }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-green-400/10 to-purple-600/10"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.6 }}
                />

                <div className="relative flex items-center justify-center">
                  <Image
                    src="/images/fitbit.svg"
                    alt="Connect with Fitbit"
                    width={140}
                    height={40}
                    className="h-8 w-auto"
                  />
                </div>

                <motion.div
                  className="absolute inset-0 border-2 border-green-400 rounded-xl"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    background:
                      "linear-gradient(45deg, transparent 30%, rgba(206, 255, 103, 0.1) 50%, transparent 70%)",
                  }}
                />
              </motion.button>
            </motion.div>

            {/* Error State */}
            {status === "unauthenticated" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-2">
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-2">
                  <p className="text-red-400 text-sm">Authentication required to continue</p>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Terms and Privacy */}
          <motion.div className="text-center mt-4 md:mt-6" variants={fadeInUp}>
            <p className="text-gray-400 text-xs leading-relaxed px-2 md:px-0">
              By connecting your account, you agree to our{" "}
              <Link
                href="#"
                className="text-green-400 hover:text-green-300 transition-colors underline decoration-green-400/50 hover:decoration-green-300"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="text-green-400 hover:text-green-300 transition-colors underline decoration-green-400/50 hover:decoration-green-300"
              >
                Privacy Policy
              </Link>
            </p>
          </motion.div>

          {/* Back to Home */}
          <motion.div className="text-center mt-6 md:mt-8" variants={fadeInUp}>
            <Link
              href="/"
              className="text-gray-500 hover:text-gray-300 text-sm transition-colors inline-flex items-center"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to home
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default AuthPage