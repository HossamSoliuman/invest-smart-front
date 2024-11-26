import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { useRouter } from "next/router"
import { withdrawAmount } from "@/services/api"
import { zodResolver } from "@hookform/resolvers/zod"
import { LoaderIcon } from "lucide-react"
import useTranslation from "next-translate/useTranslation"
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

import { DepositOption } from "./deposit-options-dialog"
import InputWithError from "./input-with-error"

type Props = {
  open: boolean
  onOpenChange: Dispatch<SetStateAction<boolean>>
  refreshTransactions: () => void
  selectedWithdrawOption: DepositOption | null
  closeAllDialogs: () => void
}

export type WithdrawFormDataSchemaType = {
  address: string
  amount: number
  currency: string
}

export function WithdrawFormDialog({
  open,
  onOpenChange,
  refreshTransactions,
  selectedWithdrawOption,
  closeAllDialogs,
}: Props) {
  const router = useRouter()
  const { t, lang } = useTranslation("common")

  const [isSubmitting, setIsSubmitting] = useState(false)

  const formSchema = z.object({
    address: z.string().min(1, { message: t("validation.title_required") }),
    amount: z.number().positive({ message: t("validation.amount_positive") }),
  })

  const handleWithdraw = async (formData: WithdrawFormDataSchemaType) => {
    setIsSubmitting(true)
    try {
      const token = localStorage.getItem("userToken")
      if (!token) {
        toast.error(t("toast.withdraw_fail"), {
          description: t("toast.withdraw_fail_description"),
        })
        return
      }

      const response = await withdrawAmount(
        formData.amount,
        formData.address,
        formData.currency,
        token
      )

      if (response.status === 200) {
        toast.success(t("toast.withdraw_success"), {
          description: t("toast.withdraw_success_description"),
        })
        refreshTransactions()
        closeAllDialogs()
        router.push("/payments")
      } else {
        toast.error(response.data.message ?? t("toast.withdraw_fail"), {
          description: t("toast.withdraw_fail_description"),
        })
      }
    } catch (error: any) {
      let errorMessage
      if (
        error.response?.data?.message === "Insufficient balance" &&
        lang === "ar"
      ) {
        errorMessage = "لا يوجد رصيد كافى"
      } else {
        errorMessage = error.response?.data?.message
      }
      toast.error(errorMessage ?? t("toast.withdraw_fail"), {
        description: t("toast.withdraw_fail_description"),
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
  } = useForm<WithdrawFormDataSchemaType>({
    resolver: zodResolver(formSchema),
  })

  const onSubmit: SubmitHandler<WithdrawFormDataSchemaType> = async (data) => {
    await handleWithdraw({
      ...data,
      currency: selectedWithdrawOption?.short.toLocaleUpperCase() ?? "UNKNOWN",
    })
  }

  useEffect(() => {
    !open && reset()
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-sm:max-w-[325px]">
        <DialogHeader className="items-start">
          <DialogTitle>{t("withdraw")}</DialogTitle>
          <DialogDescription>
            {t("withdraw_form_description")}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={formSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <InputWithError
              id="address"
              label={t("address")}
              placeholder={t("address_placeholder_withdraw")}
              {...register("address")}
              error={errors.address}
            />
            <InputWithError
              id="amount"
              label={t("amount")}
              placeholder={t("amount_placeholder")}
              type="number"
              {...register("amount", {
                setValueAs: (value) => Number(value),
              })}
              error={errors.amount}
            />
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
                  {t("withdraw_button")}
                </span>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
