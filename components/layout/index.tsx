import { PropsWithChildren } from "react"
import Head from "next/head"
import clsx from "clsx"

type Props = PropsWithChildren & {
  withoutContainer?: boolean
  className?: string
  title?: string
}

export function Layout({
  children,
  withoutContainer,
  className,
  title,
}: Props) {
  const descriptionValue = title
    ? `${title} - Invest Smart هي شركة رائدة تقدم حلول تعدين البيتكوين مع تحقيق عوائد مضمونة.`
    : "إنفست سمارت هي شركة متخصصة في تقديم حلول استثمارية مبتكرة في تعدين البيتكوين، مع تحقيق عوائد شهرية ثابتة وسهولة الوصول."

  const urlValue = "https://invest-smartnow.com"

  return (
    <>
      <Head>
        <title>
          {title
            ? `${title} - Invest Smart`
            : "Invest Smart | Bitcoin Mining Solutions"}
        </title>
        <meta name="description" content={descriptionValue} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="robots" content="index, follow" />
        <meta
          name="keywords"
          content="Invest Smart, تعدين البيتكوين, استثمار البيتكوين, حلول استثمارية, Bitcoin Mining, Bitcoin Investment, Passive Income"
        />
        <link rel="canonical" href={urlValue} />

        <meta property="og:type" content="website" />
        <meta property="og:url" content={urlValue} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={descriptionValue} />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={urlValue} />
        <meta property="twitter:title" content={title} />
        <meta property="twitter:description" content={descriptionValue} />
      </Head>
      <main
        className={clsx(
          "flex-1 py-10 md:py-20",
          !withoutContainer && "container",
          className
        )}
      >
        {children}
      </main>
    </>
  )
}
