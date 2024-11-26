import { Dispatch, SetStateAction, useRef } from "react"
import { useRouter } from "next/router"
import { emailVerificationCheck } from "@/services/api"
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
import InputWithError from "@/components/input-with-error"

type Props = {
  open: boolean
  onOpenChange: Dispatch<SetStateAction<boolean>>
}

type VerificationCodeFormSchemaType = {
  code: string
}

export function EmailVerificationCodeDialog({ open, onOpenChange }: Props) {
  const { t } = useTranslation("common")

  const router = useRouter()

  const recaptcha = useRef<ReCAPTCHA>(null)

  const formSchema = z.object({
    code: z.string().min(1, { message: t("validation.required") }),
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<VerificationCodeFormSchemaType>({
    resolver: zodResolver(formSchema),
  })

  const onSubmit: SubmitHandler<VerificationCodeFormSchemaType> = async ({
    code,
  }) => {
    const token = localStorage.getItem("userToken")
    const recaptchaValue = recaptcha.current?.getValue()
    if (!recaptchaValue) {
      toast.error("Please verify the reCAPTCHA!")
      return
    }

    try {
      const response = await emailVerificationCheck(
        token ?? "",
        code,
        recaptchaValue
      )

      if (response.status === 200 && response.data.success) {
        localStorage.setItem("userToken", token ?? "")
        toast.success(t("toast.verification_success"))
        onOpenChange(false)
        router.push("/dashboard")
      } else {
        toast.error(response.data.message || t("toast.invalid_code"))
      }
    } catch (error) {
      toast.error(t("toast.error"), {
        description: t("toast.error_description"),
      })
    } finally {
      recaptcha.current?.reset()
      reset()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-sm:max-w-[325px]">
        <DialogHeader className="items-start">
          <DialogTitle>{t("enter_verification_code")}</DialogTitle>
          <DialogDescription>
            {t("enter_verification_code_message")}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <InputWithError
              id="verification-code"
              label={t("verification_code")}
              placeholder={t("verification_code_placeholder")}
              {...register("code")}
              error={errors.code}
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
              disabled={isSubmitting}
              className="w-32 flex items-center justify-center"
            >
              {isSubmitting ? (
                <div className="animate-spin">
                  <LoaderIcon />
                </div>
              ) : (
                <span className="w-[100px] text-center">
                  {t("verify_code")}
                </span>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
