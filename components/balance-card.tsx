import { useState } from "react"
import clsx from "clsx"
import { LogInIcon } from "lucide-react"
import useTranslation from "next-translate/useTranslation"

import { DepositFormDialog } from "./deposit-form-dialog"
import { DepositOption, DepositOptionsDialog } from "./deposit-options-dialog"
import { Button } from "./ui/button"
import { Card } from "./ui/card"
import { WithdrawFormDialog } from "./withdraw-form-dialog"
import { WithdrawOptionsDialog } from "./withdraw-options-dialog"

export default function BalanceCard({
  balance,
  refreshTransactions,
}: {
  balance: number
  refreshTransactions: () => void
}) {
  const [isDepositOptionsDialogOpen, setIsDepositOptionsDialogOpen] =
    useState(false)
  const [isWithdrawOptionsDialogOpen, setIsWithdrawOptionsDialogOpen] =
    useState(false)
  const [isDepositDialogOpen, setIsDepositDialogOpen] = useState(false)
  const [isWithdrawDialogOpen, setIsWithdrawDialogOpen] = useState(false)

  const [selectedDepositOption, setSelectedDepositOption] =
    useState<DepositOption | null>(null)

  const [selectedWithdrawOption, setSelectedWithdrawOption] =
    useState<DepositOption | null>(null)

  const closeAllDialogs = () => {
    setIsDepositOptionsDialogOpen(false)
    setIsDepositDialogOpen(false)
    setIsWithdrawOptionsDialogOpen(false)
    setIsWithdrawDialogOpen(false)
  }

  const { t, lang } = useTranslation("common")

  return (
    <Card className="p-6 w-full flex flex-col gap-4">
      <div className="flex max-md:flex-col max-md:items-center justify-between">
        <h4 className="text-lg font-extrabold bg-gradient-to-r from-orange-500 to-gray-500 text-transparent bg-clip-text">
          {t("account")}
        </h4>
        <p className="font-semibold max-md:text-center">
          1BTC = $6666666 {t("btcUpdates")}
        </p>
      </div>
      <div className="bg-gray-300 h-px w-full my-4" />
      <div>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between font-semibold">
            <p>{t("investmentAccount")}</p>
            <p className="text-lg">{balance}$</p>
          </div>
          <div className="bg-gray-300 h-px w-full my-4" />
          <div className="flex justify-between font-semibold">
            <p>{t("bitcoinMiningAccount")}</p>
            <div className="flex gap-1">
              <p className="text-lg">BTC</p>
              <p className="text-lg">0</p>
            </div>
          </div>
          <div className="bg-gray-300 h-px w-full my-4" />
          <div className="flex justify-between font-semibold">
            <p>{t("electricityCost")}</p>
            <p className="text-lg">0.06$</p>
          </div>
        </div>
      </div>
      <div className="bg-gray-300 h-px w-full my-4" />
      <div className="flex gap-2 justify-center">
        <Button
          variant="ghost"
          className="group"
          onClick={() => setIsWithdrawOptionsDialogOpen(true)}
        >
          <span>{t("withdraw")}</span>
          <div
            className={clsx(
              "rotate-90 transition-transform duration-300",
              lang === "en"
                ? "ml-2 group-hover:-translate-x-1"
                : "mr-2 group-hover:translate-x-1"
            )}
          >
            <LogInIcon />
          </div>
        </Button>
        <Button
          variant="default"
          className="group"
          size={"lg"}
          onClick={() => setIsDepositOptionsDialogOpen(true)}
        >
          <span>{t("deposit")}</span>
          <div
            className={clsx(
              "-rotate-90 transition-transform duration-300",
              lang === "en"
                ? "ml-2 group-hover:-translate-x-1"
                : "mr-2 group-hover:translate-x-1"
            )}
          >
            <LogInIcon />
          </div>
        </Button>
      </div>

      <WithdrawOptionsDialog
        open={isWithdrawOptionsDialogOpen}
        onOpenChange={setIsWithdrawOptionsDialogOpen}
        handleConfirmation={() => setIsWithdrawDialogOpen(true)}
        onSelectOption={(option) => {
          setSelectedWithdrawOption(option)
        }}
      />
      <DepositOptionsDialog
        open={isDepositOptionsDialogOpen}
        onOpenChange={setIsDepositOptionsDialogOpen}
        handleConfirmation={() => {
          setIsDepositDialogOpen(true)
        }}
        onSelectOption={(option) => {
          setSelectedDepositOption(option)
        }}
      />
      <DepositFormDialog
        open={isDepositDialogOpen}
        onOpenChange={setIsDepositDialogOpen}
        refreshTransactions={() => refreshTransactions()}
        selectedDepositOption={selectedDepositOption}
        closeAllDialogs={closeAllDialogs}
      />
      <WithdrawFormDialog
        open={isWithdrawDialogOpen}
        onOpenChange={setIsWithdrawDialogOpen}
        refreshTransactions={refreshTransactions}
        selectedWithdrawOption={selectedWithdrawOption}
        closeAllDialogs={closeAllDialogs}
      />
    </Card>
  )
}
