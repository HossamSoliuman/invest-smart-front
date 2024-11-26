export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: "Invest Smart",
  description:
    "Beautifully designed components built with Radix UI and Tailwind CSS.",
  mainNav: [
    {
      title: "من نحن",
      href: "#welcome-section",
      target: "_self",
      translationKey: "aboutUs",
    },
    {
      title: "عن المشروع",
      href: "#project-section",
      target: "_self",
      translationKey: "project",
    },
    {
      title: "الإنطلاق",
      href: "#launch-section",
      target: "_self",
      translationKey: "launch",
    },
    {
      title: "البيتكوين",
      href: "#bitcoin-history-section",
      target: "_self",
      translationKey: "bitcoin",
    },
    {
      title: "تواصل معنا",
      href: "#contact-section",
      target: "_self",
      translationKey: "contact",
    },
  ],
  links: {
    twitter: "https://x.com/InvestSmar80106",
    facebook: "https://www.facebook.com/investsmarrt",
    instagram: "https://www.instagram.com/investsmarrt_",
    whatsapp: "https://wa.me/+447883301306",
    phone: "+447883301306",
    telegram: "https://t.me/Invest_Smart_LTD",
    mail: "info@investsmart.com",
  },
  baseURL: "https://admin.invest-smartnow.com/api",
}
