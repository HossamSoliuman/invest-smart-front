"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import useTranslation from "next-translate/useTranslation"

import SectionTitle from "./section-title"

export default function ProjectSection() {
  const { t } = useTranslation("common")

  return (
    <section id="project-section" className="mt-12">
      <div className="flex max-md:flex-col-reverse items-stretch">
        <motion.div
          className="grid items-center gap-4 w-full"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex flex-col items-start gap-4">
            <SectionTitle title={t("project_title")} />
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1.2 }}
              className="md:text-lg text-muted-foreground"
            >
              {t("project_description_1")}
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1.4 }}
              className="md:text-lg text-muted-foreground"
            >
              {t("project_description_2")}
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1.6 }}
              className="md:text-lg text-muted-foreground"
            >
              {t("project_description_3")}
            </motion.p>
          </div>
        </motion.div>
        <motion.div
          className="w-full aspect-video relative invest-welcome-animate"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        >
          <Image src="/bitcoin-mining.png" alt="Bitcoin mining" fill />
        </motion.div>
      </div>
    </section>
  )
}
