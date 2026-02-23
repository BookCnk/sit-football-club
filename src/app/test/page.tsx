"use client"

import { useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

export default function TestPage() {
  useEffect(() => {
    const testConnection = async () => {
      const supabase = createClient()
      const { data, error } = await supabase.auth.getSession()

      if (error) {
        console.error("❌ Connection Error:", error.message)
      } else {
        console.log("✅ Connected Successfully")
      }
    }

    testConnection()
  }, [])

  return <div>Check console</div>
}