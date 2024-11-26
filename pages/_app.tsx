import "@/styles/globals.css"
import { AppProps } from "next/app"

import { fontMono, fontSans } from "@/lib/fonts"
import { Toaster } from "@/components/ui/sonner"
import Footer from "@/components/layout/footer/Footer"
import { SiteHeader } from "@/components/layout/navbar/site-header"
import { TailwindIndicator } from "@/components/tailwind-indicator"
import { ThemeProvider } from "@/components/theme-provider"

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div
        className={`relative flex min-h-screen flex-col ${fontSans.variable} ${fontMono.variable}`}
      >
        <SiteHeader />
        <Component {...pageProps} />
        <TailwindIndicator />
        <Toaster />
      </div>
    </ThemeProvider>
  )
}

export default MyApp
