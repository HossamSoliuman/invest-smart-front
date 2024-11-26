import { JetBrains_Mono as FontMono, Cairo as FontSans } from "next/font/google"

export const fontSans = FontSans({
  subsets: ["latin", "arabic"],
  variable: "--font-sans",
  display: "swap",
})

export const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
})
