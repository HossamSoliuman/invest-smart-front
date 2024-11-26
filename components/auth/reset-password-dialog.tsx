import { Dispatch, SetStateAction, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import useTranslation from "next-translate/useTranslation"
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

import InputWithError from "../input-with-error"

type Props = {
  open: boolean
  onOpenChange: Dispatch<SetStateAction<boolean>>
}

export function ResetPasswordDialog({ open, onOpenChange }: Props) {
  const { t } = useTranslation("common")

  const formSchema = z.object({
    email: z.string().email({ message: t("validation.email") }),
  })

  async function handleSubmit(formData: any) {
    try {
      const response = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success(t("toast.reset_password_success"), {
          description: t("toast.reset_password_success_description"),
        })
      } else {
        toast.error(t("toast.reset_password_fail"))
      }
    } catch (error) {
      toast.error(t("toast.error"), {
        description: t("toast.error_description"),
      })
    }
  }

  const {
    register,
    handleSubmit: formSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(formSchema),
  })

  const onSubmit = (data: any) => {
    handleSubmit(data)
  }

  useEffect(() => {
    if (!open) reset()
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-sm:max-w-[325px]">
        <DialogHeader className="items-start">
          <DialogTitle>{t("forgot_password")}</DialogTitle>
          <DialogDescription>
            {t("reset_password_description")}
          </DialogDescription>
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
          </div>
          <DialogFooter>
            <Button type="submit">{t("send_reset_link")}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
