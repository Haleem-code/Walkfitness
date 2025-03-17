"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { LoaderCircle, Copy, CheckCircle } from "lucide-react"

export default function ReferralPage() {
  const { data: session, status } = useSession()
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState("")
  const [referralData, setReferralData] = useState<{ referredUsers: { userId: string; username: string }[] }>({
    referredUsers: [],
  })
  const [inputRefCode, setInputRefCode] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [copied, setCopied] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      setUserId(session.user.email)
      fetchReferralData()
    } else if (status === "unauthenticated") {
      setLoading(false)
    }
  }, [session, status])

  // Refresh data every 30 seconds to catch new referrals
  useEffect(() => {
    const interval = setInterval(() => {
      if (session?.user?.email) {
        fetchReferralData(false) // silent refresh (no loading state)
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [session])

  const fetchReferralData = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true)
      const res = await fetch("/api/referral")
      if (!res.ok) {
        setLoading(false)
        return
      }
      const data = await res.json()
      setReferralData(data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching referral data:", error)
      setLoading(false)
    }
  }

  const submitReferrer = async () => {
    if (!inputRefCode.trim()) {
      setErrorMessage("Please enter a referral code")
      return
    }

    setErrorMessage("")
    setSubmitSuccess(false)

    try {
      setSubmitting(true)
      const res = await fetch("/api/referral", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ referrerId: inputRefCode }),
      })
      const data = await res.json()

      if (res.ok) {
        await fetchReferralData()
        setSubmitSuccess(true)
        setInputRefCode("")
      } else {
        setErrorMessage(data.message || "Failed to submit referral code")
      }
      setSubmitting(false)
    } catch (error) {
      console.error("Error submitting referrer:", error)
      setErrorMessage("An error occurred. Please try again.")
      setSubmitting(false)
    }
  }

  const copyReferralCode = () => {
    navigator.clipboard.writeText(userId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6">
        <div className="p-10 bg-[#121212] rounded-xl border border-[#333] shadow-lg max-w-md w-full flex flex-col items-center">
          <LoaderCircle className="h-12 w-12 text-[#CEFF67] animate-spin" />
          <p className="mt-4 text-xl text-gray-300">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6 text-white">
        <p className="text-xl">Please login to access the referral system</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black p-6 text-white">
      <h1 className="text-center text-3xl font-bold text-[#CEFF67] mb-10">Referral System</h1>

      <div className="max-w-3xl mx-auto space-y-8">
        {/* Referral Stats Card */}
        <div className="bg-[#121212] rounded-xl border border-[#333] shadow-lg p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-300">Your Referrals</h2>
                <div className="flex items-end gap-2 mt-2">
                  <span className="text-4xl font-bold text-[#CEFF67]">{referralData.referredUsers?.length || 0}</span>
                  <span className="text-gray-400 mb-1">people</span>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-400 mb-1">Your Referral Code</p>
                <div className="flex items-center gap-2">
                  <div className="bg-[#1E2F23] p-2 rounded flex-1 overflow-hidden">
                    <p className="text-[#CEFF67] font-mono truncate">{userId}</p>
                  </div>
                  <button
                    onClick={copyReferralCode}
                    className="p-2 bg-[#1E2F23] rounded hover:bg-[#2A3F33] transition-colors"
                    aria-label="Copy referral code"
                  >
                    {copied ? (
                      <CheckCircle className="h-5 w-5 text-[#CEFF67]" />
                    ) : (
                      <Copy className="h-5 w-5 text-[#CEFF67]" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="border-t md:border-t-0 md:border-l border-[#333] pt-4 md:pt-0 md:pl-6 flex-1">
              <p className="text-sm text-gray-400 mb-2">Enter Someone&apos;s Referral Code</p>
              <div className="space-y-3">
                <input
                  type="text"
                  className="w-full p-3 border border-gray-700 rounded bg-[#1A1A1A] text-white"
                  value={inputRefCode}
                  onChange={(e) => setInputRefCode(e.target.value)}
                  placeholder="Paste referral code here"
                />
                {errorMessage && <p className="text-red-400 text-sm">{errorMessage}</p>}
                {submitSuccess && <p className="text-[#CEFF67] text-sm">Referral code submitted successfully!</p>}
                <button
                  onClick={submitReferrer}
                  disabled={submitting}
                  className="w-full bg-[#CEFF67] text-black font-bold py-2 px-4 rounded-lg hover:bg-[#B8E550] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {submitting ? (
                    <>
                      <LoaderCircle className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Code"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Referred Users Card */}
        <div className="bg-[#121212] rounded-xl border border-[#333] shadow-lg p-6">
          <h2 className="text-xl font-semibold text-[#CEFF67] mb-4">People You&apos;ve Referred</h2>

          {referralData.referredUsers && referralData.referredUsers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-[#333]">
                    <th className="py-3 px-4 text-left text-gray-400">Username</th>
                    <th className="py-3 px-4 text-left text-gray-400">Email</th>
                  </tr>
                </thead>
                <tbody>
                  {referralData.referredUsers.map((user, index) => (
                    <tr key={user.userId} className={`border-b border-[#222] ${index % 2 === 0 ? "bg-[#1A1A1A]" : ""}`}>
                      <td className="py-3 px-4 text-gray-300">{user.username}</td>
                      <td className="py-3 px-4 text-gray-300">{user.userId}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400">You haven&apos;t referred anyone yet</p>
              <p className="text-sm text-gray-500 mt-2">Share your referral code to get started!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

