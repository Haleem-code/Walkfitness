"use client"

import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Image from "next/image"

const AuthPage = () => {
  const [isButtonHovered, setIsButtonHovered] = useState(false)
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "authenticated") {
      console.log(session)
      router.push("/walk")
    }
  }, [session, status, router])

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-white">Loading...</p>
      </div>
    )
  }

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen p-6 bg-cover bg-center bg-no-repeat"
    >
      <div className="mb-12">
        <Image src="/images/logo.svg" alt="Logo" width={120} height={48} className="h-12 w-auto" />
      </div>

      <div
        className="bg-black/40 backdrop-blur-sm rounded-lg border-2 border-[#CEFF67] p-8 w-full max-w-md flex flex-col items-center"
        style={{ borderStyle: "double" }}
      >
        <p className="text-white text-center text-sm mb-8">We will sync your profile and activity data from Fitbit</p>

        <button
          type="button"
          onClick={() => signIn("fitbit", { callbackUrl: "/walk" })}
          onMouseEnter={() => setIsButtonHovered(true)}
          onMouseLeave={() => setIsButtonHovered(false)}
          className="bg-black text-white px-12 py-6 border border-[#CEFF67] mb-8 transition-all duration-200"
          style={{
            boxShadow: isButtonHovered ? "4px 6px 0 0 #CEFF67" : "2px 4px 0 0 #CEFF67",
            transform: isButtonHovered ? "translate(-2px, -2px)" : "translate(0, 0)",
          }}
        >
          <Image src="/images/fitbit.svg" alt="fitbit" width={150} height={150} />
        </button>

        {status === "unauthenticated" && <p className="text-red-500 text-center text-xs">Not authenticated</p>}
      </div>

      <p className="text-white text-center text-xs mt-6">
        By signing up you agree to
        <a href="#" className="text-[#CEFF67] hover:underline cursor-pointer ml-1">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="/privacy" className="text-[#CEFF67] hover:underline cursor-pointer ml-1">
          Privacy
        </a>
      </p>
    </div>
  )
}

export default AuthPage

