"use client"

import { siteConfig } from "@/config/site"
import { MainNav } from "@/components/layout/navbar/main-nav"

export function SiteHeader() {
  return (
    <header>
      <MainNav items={siteConfig.mainNav} />
    </header>
  )
}
