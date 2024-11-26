import useTranslation from "next-translate/useTranslation"

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export type Transaction = {
  id: number
  user_id: number
  amount: number
  address: string
  transaction_type: string
  status: string
  created_at: string
  updated_at: string
}

interface DashboardTableProps {
  data: Transaction[]
}

export function DashboardTable({ data }: DashboardTableProps) {
  const { t } = useTranslation("common")

  return (
    <div className="overflow-x-auto max-w-full">
      <Table className="table-auto w-full">
        <TableCaption>{t("transactionsHistoryTable")}</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/5 text-right">{t("dateTable")}</TableHead>
            <TableHead className="w-1/5 text-right">
              {t("transactionId")}
            </TableHead>
            <TableHead className="w-1/5 text-right">{t("amount")}</TableHead>
            <TableHead className="w-1/5 text-right">
              {t("transactionStatus")}
            </TableHead>
            <TableHead className="w-1/5 text-right">
              {t("transactionType")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell className="text-right font-medium">
                {new Date(transaction.created_at).toLocaleDateString("ar-EG")}
              </TableCell>
              <TableCell className="text-right">{transaction.id}</TableCell>
              <TableCell className="text-right">{transaction.amount}</TableCell>
              <TableCell className="text-right">{transaction.status}</TableCell>
              <TableCell className="text-right">
                {transaction.transaction_type}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
