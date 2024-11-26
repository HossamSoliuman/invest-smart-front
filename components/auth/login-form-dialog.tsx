import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react"
import { useRouter } from "next/router"
import { loginUser } from "@/services/api"
import { zodResolver } from "@hookform/resolvers/zod"
import { LoaderIcon } from "lucide-react"
import useTranslation from "next-translate/useTranslation"
import ReCAPTCHA from "react-google-recaptcha"
import { SubmitHandler, useForm } from "react-hook-form"
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

import InputWithError from "../input-with-error"
import { EmailVerificationDialog } from "./email-verification-dialog"
import { ResetPasswordDialog } from "./reset-password-dialog"

type Props = {
  open: boolean
  onOpenChange: Dispatch<SetStateAction<boolean>>
}

export type LoginFormDataSchemaType = {
  email: string
  password: string
}

export function LoginFormDialog({ open, onOpenChange }: Props) {
  const router = useRouter()
  const { t } = useTranslation("common")

  const recaptcha = useRef<ReCAPTCHA>(null)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [emailVerifiedDialog, setEmailVerifiedDialog] = useState(false)

  const formSchema = z.object({
    email: z.string().email({ message: t("validation.email") }),
    password: z.string().min(6, { message: t("validation.password") }),
  })

  const handleSubmit = async (formData: LoginFormDataSchemaType) => {
    setIsSubmitting(true)
    try {
      const response = await loginUser(formData)

      if (response.status === 200) {
        const { token, user } = response.data.data
        localStorage.setItem("userToken", token)

        if (user.email_verified === 1) {
          toast.success(t("toast.login_success"), {
            description: t("toast.login_success_description"),
          })
          router.push("/dashboard")
        } else {
          setEmailVerifiedDialog(true)
          onOpenChange(false)
        }
      } else {
        toast.error(t("toast.login_fail"), {
          description: t("toast.login_fail_description"),
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
    formState: { errors, isSubmitting: formIsSubmitting },
    reset,
  } = useForm<LoginFormDataSchemaType>({
    resolver: zodResolver(formSchema),
  })

  const onSubmit: SubmitHandler<LoginFormDataSchemaType> = async (data) => {
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
            <DialogTitle>{t("login")}</DialogTitle>
            <DialogDescription>{t("login_form_description")}</DialogDescription>
          </DialogHeader>
          <form onSubmit={formSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
              <InputWithError
                id="email"
                label={t("email")}
                placeholder={t("email_placeholder")}
                {...register("email")}
                error={errors.email}
              />
              <InputWithError
                id="password"
                label={t("password")}
                placeholder={t("password_placeholder")}
                type="password"
                {...register("password")}
                error={errors.password}
              />
              <div className="w-full flex justify-center my-4">
                <ReCAPTCHA
                  ref={recaptcha}
                  sitekey={"6Lcj4oUqAAAAAMWsLbXwPmo0iQ4Hjxp7_Vd4ZVO7"}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                disabled={isSubmitting || formIsSubmitting}
                className="w-32 flex items-center justify-center"
              >
                {isSubmitting || formIsSubmitting ? (
                  <div className="animate-spin">
                    <LoaderIcon />
                  </div>
                ) : (
                  <span className="w-[100px] text-center">
                    {t("login_button")}
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
