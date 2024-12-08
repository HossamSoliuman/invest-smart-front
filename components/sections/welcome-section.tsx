"use client"

import { useState } from "react"
import Image from "next/image"
import clsx from "clsx"
import { motion } from "framer-motion"
import useTranslation from "next-translate/useTranslation"

import { Button } from "@/components/ui/button"

import TradingViewWidget from "../TradingViewWidget"
import { ContactFormDialog } from "../contact-form-dialog"
import SectionTitle from "./section-title"

export default function WelcomeSection() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { t, lang } = useTranslation("common")

  return (
    <section id="welcome-section">
      <div
        className={clsx(
          "flex max-md:flex-col items-stretch relative md:mb-10 lg:mb-20",
          lang === "en" ? "gap-40 lg:mb-40" : "gap-6"
        )}
      >
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="grid gap-4 w-full"
        >
          <div className="flex flex-col items-start gap-4">
            <SectionTitle title={t("welcome_title")} />
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 2 }}
              className="md:text-lg text-muted-foreground"
            >
              {t("welcome_description")}
            </motion.p>
          </div>
          <div className="flex gap-4 self-start max-md:hidden">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <Button
                onClick={() => setIsDialogOpen(true)}
                className="mt-4 items-center"
              >
                {t("contact_button")}
              </Button>
            </motion.div>
          </div>
        </motion.div>
        <div
          className={clsx(
            "md:absolute md:bottom-0 dark:z-10",
            lang === "en"
              ? "md:translate-y-[44%] md:left-1/2 md:translate-x-[-34%]"
              : "md:translate-y-[28%] md:right-1/2 md:translate-x-[30%]"
          )}
        >
          <Image
            alt="Bitcoin"
            src="/bitcoin-welcome.png"
            width={1400}
            height={719}
            className="xl:max-w-[1000px]"
          />
        </div>
        <motion.div
          className="w-full aspect-video relative flex justify-end"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        >
          <div
            className={clsx(lang === "en" ? "w-[62%]" : "w-full dark:w-[62%]")}
          >
            <TradingViewWidget />
          </div>
        </motion.div>
      </div>

      <div className="flex gap-4 self-start md:hidden">
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="mt-4 items-center"
          >
            {t("contact_button")}
          </Button>
        </motion.div>
      </div>

      <ContactFormDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </section>
  )
}
