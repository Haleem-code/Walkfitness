"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import Image from "next/image"

const LogoPage = () => {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/landing")
    }, 2700)

    return () => clearTimeout(timer)
  }, [router])

  // Blinking animation variants
  const blinkVariants = {
    visible: { opacity: 0.15 },
    hidden: { opacity: 0.05 },
  }

  // Sneaker positions around the page
  const sneakerPositions = [
    { src: "/images/blue-sneak.png", className: "top-10 left-10", delay: 0 },
    { src: "/images/footer-sneak.png", className: "top-10 right-10", delay: 0.2 },
    { src: "/images/blue-sneak.png", className: "bottom-10 left-10", delay: 0.4 },
    { src: "/images/footer-sneak.png", className: "bottom-10 right-10", delay: 0.6 },
    { src: "/images/blue-sneak.png", className: "top-1/2 left-5 -translate-y-1/2", delay: 0.8 },
    { src: "/images/footer-sneak.png", className: "top-1/2 right-5 -translate-y-1/2", delay: 1.0 },
    { src: "/images/blue-sneak.png", className: "top-5 left-1/2 -translate-x-1/2", delay: 1.2 },
    { src: "/images/footer-sneak.png", className: "bottom-5 left-1/2 -translate-x-1/2", delay: 1.4 },
  ]

  return (
    <div className="flex justify-center items-center h-screen relative overflow-hidden bg-gradient-to-b from-purple-900/40 via-black to-black">
      {/* Centered Logo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="z-10"
      >
        <Image src="/images/logo2.svg" alt="Logo" width={200} height={200} />
      </motion.div>

      {/* Blinking Sneakers Around the Page */}
      {sneakerPositions.map((sneaker, index) => (
        <motion.div
          key={sneaker.src}
          initial={{ opacity: 0 }}
          animate="visible"
          variants={blinkVariants}
          transition={{
            duration: 1.5,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            ease: "easeInOut",
            delay: sneaker.delay,
          }}
          className={`absolute ${sneaker.className} -z-10`}
        >
          <Image
            src={sneaker.src || "/placeholder.svg"}
            width={150}
            height={150}
            alt="Sneaker"
            className="transform rotate-12"
          />
        </motion.div>
      ))}

      {/* Additional floating sneakers for more coverage */}
      <motion.div
        initial={{ opacity: 0 }}
        animate="visible"
        variants={blinkVariants}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
          ease: "easeInOut",
          delay: 0.3,
        }}
        className="absolute top-1/4 left-1/4 -z-10"
      >
        <Image src="/images/blue-sneak.png" width={200} height={120} alt="Sneaker" className="transform -rotate-45" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate="visible"
        variants={blinkVariants}
        transition={{
          duration: 1.8,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
          ease: "easeInOut",
          delay: 0.7,
        }}
        className="absolute top-3/4 right-1/4 -z-10"
      >
        <Image src="/images/footer-sneak.png" width={130} height={130} alt="Sneaker" className="transform rotate-45" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate="visible"
        variants={blinkVariants}
        transition={{
          duration: 1.6,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
          ease: "easeInOut",
          delay: 1.1,
        }}
        className="absolute top-1/3 right-1/3 -z-10"
      >
        <Image src="/images/blue-sneak.png" width={100} height={100} alt="Sneaker" className="transform rotate-90" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate="visible"
        variants={blinkVariants}
        transition={{
          duration: 2.2,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
          ease: "easeInOut",
          delay: 1.5,
        }}
        className="absolute bottom-1/3 left-1/3 -z-10"
      >
        <Image src="/images/footer-sneak.png" width={110} height={110} alt="Sneaker" className="transform -rotate-12" />
      </motion.div>
    </div>
  )
}

export default LogoPage
