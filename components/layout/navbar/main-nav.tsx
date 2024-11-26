import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import { isAuthenticated } from "@/actions/auth"
import { logoutUser } from "@/services/api"
import clsx from "clsx"
import { LogInIcon, LogOutIcon, UserPlusIcon } from "lucide-react"
import setLanguage from "next-translate/setLanguage"
import useTranslation from "next-translate/useTranslation"
import { toast } from "sonner"

import { NavItem } from "@/types/nav"
import { Button } from "@/components/ui/button"
import { LoginFormDialog } from "@/components/auth/login-form-dialog"
import { RegisterFormDialog } from "@/components/auth/register-form-dialog"

import { ThemeToggle } from "../../theme-toggle"

interface MainNavProps {
  items?: NavItem[]
}

export function MainNav({ items }: MainNavProps) {
  const router = useRouter()
  const { lang } = useTranslation()
  const [isMobile, setIsMobile] = useState(false)
  const [isScrolledDown, setIsScrolledDown] = useState(false)
  const [time, setTime] = useState<Date | null>(null)
  const [isMounted, setIsMounted] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isRegisterDialogOpen, setIsRegisterDialogOpen] = useState(false)
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false)

  const handleResize = () => setIsMobile(window.innerWidth <= 1024)
  const handleScroll = () => setIsScrolledDown(window.scrollY > 120)

  const handleToggleLanguage = () => {
    setLanguage(lang === "ar" ? "en" : "ar")
  }

  const checkAuthentication = async () => {
    const authenticated = await isAuthenticated()
    setIsLoggedIn(authenticated)
  }

  useEffect(() => {
    checkAuthentication()
  }, [])

  useEffect(() => {
    setIsRegisterDialogOpen(false)
    setIsLoginDialogOpen(false)
    checkAuthentication() // Re-check authentication when routing
  }, [router.pathname])

  useEffect(() => {
    if (lang === "en") {
      document.documentElement.dir = "ltr"
      document.body.style.textAlign = "left"
    } else {
      document.documentElement.dir = "rtl"
      document.body.style.textAlign = "right"
    }
  }, [lang])

  useEffect(() => {
    setIsMounted(true)

    window.addEventListener("resize", handleResize)
    window.addEventListener("scroll", handleScroll)

    handleResize()
    handleScroll()

    const timeInterval = setInterval(() => setTime(new Date()), 1000)

    return () => {
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("scroll", handleScroll)
      clearInterval(timeInterval)
    }
  }, [])

  const handleLogout = async () => {
    try {
      await logoutUser(localStorage.getItem("userToken") as string)
      localStorage.removeItem("userToken")
      setIsLoggedIn(false)
      toast.success(
        lang === "en" ? "Logout Successful" : "تم تسجيل الخروج بنجاح",
        {
          description:
            lang === "en"
              ? "You have successfully logged out of your account."
              : "لقد قمت بتسجيل الخروج من حسابك.",
        }
      )
      router.push("/")
    } catch (error: any) {
      toast.error(lang === "en" ? "An error occurred" : "حدث خطأ", {
        description:
          lang === "en" ? "Please try again later." : "يرجى المحاولة لاحقًا.",
      })
    }
  }

  // Add this function to handle successful login
  const handleSuccessfulLogin = () => {
    setIsLoggedIn(true)
  }

  return (
    <>
      <div
        className={clsx(
          isScrolledDown ? "block h-[80px] lg:h-[88px]" : "hidden"
        )}
      />
      <nav className="flex justify-between items-center max-w-[1920px] z-50 px-3 lg:px-10 py-1 mx-auto border-b">
        {/* Logo */}
        <Link
          className={clsx(
            "gap-1 items-center text-lg relative w-20 sm:w-24",
            isScrolledDown && !isMobile ? "hidden" : "flex"
          )}
          href="/"
          style={{ aspectRatio: "1024 / 724" }}
        >
          <Image src="/invest-smart.png" alt="Invest Smart Logo" fill />
        </Link>

        {/* Language Toggle */}
        <div className="flex gap-2 sm:gap-4 items-center text-[10px] sm:text-sm">
          {isMounted && (
            <button
              className="p-1 text-sm font-semibold"
              onClick={() => handleToggleLanguage()}
            >
              {lang === "ar" ? "EN" : "عربي"}
            </button>
          )}

          {/* Time and Date */}
          {isMounted && time && (
            <div
              className="flex max-sm:flex-col sm:gap-1 text-xs text-muted-foreground"
              dir="ltr"
            >
              <div>{time.toLocaleDateString()}</div>
            </div>
          )}

          {/* Theme Toggle */}
          <div
            className={clsx(isScrolledDown && !isMobile ? "hidden" : "block")}
          >
            <ThemeToggle />
          </div>

          {/* Dashboard Link */}
          <Link
            href="#"
            className="flex items-center gap-1 font-semibold transition-all text-sm md:text-lg text-primary-500 hover:text-primary-700"
          >
            <span>APP</span>
          </Link>
          {isLoggedIn && (
            <Link
              href="/dashboard"
              className="flex items-center gap-1 font-semibold transition-all text-sm md:text-lg text-primary-500 hover:text-primary-700"
            >
              <span>Dashboard</span>
            </Link>
          )}

          {/* Login/Signup Buttons */}
          <div className="flex gap-1 sm:gap-2">
            {!isLoggedIn ? (
              <>
                <Button
                  variant="ghost"
                  className="first:max-sm:text-[10px] max-sm:px-1.5 group"
                  onClick={() => {
                    setIsRegisterDialogOpen(false)
                    setIsLoginDialogOpen(true)
                  }}
                >
                  <span>{lang === "en" ? "Login" : "تسجيل الدخول"}</span>
                  <div
                    className={clsx(
                      "max-sm:hidden transition-transform duration-300",
                      lang === "en"
                        ? "ml-2 group-hover:-translate-x-1"
                        : "mr-2 group-hover:translate-x-1"
                    )}
                  >
                    <LogInIcon />
                  </div>
                </Button>
                <Button
                  variant="default"
                  className="first:max-sm:text-[10px] max-sm:px-1.5 group"
                  onClick={() => {
                    setIsLoginDialogOpen(false)
                    setIsRegisterDialogOpen(true)
                  }}
                >
                  <span>{lang === "en" ? "Sign Up" : "إنشاء حساب"}</span>
                  <div
                    className={clsx(
                      "max-sm:hidden transition-transform duration-300",
                      lang === "en"
                        ? "ml-2 group-hover:-translate-x-1"
                        : "mr-2 group-hover:translate-x-1"
                    )}
                  >
                    <UserPlusIcon />
                  </div>
                </Button>
              </>
            ) : (
              <Button
                variant="ghost"
                className="first:max-sm:text-[10px] max-sm:px-1.5 group"
                onClick={handleLogout}
              >
                <span>{lang === "en" ? "Logout" : "تسجيل الخروج"}</span>
                <div
                  className={clsx(
                    "max-sm:hidden transition-transform duration-300",
                    lang === "en"
                      ? "ml-2 group-hover:-translate-x-1"
                      : "mr-2 group-hover:translate-x-1"
                  )}
                >
                  <LogOutIcon />
                </div>
              </Button>
            )}
          </div>
        </div>
      </nav>

      <RegisterFormDialog
        open={isRegisterDialogOpen}
        onOpenChange={setIsRegisterDialogOpen}
      />

      <LoginFormDialog
        open={isLoginDialogOpen}
        onOpenChange={setIsLoginDialogOpen}
      />
    </>
  )
}
