import { Dispatch, SetStateAction } from "react"
import Image from "next/image"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { DEPOSIT_OPTIONS, DepositOption } from "./deposit-options-dialog"

type Props = {
  open: boolean
  onOpenChange: Dispatch<SetStateAction<boolean>>
  handleConfirmation: () => void
  onSelectOption: (option: DepositOption) => void
}

export function WithdrawOptionsDialog({
  open,
  onOpenChange,
  handleConfirmation,
  onSelectOption,
}: Props) {
  const handleOptionClick = (option: DepositOption) => {
    onSelectOption(option)
    handleConfirmation()
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-sm:max-w-[325px] sm:max-w-xl">
          <DialogHeader className="items-start">
            <DialogTitle className="text-base sm:text-lg">
              إختر طريقة السحب
            </DialogTitle>
            <DialogDescription className="text-sm sm:text-base">
              يرجي إختيار الطريقة التي سيتم السحب بها
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
            {DEPOSIT_OPTIONS.map((option, index) => (
              <button
                key={index}
                className="flex flex-col items-center justify-center gap-2 p-3 sm:p-4 bg-card-foreground/80 rounded-md w-full aspect-[1/0.75]"
                onClick={() => handleOptionClick(option)}
              >
                <div className="relative w-8 sm:w-9 aspect-square">
                  <Image src={option.img} alt={option.title} fill />
                </div>
                <div className="flex flex-col items-center gap-1">
                  <p className="font-bold text-xs sm:text-sm text-primary-foreground">
                    {option.title}
                  </p>
                  <p className="text-[10px] sm:text-sm font-semibold text-primary-foreground/80">
                    {option.short.toUpperCase()}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
