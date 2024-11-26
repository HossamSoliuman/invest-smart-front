import Link from "next/link"
import { useRouter } from "next/router"
import clsx from "clsx"
import { Home, LifeBuoy, Settings, WalletIcon } from "lucide-react"
import useTranslation from "next-translate/useTranslation"

export default function Sidebar({ className }: { className?: string }) {
  const router = useRouter()

  const { t, lang } = useTranslation("common")

  const links = [
    { href: "/dashboard", label: t("home"), icon: Home },
    { href: "/payments", label: t("payments"), icon: WalletIcon },
    { href: "/support", label: t("support"), icon: LifeBuoy },
    { href: "/settings", label: t("settings"), icon: Settings },
  ]

  return (
    <div
      className={clsx(
        "sidebar absolute top-0 lg:top-[77px] w-[261px] h-full bg-white text-card-foreground dark:bg-card dark:text-card-foreground border-l shadow-lg dark:shadow-none",
        lang === "en" ? "left-0" : "right-0",
        className
      )}
    >
      <ul>
        {links.map(({ href, label, icon: Icon }) => (
          <li
            key={href}
            className={clsx(
              "border-b cursor-pointer transition-all duration-200 ease-in-out group flex items-center gap-2",
              {
                "text-primary font-semibold bg-muted dark:bg-muted/10":
                  router.pathname === href,
                "hover:text-primary": router.pathname !== href,
              }
            )}
          >
            <Link
              href={href}
              className="p-4 flex items-center gap-2 w-full group-hover:scale-105 duration-200 ease-in-out"
            >
              <Icon
                className={clsx("transition-all duration-200 ease-in-out", {
                  "text-primary": router.pathname === href,
                })}
              />
              <span>{label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
