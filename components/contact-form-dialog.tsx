import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react"
import { contactUs } from "@/services/api"
import { zodResolver } from "@hookform/resolvers/zod"
import { LoaderIcon } from "lucide-react"
import useTranslation from "next-translate/useTranslation"
import ReCAPTCHA from "react-google-recaptcha"
import { useForm } from "react-hook-form"
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

import InputWithError from "./input-with-error"

type Props = {
  open: boolean
  onOpenChange: Dispatch<SetStateAction<boolean>>
}

export function ContactFormDialog({ open, onOpenChange }: Props) {
  const { t } = useTranslation("common")

  const recaptcha = useRef<ReCAPTCHA>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const formSchema = z.object({
    fullName: z.string().min(3, { message: t("validation.full_name") }),
    email: z.string().email({ message: t("validation.email") }),
    phoneNumber: z.string().min(8, { message: t("validation.phone") }),
    country: z.string().min(2, { message: t("validation.country") }),
    investmentAmount: z
      .number({ invalid_type_error: t("validation.investment_amount") })
      .positive({ message: t("validation.positive_investment") }),
  })

  const {
    register,
    handleSubmit: formSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(formSchema),
  })

  const handleSubmit = async (formData: any) => {
    const recaptchaValue = recaptcha.current?.getValue()
    if (!recaptchaValue) {
      toast.error("Please verify the reCAPTCHA!")
      return
    }

    setIsSubmitting(true)
    try {
      await contactUs(
        formData.fullName,
        formData.email,
        formData.phoneNumber,
        formData.country,
        formData.investmentAmount,
        recaptchaValue
      )
      toast.success(t("toast.success"), {
        description: t("toast.success_description"),
      })
      reset()
    } catch (error) {
      console.error(error)
      toast.error(t("toast.fail"), {
        description: t("toast.fail_description"),
      })
    } finally {
      setIsSubmitting(false)
      recaptcha.current?.reset()
    }
  }

  useEffect(() => {
    !open && reset()
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-sm:max-w-[325px]">
        <DialogHeader className="items-start">
          <DialogTitle>{t("contact_us")}</DialogTitle>
          <DialogDescription>{t("contact_form_description")}</DialogDescription>
        </DialogHeader>
        <form onSubmit={formSubmit(handleSubmit)}>
          <div className="grid gap-4 py-4">
            <InputWithError
              id="fullName"
              label={t("full_name")}
              placeholder={t("full_name_placeholder")}
              {...register("fullName")}
              error={errors.fullName}
            />
            <InputWithError
              id="email"
              label={t("email")}
              placeholder={t("email_placeholder")}
              {...register("email")}
              error={errors.email}
            />
            <InputWithError
              id="phoneNumber"
              label={t("phone_number")}
              placeholder={t("phone_number_placeholder")}
              {...register("phoneNumber")}
              error={errors.phoneNumber}
            />
            <InputWithError
              id="country"
              label={t("country")}
              placeholder={t("country_placeholder")}
              {...register("country")}
              error={errors.country}
            />
            <InputWithError
              id="investmentAmount"
              label={t("investment_amount")}
              type="number"
              placeholder={t("investment_amount_placeholder")}
              {...register("investmentAmount", { valueAsNumber: true })}
              error={errors.investmentAmount}
            />
            <div className="w-full flex justify-center my-4">
              <ReCAPTCHA
                ref={recaptcha}
                sitekey="6Lcj4oUqAAAAAMWsLbXwPmo0iQ4Hjxp7_Vd4ZVO7"
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
                <span>{t("submit_button")}</span>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
