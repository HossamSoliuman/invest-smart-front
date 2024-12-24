import nextTranslate from "next-translate-plugin"

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ["ar", "en"],
    defaultLocale: "en",
    localeDetection: true,
  },
}

export default nextTranslate(nextConfig)
