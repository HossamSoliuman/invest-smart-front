import { useState } from "react"
import clsx from "clsx"
import { EyeIcon } from "lucide-react"
import useTranslation from "next-translate/useTranslation"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export type MessageData = {
  id: number
  message: string
  status: string
  created_at: string
  updated_at: string
}

interface SupportMessagesTableProps {
  data: MessageData[]
}

export function SupportMessagesTable({ data }: SupportMessagesTableProps) {
  const { t, lang } = useTranslation("common")
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null)

  return (
    <div className="overflow-x-auto max-w-full mt-8">
      <h3 className="sm:text-lg md:text-xl lg:text-2xl font-extrabold mb-4 text-center bg-gradient-to-r from-orange-500 to-gray-500 text-transparent bg-clip-text">
        {t("yourMessagesOverview")}
      </h3>

      <Table className="table-auto w-full">
        <TableCaption>{t("sentMessages")}</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead
              className={clsx(
                "w-1/4",
                lang === "ar" ? "text-right" : "text-left"
              )}
            >
              {t("dateTable")}
            </TableHead>
            <TableHead
              className={clsx(
                "w-1/2",
                lang === "ar" ? "text-right" : "text-left"
              )}
            >
              {t("messagePreview")}
            </TableHead>
            <TableHead
              className={clsx(
                "w-1/4",
                lang === "ar" ? "text-right" : "text-left"
              )}
            >
              {t("status")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((message) => (
            <TableRow key={message.id}>
              <TableCell
                className={clsx(
                  "font-medium",
                  lang === "ar" ? "text-right" : "text-left"
                )}
              >
                {new Date(message.created_at).toLocaleDateString(
                  lang === "ar" ? "ar-EG" : "en-US"
                )}
              </TableCell>
              <TableCell
                className={clsx(lang === "ar" ? "text-right" : "text-left")}
              >
                {message.message.length > 50 ? (
                  <Dialog>
                    <div className="flex items-center">
                      <p>{message.message.slice(0, 50)}...</p>
                      <DialogTrigger asChild>
                        <Button
                          variant="link"
                          onClick={() => setSelectedMessage(message.message)}
                        >
                          <EyeIcon />
                        </Button>
                      </DialogTrigger>
                    </div>
                    <DialogContent
                      onEscapeKeyDown={() => setSelectedMessage(null)}
                    >
                      <DialogHeader>
                        <DialogTitle
                          className={clsx(
                            lang === "ar" ? "text-right" : "text-left"
                          )}
                        >
                          {t("fullMessage")}
                        </DialogTitle>
                      </DialogHeader>
                      <p>{selectedMessage}</p>
                    </DialogContent>
                  </Dialog>
                ) : (
                  message.message
                )}
              </TableCell>
              <TableCell
                className={clsx(lang === "ar" ? "text-right" : "text-left")}
              >
                {message.status}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
