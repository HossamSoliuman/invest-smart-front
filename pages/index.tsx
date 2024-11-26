import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { ArrowUpIcon } from "lucide-react"

import { EmailVerificationDialog } from "@/components/auth/email-verification-dialog"
import { Layout } from "@/components/layout"
import Footer from "@/components/layout/footer/Footer"
import SplashScreen from "@/components/layout/splash-screen"
import AboutUsSection from "@/components/sections/about-us-section"
import BitcoinHistorySection from "@/components/sections/bitcoin-history-section"
import LaunchSection from "@/components/sections/launch-section"
import ProjectSection from "@/components/sections/project-section"
import WelcomeSection from "@/components/sections/welcome-section"

export default function Home() {
  const [showScrollToTop, setShowScrollToTop] = useState(false)
  const [showDialog, setShowDialog] = useState(false)
  const [token, setToken] = useState("")

  const router = useRouter()

  useEffect(() => {
    if (router.query.verify === "true") {
      setShowDialog(true)
    }
  }, [router.query])

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollToTop(window.scrollY > 300)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  function handleScrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  useEffect(() => {
    setToken(localStorage.getItem("userToken") ?? "")
  }, [])

  return (
    <Layout title="Home" className="!pb-0" withoutContainer>
      <div className="container">
        <SplashScreen />

        <WelcomeSection />
        <AboutUsSection />
        <ProjectSection />
        <LaunchSection />
        <BitcoinHistorySection />
        {showScrollToTop && (
          <button
            onClick={handleScrollToTop}
            className="fixed bottom-6 right-6 p-2 rounded-full bg-background border transition-colors duration-500 hover:border-primary z-10"
          >
            <ArrowUpIcon size={32} />
          </button>
        )}

        <EmailVerificationDialog
          open={showDialog}
          onOpenChange={setShowDialog}
        />
      </div>

      <Footer />
    </Layout>
  )
}
