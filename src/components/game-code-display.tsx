"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Check, Copy } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface GameCodeDisplayProps {
  code: string
}

export default function GameCodeDisplay({ code }: GameCodeDisplayProps) {
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      toast({
        title: "Copied!",
        description: "Game code copied to clipboard",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy code",
      })
    }
  }

  return (
    <div className="flex items-center justify-between p-3 bg-muted rounded-md">
      <div className="font-mono text-sm">{code}</div>
      <Button variant="ghost" size="sm" onClick={copyToClipboard} className="h-8 w-8 p-0">
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </Button>
    </div>
  )
}
