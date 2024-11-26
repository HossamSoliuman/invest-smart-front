"use client"

import Image from "next/image"
import clsx from "clsx"
import { motion } from "framer-motion"
import useTranslation from "next-translate/useTranslation"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AboutUsSection() {
  const { t, lang } = useTranslation("common")

  return (
    <section id="about-us-section" className="mt-12">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-3xl font-extrabold md:text-4xl bg-gradient-to-r from-orange-500 to-gray-500 text-transparent bg-clip-text py-4">
            {t("about_us_title")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col-reverse md:flex-row-reverse items-stretch">
            <motion.div
              className="grid items-center gap-4 w-full"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex flex-col items-start gap-4">
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 1.2 }}
                  className="md:text-lg text-muted-foreground"
                >
                  {t("about_us_description_1")}
                </motion.p>
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 1.4 }}
                  className="md:text-lg text-muted-foreground"
                >
                  {t("about_us_description_2")}
                </motion.p>
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 1.6 }}
                  className="md:text-lg text-muted-foreground"
                >
                  {t("about_us_description_3")}
                </motion.p>
              </div>
            </motion.div>
            <motion.div
              className={clsx(
                "w-full aspect-video relative",
                lang === "en" ? "mr-4" : "ml-4"
              )}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            >
              <Image src="/about-us.gif" alt="About Us" fill />
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
