"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { AlertCircle, Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {APP_URL} from "@/config"

interface ProfileData {
  twitterUsername: string
  telegramId: string
}

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const [profileData, setProfileData] = useState<ProfileData>({
    twitterUsername: "",
    telegramId: "",
  })
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState<boolean>(false)

  useEffect(() => {
    const fetchProfileData = async () => {
      if (status === "authenticated" && session?.user?.email) {
        try {
          const response = await fetch(`${APP_URL}/api/profile?email=${session.user.email}`)
          if (!response.ok) {
            throw new Error("Failed to fetch profile data")
          }
          const data = await response.json()
          setProfileData(data)
        } catch (error: any) {
          setError(error.message)
          console.error("Error fetching profile data:", error)
        } finally {
          setLoading(false)
        }
      } else if (status !== "loading") {
        setLoading(false)
      }
    }

    fetchProfileData()
  }, [status, session])

  const handleDeleteProfile = async () => {
    if (!session?.user?.email) return

    if (!confirm("Are you sure you want to delete your profile? This action cannot be undone.")) {
      return
    }

    setIsDeleting(true)
    try {
      const response = await fetch(`https://walkfit.vercel.app/api/profile?email=${session.user.email}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete profile")
      }

      // Redirect to home page after successful deletion
      window.location.href = "/"
    } catch (error: any) {
      setError(error.message)
      console.error("Error deleting profile:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading profile data...</span>
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
    <div className="container bg-black max-w-md mx-auto py-8 px-4">
      <Card className="overflow-hidden">
        <CardHeader className=" pb-8 pt-12 relative">
          <div className="absolute left-1/2 -translate-x-1/2 -bottom-11 border-4 border-background rounded-full">
            <Image
              src={session.user?.image || "/images/profileImg.svg?height=88&width=88"}
              alt="Profile"
              className="rounded-full"
              width={88}
              height={88}
              priority
            />
          </div>
        </CardHeader>
        <CardContent className="pt-14 pb-6">
          <h1 className="text-2xl font-bold text-center mb-6">{session.user?.name || "User"}</h1>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="text-center p-3 rounded-lg bg-blue-500/10">
              <h2 className="text-sm font-medium text-muted-foreground mb-1">X Username</h2>
              <p className="font-semibold text-blue-500">{profileData.twitterUsername || "Not set"}</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-amber-500/10">
              <h2 className="text-sm font-medium text-muted-foreground mb-1">Telegram ID</h2>
              <p className="font-semibold text-amber-500">{profileData.telegramId || "Not set"}</p>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="grid grid-cols-3 gap-4 text-center mb-8">
            <div className="border p-3 rounded-lg border-primary/20">
              <p className="text-xl font-bold">-</p>
              <p className="text-xs text-muted-foreground">Steps</p>
            </div>
            <div className="border p-3 rounded-lg border-primary/20">
              <p className="text-xl font-bold">-</p>
              <p className="text-xs text-muted-foreground">WLK</p>
            </div>
            <div className="border p-3 rounded-lg border-primary/20">
              <p className="text-xl font-bold">-</p>
              <p className="text-xs text-muted-foreground">Task</p>
            </div>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button variant="destructive" className="w-full" onClick={handleDeleteProfile} disabled={isDeleting}>
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete Profile"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

