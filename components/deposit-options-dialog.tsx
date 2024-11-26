import { Dispatch, SetStateAction, useState } from "react"
import Image from "next/image"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { Button } from "./ui/button"

type Props = {
  open: boolean
  onOpenChange: Dispatch<SetStateAction<boolean>>
  handleConfirmation: () => void
  onSelectOption: (option: DepositOption) => void
}

export type DepositOption = {
  title: string
  short: string
  img: string
  address: string
  qrcode: string
}

export const DEPOSIT_OPTIONS: DepositOption[] = [
  {
    title: "Bitcoin",
    short: "btc",
    img: "bitcoin-btc-logo.svg",
    address: "bc1qmlaugmznq6v388mllaqqryrgq62cpe7zm0pgqp",
    qrcode: "/qrcode/BTC.jpeg",
  },
  {
    title: "Ethereum",
    short: "eth",
    img: "ethereum-eth-logo.svg",
    address: "0x78732596a7Ecfc9961d66ec2c0B289a16a7125f7",
    qrcode: "/qrcode/ETH.jpeg",
  },
  {
    title: "Litecoin",
    short: "ltc",
    img: "litecoin-ltc-logo.svg",
    address: "ltc1qr5why2fv64r396ptsdk6jcnfa0tggjt5jevpxt",
    qrcode: "/qrcode/LTC.jpeg",
  },
  {
    title: "Solana",
    short: "sol",
    img: "solana-sol-logo.svg",
    address: "B8ontUHADbopebxfuVF2DbrBcXP2krH1QE5eDWqDsoWY",
    qrcode: "/qrcode/SOL.jpeg",
  },
  {
    title: "USDT (TRC20)",
    short: "trc20",
    img: "tether-usdt-logo.svg",
    address: "TYDmzwDd1JH1N2iTCkXs9k8hntkmVb6KBB",
    qrcode: "/qrcode/USDT - TRC20.jpeg",
  },
  {
    title: "USDT (ERC20)",
    short: "erc20",
    img: "tether-usdt-logo.svg",
    address: "0x78732596a7Ecfc9961d66ec2c0B289a16a7125f7",
    qrcode: "/qrcode/USDT - ERC20.jpeg",
  },
]

export function DepositOptionsDialog({
  open,
  onOpenChange,
  handleConfirmation,
  onSelectOption,
}: Props) {
  const [selectedOption, setSelectedOption] = useState<DepositOption | null>(
    null
  )

  const handleOptionClick = (option: DepositOption) => {
    setSelectedOption(option)
    onSelectOption(option)
  }

  const closeQRCodeDialog = () => {
    setSelectedOption(null)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-sm:max-w-[325px] sm:max-w-xl">
          <DialogHeader className="items-start">
            <DialogTitle className="text-base sm:text-lg">
              إختر طريقة الإيداع
            </DialogTitle>
            <DialogDescription className="text-sm sm:text-base">
              يرجي إختيار الطريقة التي سيتم الإيداع بها
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

      {selectedOption && (
        <Dialog open={!!selectedOption} onOpenChange={closeQRCodeDialog}>
          <DialogContent className="max-sm:max-w-[300px] sm:max-w-md ">
            <DialogHeader className="items-start">
              <DialogTitle className="text-base sm:text-lg">
                {selectedOption.title}
              </DialogTitle>
              <DialogDescription className="text-sm sm:text-base">
                قم بمسح رمز QR للإيداع إلى العنوان التالي:
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col items-center gap-3 mt-4 max-w-full">
              <Image
                src={`/btc-qrcode.jpeg`}
                alt={`${selectedOption.title} QR Code`}
                width={120}
                height={120}
                className="size-24 sm:size-36"
              />
              <p className="font-mono text-xs sm:text-sm text-center break-all">
                {selectedOption.address}
              </p>
              <Button
                onClick={() => {
                  closeQRCodeDialog()
                  handleConfirmation()
                }}
                className="text-xs sm:text-base"
              >
                تأكيد الإيداع
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
