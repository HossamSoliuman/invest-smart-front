"use client"

import { ReactNode, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import clsx from "clsx"
import { motion } from "framer-motion"
import { Facebook, Instagram, Mail, Phone, Send } from "lucide-react"
import useTranslation from "next-translate/useTranslation"

import { siteConfig } from "@/config/site"
import { Button } from "@/components/ui/button"
import { ContactFormDialog } from "@/components/contact-form-dialog"
import { WhatsappIcon } from "@/components/whatsapp"
import { TwitterX } from "@/components/x-icon"

export default function Footer() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { t } = useTranslation("common")

  return (
    <footer
      dir="ltr"
      className="relative bottom-0 left-0 w-full bg-[hsl(var(--footer-background))] py-8 border-t border-[hsl(var(--footer-border))] text-[hsl(var(--footer-foreground))]"
    >
      <div className="flex flex-col gap-4 text-sm md:text-base lg:text-lg">
        <div className="container flex flex-col md:flex-row max-sm:items-center justify-between gap-6">
          {/* Address Section */}
          <div className="max-sm:text-center max-sm:text-sm sm:text-left">
            <p className="font-extrabold lg:text-[22px]">Invest Smart</p>
            <p>128 City Road London</p>
            <p>EC1V 2NX UNITED KINGDOM</p>
          </div>

          {/* Icons Section */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Phone size={30} />
              <p>{siteConfig.links.phone}</p>
            </div>
            <SocialIcon
              href={siteConfig.links.whatsapp}
              icon={<WhatsappIcon />}
              ariaLabel="WhatsApp"
            />
            <SocialIcon
              href={`mailto:${siteConfig.links.mail}`}
              icon={<Mail size={30} />}
              ariaLabel="Mail"
            />
          </div>

          {/* Contact Section */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <Button
              onClick={() => setIsDialogOpen(true)}
              className="items-center bg-[#297acc] rounded-none font-bold text-base lg:text-lg"
            >
              {t("contact_button")}
            </Button>
          </motion.div>
        </div>

        <hr className="mx-1 opacity-60" />

        <div className="mt-2 container flex flex-col md:flex-row max-sm:items-center justify-between gap-6">
          <div className="flex items-center gap-3 max-sm:order-3">
            <SocialIcon
              href={siteConfig.links.facebook}
              icon={<Facebook size={30} />}
              ariaLabel="Facebook"
              withoutParagraph
            />
            <SocialIcon
              href={siteConfig.links.instagram}
              icon={<Instagram size={30} />}
              ariaLabel="Instagram"
              withoutParagraph
            />
            <SocialIcon
              href={siteConfig.links.twitter}
              icon={<TwitterX />}
              ariaLabel="Twitter"
              withoutParagraph
            />
            <SocialIcon
              href={siteConfig.links.telegram}
              icon={<Send size={30} />}
              ariaLabel="Telegram"
              withoutParagraph
            />
          </div>
          <div className="flex items-center gap-4 max-sm:order-2">
            {siteConfig.mainNav.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                target={link.target}
                className="flex flex-col gap-1 capitalize"
              >
                <p>{t(link.translationKey)}</p>
                <div className="bg-primary h-px" />
              </Link>
            ))}
          </div>
          <Link
            className={clsx(
              "gap-1 items-center text-lg relative w-20 sm:w-32 md:w-44 max-sm:order-1"
            )}
            href="/"
            style={{ aspectRatio: "1024 / 724" }}
          >
            <Image src="/invest-smart.png" alt="Invest Smart Logo" fill />
          </Link>
        </div>
      </div>

      <ContactFormDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </footer>
  )
}

const SocialIcon = ({
  href,
  icon,
  ariaLabel,
  withoutParagraph,
}: {
  href: string
  icon: ReactNode
  ariaLabel: string
  withoutParagraph?: boolean
}) => {
  const displayText = href.includes("mailto:")
    ? href.replace("mailto:", "")
    : href.includes("https://wa.me/")
    ? href.replace("https://wa.me/", "")
    : href

  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className="flex items-center gap-2 group"
    >
      {icon}
      {!withoutParagraph && <p className="underline">{displayText}</p>}
    </Link>
  )
}
