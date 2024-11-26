import { useEffect, useState } from "react"
import { getUser, updateUser } from "@/services/api"
import { zodResolver } from "@hookform/resolvers/zod"
import clsx from "clsx"
import { motion } from "framer-motion"
import { LoaderIcon, MenuIcon, XIcon } from "lucide-react"
import useTranslation from "next-translate/useTranslation"
import { SubmitHandler, useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { ProtectedRoute } from "@/components/auth/protected-route"
import InputWithError from "@/components/input-with-error"
import { Layout } from "@/components/layout"
import Sidebar from "@/components/layout/navbar/sidebar"

export type UserEditFormData = {
  name: string
  phone: string
  country: string
  age: number
  password?: string
}

export default function Settings() {
  const { t, lang } = useTranslation("common")
  const [userData, setUserData] = useState<UserEditFormData>({
    name: "",
    phone: "",
    country: "",
    age: 0,
    password: undefined,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const formSchema = z.object({
    name: z.string().min(3, { message: t("validation.full_name") }),
    phone: z.string().min(8, { message: t("validation.phone") }),
    country: z.string().min(2, { message: t("validation.country") }),
    age: z.number().min(18, { message: t("validation.age") }),
    password: z.string().optional(),
  })

  const {
    register,
    handleSubmit: formSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<UserEditFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: userData,
  })

  const watchedValues = watch()
  const hasChanged = JSON.stringify(watchedValues) !== JSON.stringify(userData)

  useEffect(() => {
    async function fetchUserData() {
      const token = localStorage.getItem("userToken")
      if (token) {
        const response = await getUser(token)
        setUserData(response.data.data)
        reset(response.data.data)
      }
    }
    fetchUserData()
  }, [reset])

  const handleUpdateSuccess = async (data: UserEditFormData) => {
    setIsSubmitting(true)
    try {
      await updateUser(data)
      toast.success(t("toast.update_success"))
      setUserData(data)
      reset(data)
    } catch (error: any) {
      toast.error(t("toast.update_fail"))
    } finally {
      setIsSubmitting(false)
    }
  }

  const onSubmit: SubmitHandler<UserEditFormData> = async (data) => {
    if (hasChanged) {
      await handleUpdateSuccess(data)
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

  return (
    <ProtectedRoute>
      <Layout title="Settings">
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

          <div className="flex-1 lg:px-6 max-w-3xl mx-auto">
            <h1 className="text-xl md:text-2xl lg:text-3xl font-extrabold bg-gradient-to-r from-orange-500 to-gray-500 text-transparent bg-clip-text mb-6 text-center">
              {t("edit_profile")}
            </h1>
            <form
              onSubmit={formSubmit(onSubmit)}
              className="flex flex-col items-center"
            >
              <div className="grid gap-4 w-full">
                <InputWithError
                  id="name"
                  label={t("full_name")}
                  placeholder={t("full_name_placeholder")}
                  {...register("name")}
                  error={errors.name}
                />
                <InputWithError
                  id="phone"
                  label={t("phone_number")}
                  placeholder={t("phone_number_placeholder")}
                  {...register("phone")}
                  error={errors.phone}
                />
                <InputWithError
                  id="country"
                  label={t("country")}
                  placeholder={t("country_placeholder")}
                  {...register("country")}
                  error={errors.country}
                />
                <InputWithError
                  id="age"
                  label={t("age")}
                  type="number"
                  placeholder={t("age_placeholder")}
                  {...register("age", { valueAsNumber: true })}
                  error={errors.age}
                />
                <InputWithError
                  id="password"
                  label={t("password")}
                  type="password"
                  placeholder={t("password_placeholder")}
                  {...register("password")}
                  error={errors.password}
                />
              </div>
              <Button
                type="submit"
                disabled={isSubmitting || !hasChanged}
                className="mt-6 w-40"
              >
                {isSubmitting ? (
                  <div className="animate-spin">
                    <LoaderIcon />
                  </div>
                ) : (
                  <span className="text-center">{t("save_changes")}</span>
                )}
              </Button>
            </form>
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
