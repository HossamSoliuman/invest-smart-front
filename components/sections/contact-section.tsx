"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Mail, MessageCircle, Phone, Send } from "lucide-react"
import useTranslation from "next-translate/useTranslation"

import { siteConfig } from "@/config/site"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { ContactFormDialog } from "../contact-form-dialog"
import { Button } from "../ui/button"

export default function ContactSection() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { t } = useTranslation("common")

  return (
    <section id="contact-section" className="mt-12">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-3xl font-extrabold md:text-4xl bg-gradient-to-r from-orange-500 to-gray-500 text-transparent bg-clip-text py-4">
            {t("contact_us")}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 items-center justify-center max-w-fit">
            {/* Email Icon */}
            <Link
              href={`mailto:${siteConfig.links.mail}`}
              passHref
              legacyBehavior
            >
              <motion.div
                className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 cursor-pointer hover:bg-blue-200"
                whileHover={{ scale: 1.1 }}
              >
                <Mail className="text-blue-600 size-10" />
              </motion.div>
            </Link>

            {/* WhatsApp Icon */}
            <Link
              href={siteConfig.links.whatsapp}
              target="_blank"
              rel="noreferrer"
              passHref
              legacyBehavior
            >
              <motion.div
                className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100 cursor-pointer hover:bg-green-200"
                whileHover={{ scale: 1.1 }}
              >
                <Phone className="text-green-600 size-10" />
              </motion.div>
            </Link>

            {/* Telegram Icon */}
            <Link
              href={siteConfig.links.telegram}
              target="_blank"
              rel="noreferrer"
              passHref
              legacyBehavior
            >
              <motion.div
                className="flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 cursor-pointer hover:bg-purple-200"
                whileHover={{ scale: 1.1 }}
              >
                <Send className="text-purple-600 size-10" />
              </motion.div>
            </Link>

            {/* Direct Call Icon */}
            <Link href="tel:1234567890" passHref legacyBehavior>
              <motion.div
                className="flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 cursor-pointer hover:bg-orange-200"
                whileHover={{ scale: 1.1 }}
              >
                <MessageCircle className="text-orange-600 size-10" />
              </motion.div>
            </Link>
          </div>
        </CardContent>
      </Card>

      <ContactFormDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </section>
  )
}
