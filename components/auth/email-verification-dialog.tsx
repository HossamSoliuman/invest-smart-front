import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react"
import { emailVerificationSend } from "@/services/api"
import { LoaderIcon } from "lucide-react"
import useTranslation from "next-translate/useTranslation"
import ReCAPTCHA from "react-google-recaptcha"
import { SubmitHandler, useForm } from "react-hook-form"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { EmailVerificationCodeDialog } from "./email-verification-code-dialog"

type Props = {
  open: boolean
  onOpenChange: Dispatch<SetStateAction<boolean>>
}

export function EmailVerificationDialog({ open, onOpenChange }: Props) {
  const { t, lang } = useTranslation("common")
  const [codeDialogOpen, setCodeDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const recaptcha = useRef<ReCAPTCHA>(null)

  const {
    handleSubmit,
    formState: { errors },
  } = useForm({})

  const handleResendVerification: SubmitHandler<any> = async () => {
    const token = localStorage.getItem("userToken")
    const recaptchaValue = recaptcha.current?.getValue()
    if (!recaptchaValue) {
      toast.error("Please verify the reCAPTCHA!")
      return
    }

    setIsLoading(true)
    try {
      await emailVerificationSend(token ?? "", recaptchaValue)
      toast.success(t("toast.verification_sent"))
      onOpenChange(false)
      setCodeDialogOpen(true)
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || t("toast.error_description")
      toast.error(t("toast.error"), {
        description: errorMessage,
      })
    } finally {
      setIsLoading(false)
      recaptcha.current?.reset()
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          dir={lang === "ar" ? "rtl" : "ltr"}
          className="max-sm:max-w-[325px]"
        >
          <DialogHeader className="items-start">
            <DialogTitle>{t("email_verification_required")}</DialogTitle>
            <DialogDescription>
              {t("email_verification_message")}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleResendVerification)}>
            <div className="w-full flex justify-center my-4">
              <ReCAPTCHA
                ref={recaptcha}
                sitekey={"6Lcj4oUqAAAAAMWsLbXwPmo0iQ4Hjxp7_Vd4ZVO7"}
              />
            </div>
            <DialogFooter>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-32 flex items-center justify-center"
              >
                {isLoading ? (
                  <div className="animate-spin">
                    <LoaderIcon />
                  </div>
                ) : (
                  <span className="w-[100px] text-center">
                    {t("resend_verification")}
                  </span>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <EmailVerificationCodeDialog
        open={codeDialogOpen}
        onOpenChange={setCodeDialogOpen}
      />
    </>
  )
}
