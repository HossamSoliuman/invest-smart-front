import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react"
import { useRouter } from "next/router"
import { registerUser } from "@/services/api"
import { zodResolver } from "@hookform/resolvers/zod"
import clsx from "clsx"
import { LoaderIcon } from "lucide-react"
import useTranslation from "next-translate/useTranslation"
import ReCAPTCHA from "react-google-recaptcha"
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import InputWithError from "../input-with-error"
import { EmailVerificationDialog } from "./email-verification-dialog"

type Props = {
  open: boolean
  onOpenChange: Dispatch<SetStateAction<boolean>>
}

export type RegisterFormDataSchemaType = {
  name: string
  email: string
  phone: string
  country: string
  age: number
  gender: "male" | "female"
  password: string
  confirmPassword: string
}

export function RegisterFormDialog({ open, onOpenChange }: Props) {
  const { t, lang } = useTranslation("common")
  const router = useRouter()

  const recaptcha = useRef<ReCAPTCHA>(null)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [emailVerifiedDialog, setEmailVerifiedDialog] = useState(false)

  const formSchema = z
    .object({
      name: z.string().min(3, { message: t("validation.full_name") }),
      email: z.string().email({ message: t("validation.email") }),
      phone: z.string().min(8, { message: t("validation.phone") }),
      country: z.string().min(2, { message: t("validation.country") }),
      age: z.number().min(18, { message: t("validation.age") }),
      gender: z.enum(["male", "female"], { message: t("validation.gender") }),
      password: z.string().min(6, { message: t("validation.password") }),
      confirmPassword: z
        .string()
        .min(8, { message: t("validation.confirm_password") }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("validation.password_match"),
      path: ["confirmPassword"],
    })

  const handleSubmit = async (formData: RegisterFormDataSchemaType) => {
    setIsSubmitting(true)
    try {
      const response = await registerUser(formData)

      if (response.status === 200) {
        const { token, user } = response.data.data
        localStorage.setItem("userToken", token)

        if (user.email_verified === 1) {
          toast.success(t("toast.registration_success"))
          router.push("/dashboard")
        } else {
          setEmailVerifiedDialog(true)
          onOpenChange(false)
        }
      } else {
        toast.error(t("toast.registration_fail"), {
          description: t("toast.registration_fail_description"),
        })
      }
    } catch (error: any) {
      toast.error(t("toast.error"), {
        description:
          error.response?.data?.message ?? t("toast.error_description"),
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const {
    register,
    handleSubmit: formSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<RegisterFormDataSchemaType>({
    resolver: zodResolver(formSchema),
  })

  const onSubmit: SubmitHandler<RegisterFormDataSchemaType> = async (data) => {
    const recaptchaValue = recaptcha.current?.getValue()
    if (!recaptchaValue) {
      toast.error("Please verify the reCAPTCHA!")
      return
    }

    const formData = {
      ...data,
      recaptcha: recaptchaValue,
    }

    try {
      await handleSubmit(formData)
    } catch (error) {
      console.error("Submission failed:", error)
    } finally {
      recaptcha.current?.reset()
    }
  }

  useEffect(() => {
    if (!open) reset()
  }, [open])

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-sm:max-w-[325px]">
          <DialogHeader className="items-start">
            <DialogTitle>{t("register")}</DialogTitle>
            <DialogDescription>
              {t("register_form_description")}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={formSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
              <InputWithError
                id="name"
                label={t("full_name")}
                placeholder={t("full_name_placeholder")}
                {...register("name")}
                error={errors.name}
              />
              <InputWithError
                id="email"
                label={t("email")}
                placeholder={t("email_placeholder")}
                {...register("email")}
                error={errors.email}
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
              <InputWithError
                id="confirmPassword"
                label={t("confirm_password")}
                type="password"
                placeholder={t("confirm_password_placeholder")}
                {...register("confirmPassword")}
                error={errors.confirmPassword}
              />
              <div className="flex gap-4 w-full justify-between">
                <Label
                  htmlFor="gender"
                  className={`max-sm:!text-xs pt-3 w-[100px] sm:w-[150px] ${
                    lang === "en" ? "text-left" : "text-right"
                  }`}
                >
                  {t("gender")}
                </Label>
                <div className="flex flex-col gap-2 w-full">
                  <Controller
                    name="gender"
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        dir={lang === "ar" ? "rtl" : "ltr"}
                      >
                        <SelectTrigger
                          className={clsx(
                            "max-sm:!text-xs w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-2 py-2",
                            lang === "ar" ? "text-right" : "text-left"
                          )}
                        >
                          {field.value ? (
                            <SelectValue />
                          ) : (
                            <span
                              className={clsx(
                                "text-gray-500 w-full",
                                lang === "ar" ? "text-right" : "text-left"
                              )}
                            >
                              {t("select_gender")}
                            </span>
                          )}
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem
                            value="male"
                            className={
                              lang === "ar" ? "text-right" : "text-left"
                            }
                          >
                            {t("male")}
                          </SelectItem>
                          <SelectItem
                            value="female"
                            className={
                              lang === "ar" ? "text-right" : "text-left"
                            }
                          >
                            {t("female")}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.gender && (
                    <p className="text-red-600 text-[10px]">
                      {errors.gender.message?.toString()}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="w-full flex justify-center my-4">
              <ReCAPTCHA
                ref={recaptcha}
                sitekey={"6Lcj4oUqAAAAAMWsLbXwPmo0iQ4Hjxp7_Vd4ZVO7"}
              />
            </div>
            <DialogFooter>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-32 flex items-center justify-center"
              >
                {isSubmitting ? (
                  <div className="animate-spin">
                    <LoaderIcon />
                  </div>
                ) : (
                  <span className="w-[100px] text-center">
                    {t("create_account_button")}
                  </span>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <EmailVerificationDialog
        open={emailVerifiedDialog}
        onOpenChange={setEmailVerifiedDialog}
      />
    </>
  )
}
