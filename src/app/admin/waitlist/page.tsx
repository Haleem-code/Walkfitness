"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Users, Mail, Calendar, Download, Search } from "lucide-react"
import { format } from "date-fns"
import { useToast } from "@/hooks/use-toast"

interface WaitlistUser {
  _id: string
  email: string
  joinedAt: string
  createdAt: string
  status: "pending" | "invited" | "registered"
  source: string
}

export default function WaitlistAdmin() {
  const [users, setUsers] = useState<WaitlistUser[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredUsers, setFilteredUsers] = useState<WaitlistUser[]>([])
  const { toast } = useToast()

  useEffect(() => {
    fetchWaitlistData()
  }, [])

  useEffect(() => {
    const filtered = users.filter((user) => user.email.toLowerCase().includes(searchTerm.toLowerCase()))
    setFilteredUsers(filtered)
  }, [searchTerm, users])

  const fetchWaitlistData = async () => {
    try {
      const response = await fetch("/api/waitlist")
      const result = await response.json()

      if (result.success) {
        setUsers(result.users)
        setFilteredUsers(result.users)
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to fetch waitlist data",
         
        })
      }
    } catch (error) {
      console.error("Failed to fetch waitlist data:", error)
      toast({
        title: "Error",
        description: "Failed to fetch waitlist data",
   
      })
    } finally {
      setLoading(false)
    }
  }

  const exportToCSV = () => {
    if (users.length === 0) return

    const csvContent = [
      ["Email", "Joined Date", "Status", "Source"],
      ...users.map((user) => [
        user.email,
        format(new Date(user.createdAt || user.joinedAt), "yyyy-MM-dd HH:mm:ss"),
        user.status || "pending",
        user.source || "landing-page",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `waitlist-${format(new Date(), "yyyy-MM-dd")}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500"
      case "invited":
        return "bg-blue-500"
      case "registered":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const getWeeklyCount = () => {
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    return users.filter((user) => {
      const userDate = new Date(user.createdAt || user.joinedAt)
      return userDate > weekAgo
    }).length
  }

  const getPendingCount = () => {
    return users.filter((user) => (user.status || "pending") === "pending").length
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p>Loading waitlist data...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 mt-8">Waitlist Dashboard</h1>
         
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Total Subscribers</CardTitle>
              <Users className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{users.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">This Week</CardTitle>
              <Calendar className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{getWeeklyCount()}</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Pending</CardTitle>
              <Mail className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{getPendingCount()}</div>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search by email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-900 border-gray-700 text-white"
            />
          </div>
          <Button onClick={exportToCSV} className="bg-green-600 hover:bg-green-700" disabled={users.length === 0}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>

        {/* Users Table */}
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Waitlist Subscribers</CardTitle>
            <CardDescription className="text-gray-400">
              {filteredUsers.length} of {users.length} subscribers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Email</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Joined Date</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Source</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user._id} className="border-b border-gray-800 hover:bg-gray-800/50">
                      <td className="py-3 px-4 text-white">{user.email}</td>
                      <td className="py-3 px-4 text-gray-300">
                        {format(new Date(user.createdAt || user.joinedAt), "MMM dd, yyyy HH:mm")}
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={`${getStatusColor(user.status || "pending")} text-white`}>
                          {user.status || "pending"}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-gray-300">{user.source || "landing-page"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredUsers.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  {searchTerm ? "No subscribers found matching your search." : "No subscribers yet."}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
