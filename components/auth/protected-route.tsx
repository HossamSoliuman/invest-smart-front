import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { getUser } from "@/services/api"
import { toast } from "sonner"

import SplashScreen from "@/components/layout/splash-screen"

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [emailVerified, setEmailVerified] = useState(true)

  async function verified(token: string) {
    try {
      const response = await getUser(token)
      const { email_verified } = response.data.data
      setEmailVerified(email_verified === 1)
      if (email_verified !== 1) {
        toast.error("Please verify your email.")
      }
    } catch (error) {
      toast.error("Failed to verify email.")
    }
  }

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("userToken")
        if (!token) {
          toast.error("Please log in first.")
          router.push("/")
          return
        }

        await verified(token)

        setIsLoggedIn(true)
      } catch (error) {
        toast.error("Authentication failed. Please log in again.")
        router.push("/")
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  if (loading) return <SplashScreen />

  if (!emailVerified) {
    router.push("/?verify=true")
    return null
  }

  if (!isLoggedIn) {
    return null
  }

  return <>{children}</>
}
