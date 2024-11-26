import { useEffect, useState } from "react"
import Link from "next/link"
import { gitSupportMissages, supportMissage } from "@/services/api"
import clsx from "clsx"
import { motion } from "framer-motion"
import {
  LoaderIcon,
  Mail,
  MenuIcon,
  MessageCircle,
  Phone,
  Send,
  XIcon,
} from "lucide-react"
import useTranslation from "next-translate/useTranslation"
import { SubmitHandler, useForm } from "react-hook-form"
import { toast } from "sonner"

import { siteConfig } from "@/config/site"
import { Button } from "@/components/ui/button"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Layout } from "@/components/layout"
import Sidebar from "@/components/layout/navbar/sidebar"
import {
  MessageData,
  SupportMessagesTable,
} from "@/components/support-messages-table"

type SupportFormData = {
  message: string
}

export default function Support() {
  const { t, lang } = useTranslation("common")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const [messages, setMessages] = useState<MessageData[]>([])

  const fetchMessages = async () => {
    const token = localStorage.getItem("userToken")
    if (!token) return

    try {
      const response = await gitSupportMissages(token)
      if (response.data.success) {
        setMessages(response.data.data)
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error)
    }
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SupportFormData>()

  const onSubmit: SubmitHandler<SupportFormData> = async (data) => {
    setIsSubmitting(true)
    const token = localStorage.getItem("userToken")

    if (!token) {
      toast.error("Please login first.")
      setIsSubmitting(false)
      return
    }

    try {
      await supportMissage(data.message, token)
      toast.success(t("message_sent_successfully"))
      fetchMessages()
      reset()
    } catch (error) {
      toast.error(t("message_send_fail"))
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true)
      } else {
        setIsSidebarOpen(false)
      }
    }

    window.addEventListener("resize", handleResize)
    handleResize()

    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    fetchMessages()
  }, [])

  return (
    <ProtectedRoute>
      <Layout title="Support">
        <div className="flex justify-center w-full">
          <div
            className={clsx(
              "lg:block",
              "hidden lg:w-56 2xl:w-36 min-[1700px]:w-20 min-[1900px]:w-0",
              lang === "en" ? "lg:pr-0 lg:pl-6" : "lg:pl-0 lg:pr-6",
              isSidebarOpen ? "flex-shrink-0" : "hidden"
            )}
          >
            <Sidebar />
          </div>

          <div className="flex-1 lg:px-6 max-w-5xl mx-auto">
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-orange-500 to-gray-500 text-transparent bg-clip-text mb-8 text-center">
              {t("support")}
            </h1>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-4 mb-12 items-center"
            >
              <textarea
                {...register("message", { required: t("message_required") })}
                className="w-full p-4 border rounded-md focus:outline-none focus:border-blue-500"
                placeholder={t("enter_your_message")}
                rows={6}
              />
              {errors.message && (
                <p className="text-red-500">{errors.message.message}</p>
              )}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="mt-6 w-40"
              >
                {isSubmitting ? (
                  <div className="animate-spin">
                    <LoaderIcon />
                  </div>
                ) : (
                  <span className="text-center">{t("send_message")}</span>
                )}
              </Button>
            </form>

            <SupportMessagesTable data={messages} />

            <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Link
                href={`mailto:${siteConfig.links.mail}`}
                passHref
                legacyBehavior
              >
                <motion.div
                  className="flex items-center gap-4 p-4 border rounded-lg cursor-pointer"
                  initial={{ opacity: 0, y: -20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <Mail className="size-6 text-blue-600" />
                  <div>
                    <p className="font-semibold">{t("email")}</p>
                    <span className="text-blue-600 underline">
                      {siteConfig.links.mail}
                    </span>
                  </div>
                </motion.div>
              </Link>

              <Link
                href={siteConfig.links.whatsapp}
                target="_blank"
                rel="noreferrer"
                passHref
                legacyBehavior
              >
                <motion.div
                  className="flex items-center gap-4 p-4 border rounded-lg cursor-pointer"
                  initial={{ opacity: 0, y: -20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <Phone className="size-6 text-green-600" />
                  <div>
                    <p className="font-semibold">{t("whatsapp_number")}</p>
                    <span className="text-green-600 underline">1234567890</span>
                  </div>
                </motion.div>
              </Link>

              <Link
                href={siteConfig.links.telegram}
                target="_blank"
                rel="noreferrer"
                passHref
                legacyBehavior
              >
                <motion.div
                  className="flex items-center gap-4 p-4 border rounded-lg cursor-pointer"
                  initial={{ opacity: 0, y: -20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <Send className="size-6 text-purple-600" />
                  <div>
                    <p className="font-semibold">{t("telegram")}</p>
                    <span className="text-purple-600 underline">
                      t.me/investsmart
                    </span>
                  </div>
                </motion.div>
              </Link>

              <Link href="tel:1234567890" passHref legacyBehavior>
                <motion.div
                  className="flex items-center gap-4 p-4 border rounded-lg cursor-pointer"
                  initial={{ opacity: 0, y: -20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <MessageCircle className="size-6 text-orange-600" />
                  <div>
                    <p className="font-semibold">
                      {t("direct_contact_number")}
                    </p>
                    <span className="text-orange-600">123-456-7890</span>
                  </div>
                </motion.div>
              </Link>
            </div>
          </div>
        </div>

        <div
          className={clsx(
            "lg:hidden",
            "fixed inset-0 bg-black bg-opacity-50 transition-all",
            isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
        />
        <motion.div
          className={clsx(
            "lg:hidden fixed inset-y-0 bg-white dark:bg-gray-800 transition-all",
            lang === "en" ? "left-0" : "right-0"
          )}
          initial={{ x: "100%", opacity: 100 }}
          animate={{
            x: isSidebarOpen ? "0%" : "100%",
            opacity: "100",
          }}
          transition={{ duration: 2 }}
        >
          {isSidebarOpen && <Sidebar className="!max-h-full" />}
        </motion.div>

        <button
          onClick={toggleSidebar}
          className={clsx(
            "lg:hidden p-3 bg-primary-foreground rounded-full fixed bottom-6 z-50 shadow-lg",
            lang === "en" ? "left-6" : "right-6"
          )}
        >
          {isSidebarOpen ? <XIcon /> : <MenuIcon />}
        </button>
      </Layout>
    </ProtectedRoute>
  )
}
