"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Clock, Mail, User } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function ComingSoonProfilePage() {
  const { data: session, status } = useSession()
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  // Set launch date to 30 days from now
  useEffect(() => {
    const launchDate = new Date()
    launchDate.setDate(launchDate.getDate() + 30)

    const timer = setInterval(() => {
      const now = new Date()
      const difference = launchDate.getTime() - now.getTime()

      if (difference <= 0) {
        clearInterval(timer)
        return
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24))
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((difference % (1000 * 60)) / 1000)

      setCountdown({ days, hours, minutes, seconds })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-[#CEFF67]" />
        <span className="ml-2">Loading...</span>
      </div>
    )
  }

  if (!session) {
    return (
      <Alert variant="destructive" className="max-w-md mx-auto mt-8">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Authentication required</AlertTitle>
        <AlertDescription>Please sign in to view your profile.</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="container max-w-4xl mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Profile Page</h1>
        <div className="inline-block bg-[#CEFF67]/20 px-4 py-2 rounded-full text-[#CEFF67] font-bold mb-6">
          Coming Soon
        </div>
        <p className="text-muted-foreground max-w-md mx-auto">
          We're working hard to bring you an amazing profile experience. Stay tuned for updates!
        </p>
      </div>

      <Card className="overflow-hidden mb-12 border-[#CEFF67]/20 bg-gradient-to-br from-background to-[#CEFF67]/5">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#CEFF67]">
                <Image
                  src={session.user?.image || "/placeholder.svg?height=128&width=128"}
                  alt="Profile"
                  width={128}
                  height={128}
                  className="object-cover"
                  priority
                />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-[#CEFF67] text-black font-bold rounded-full w-10 h-10 flex items-center justify-center">
                <Clock className="h-5 w-5" />
              </div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold mb-2">{session.user?.name || "User"}</h2>

              <div className="flex items-center justify-center md:justify-start gap-2 text-muted-foreground mb-4">
                <Mail className="h-4 w-4" />
                <span>{session.user?.email}</span>
              </div>

              <div className="inline-block bg-[#CEFF67]/10 px-3 py-1 rounded-full text-sm text-[#CEFF67]">
                <User className="h-4 w-4 inline-block mr-1" />
                Early Access Member
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center">Launching In</h2>
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-[#CEFF67]/10 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-[#CEFF67]">{countdown.days}</div>
            <div className="text-xs text-muted-foreground">Days</div>
          </div>
          <div className="bg-[#CEFF67]/10 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-[#CEFF67]">{countdown.hours}</div>
            <div className="text-xs text-muted-foreground">Hours</div>
          </div>
          <div className="bg-[#CEFF67]/10 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-[#CEFF67]">{countdown.minutes}</div>
            <div className="text-xs text-muted-foreground">Minutes</div>
          </div>
          <div className="bg-[#CEFF67]/10 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-[#CEFF67]">{countdown.seconds}</div>
            <div className="text-xs text-muted-foreground">Seconds</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <Card className="bg-[#CEFF67]/5 border-[#CEFF67]/20 hover:bg-[#CEFF67]/10 transition-all duration-300">
          <CardContent className="p-6 text-center">
            <h3 className="text-xl font-bold mb-2">Tournament Stats</h3>
            <p className="text-muted-foreground mb-4">Track your tournament participation and wins</p>
            <div className="inline-block bg-[#CEFF67]/20 px-4 py-2 rounded-full text-[#CEFF67] font-bold">
              Coming Soon
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#CEFF67]/5 border-[#CEFF67]/20 hover:bg-[#CEFF67]/10 transition-all duration-300">
          <CardContent className="p-6 text-center">
            <h3 className="text-xl font-bold mb-2">Referral Program</h3>
            <p className="text-muted-foreground mb-4">Invite friends and earn rewards</p>
            <div className="inline-block bg-[#CEFF67]/20 px-4 py-2 rounded-full text-[#CEFF67] font-bold">
              Coming Soon
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="text-center">
        <Button className="bg-[#CEFF67] text-black hover:bg-[#CEFF67]/80">Get Notified When We Launch</Button>
      </div>
    </div>
  )
}

