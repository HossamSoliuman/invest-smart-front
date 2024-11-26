import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { useRouter } from "next/router"
import { depositAmount } from "@/services/api"
import { zodResolver } from "@hookform/resolvers/zod"
import { LoaderIcon, UploadIcon, XCircleIcon } from "lucide-react"
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

import { DEPOSIT_OPTIONS, DepositOption } from "./deposit-options-dialog"

type Props = {
  open: boolean
  onOpenChange: Dispatch<SetStateAction<boolean>>
  refreshTransactions: () => void
  selectedDepositOption: DepositOption | null
  closeAllDialogs: () => void
}

export type DepositFormDataSchemaType = {
  address: string
  amount: number
  proofImage: File | null
}

export function DepositFormDialog({
  open,
  onOpenChange,
  refreshTransactions,
  selectedDepositOption,
  closeAllDialogs,
}: Props) {
  const router = useRouter()
  const { t } = useTranslation("common")

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)
  const [selectedCurrency, setSelectedCurrency] =
    useState<DepositOption | null>(selectedDepositOption)
  const [proofImage, setProofImage] = useState<File | null>(null)

  const formSchema = z.object({
    proofImage: z.any().refine((file) => file !== null, {
      message: t("validation.proof_image_required"),
    }),
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setProofImage(file)
  }

  const removeImage = () => setProofImage(null)

  const handleCurrencyChange = (option: DepositOption) => {
    setSelectedCurrency(option)
  }

  const handleSubmit = async (formData: DepositFormDataSchemaType) => {
    if (!selectedAmount) {
      toast.error(t("validation.amount_required"))
      return
    }

    setIsSubmitting(true)
    try {
      const token = localStorage.getItem("userToken")
      if (!token) {
        toast.error(t("toast.deposit_fail"), {
          description: t("toast.deposit_fail_description"),
        })
        return
      }

      const response = await depositAmount(
        selectedAmount,
        formData.address,
        proofImage as File,
        selectedCurrency?.short.toUpperCase() ?? "",
        token
      )

      if (response.status === 200) {
        toast.success(t("toast.deposit_success"), {
          description: t("toast.deposit_success_description"),
        })
        refreshTransactions()
        closeAllDialogs()
        router.push("/payments")
      } else {
        toast.error(response.data.message ?? t("toast.deposit_fail"), {
          description: t("toast.deposit_fail_description"),
        })
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message ?? t("toast.deposit_fail"), {
        description: t("toast.deposit_fail_description"),
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
  } = useForm<DepositFormDataSchemaType>({
    resolver: zodResolver(formSchema),
  })

  const onSubmit = async () => {
    if (selectedCurrency) {
      await handleSubmit({
        address: selectedCurrency.address,
        amount: selectedAmount as number,
        proofImage,
      })
    }
  }

  useEffect(() => {
    if (!open) {
      reset()
      setSelectedAmount(null)
      setProofImage(null)
      setSelectedCurrency(selectedDepositOption)
    }
  }, [open, selectedDepositOption, reset])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-sm:max-w-[325px]">
        <DialogHeader className="items-start">
          <DialogTitle>{t("deposit")}</DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
            {t("deposit_form_description")}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={formSubmit(onSubmit)}>
          <div className="grid gap-3 py-2 sm:gap-4 sm:py-4">
            <div className="flex flex-wrap gap-2 justify-center">
              {DEPOSIT_OPTIONS.map((option) => (
                <Button
                  key={option.short}
                  type="button"
                  onClick={() => handleCurrencyChange(option)}
                  variant={
                    selectedCurrency?.short === option.short
                      ? "default"
                      : "outline"
                  }
                  className="flex-1 min-w-[70px] max-w-[120px] text-sm"
                >
                  {option.short.toUpperCase()}
                </Button>
              ))}
            </div>

            <div className="flex gap-2">
              {[500, 1000, 2000].map((amount) => (
                <Button
                  key={amount}
                  type="button"
                  onClick={() => setSelectedAmount(amount)}
                  variant={selectedAmount === amount ? "default" : "outline"}
                  className="w-20 sm:w-24 text-sm"
                >
                  ${amount}
                </Button>
              ))}
            </div>

            {/* رفع الصورة */}
            <div>
              <label
                htmlFor="proofImage"
                className="mb-1 block text-sm font-medium sm:text-base"
              >
                {t("proof_image")}
              </label>
              <div className="flex items-center gap-2">
                <label
                  htmlFor="proofImage"
                  className="cursor-pointer flex items-center gap-2 border px-3 py-2 rounded-md text-sm"
                >
                  <UploadIcon className="size-4" />
                  {proofImage ? proofImage.name : t("upload_proof_image")}
                </label>
                <input
                  type="file"
                  id="proofImage"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                {proofImage && (
                  <button
                    type="button"
                    onClick={removeImage}
                    className="text-destructive"
                    aria-label="Remove image"
                  >
                    <XCircleIcon className="size-4" />
                  </button>
                )}
              </div>
              {errors.proofImage && (
                <p className="text-destructive text-xs sm:text-sm">
                  {errors.proofImage.message}
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="submit"
              disabled={
                isSubmitting ||
                formIsSubmitting ||
                !selectedAmount ||
                !proofImage ||
                !selectedCurrency
              }
              className="w-full sm:w-32 flex items-center justify-center"
            >
              {isSubmitting || formIsSubmitting ? (
                <LoaderIcon className="animate-spin" />
              ) : (
                t("deposit_button")
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
