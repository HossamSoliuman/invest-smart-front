import { useEffect, useState } from "react"
import { getTransactions, getUser } from "@/services/api"
import clsx from "clsx"
import { motion } from "framer-motion"
import { MenuIcon, XIcon } from "lucide-react"
import useTranslation from "next-translate/useTranslation"

import { Button } from "@/components/ui/button"
import { ProtectedRoute } from "@/components/auth/protected-route"
import BalanceCard from "@/components/balance-card"
import { DashboardTable, Transaction } from "@/components/dashboard-table"
import { Layout } from "@/components/layout"
import Sidebar from "@/components/layout/navbar/sidebar"

import { UserEditFormData } from "./settings"

type userInformation = UserEditFormData & {
  balance: number
}

export default function Payments() {
  const [user, setUser] = useState<userInformation | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  async function fetchUser() {
    try {
      const token = localStorage.getItem("userToken")
      if (token) {
        const response = await getUser(token)
        setUser(response.data.data)
      } else {
        console.error("No token found")
      }
    } catch (error) {
      console.error("Error fetching user data:", error)
    }
  }

  async function fetchTransactions(page: number) {
    try {
      const token = localStorage.getItem("userToken")
      if (token) {
        const response = await getTransactions(token, page)

        setTransactions(response.data.data.data)

        setTotalPages(response.data.data.pagination.last_page || 1)
      } else {
        console.error("No token found")
      }
    } catch (error) {
      console.error("Error fetching transactions:", error)
    }
  }

  useEffect(() => {
    fetchUser()
    fetchTransactions(currentPage)
  }, [currentPage])

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

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage)
    }
  }

  const { t, lang } = useTranslation("common")

  return (
    <ProtectedRoute>
      <Layout title="Payments">
        <div className="flex">
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

          <div className="flex-1 lg:px-6 max-w-full">
            <section className="flex max-md:flex-col gap-2">
              <BalanceCard
                balance={user?.balance ?? 0}
                refreshTransactions={() => fetchTransactions(currentPage)}
              />
            </section>
            <section className="mt-12">
              <DashboardTable data={transactions} />
              <div className="flex justify-between items-center mt-4">
                <Button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded"
                >
                  &laquo; {t("previous")}
                </Button>
                <span>
                  {t("page", { current: currentPage, total: totalPages })}
                </span>
                <Button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="p-2 rounded"
                >
                  {t("next")} &raquo;
                </Button>
              </div>
            </section>
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
