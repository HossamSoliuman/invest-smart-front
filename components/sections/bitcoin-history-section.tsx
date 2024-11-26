"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import {
  CategoryScale,
  Chart as ChartJS,
  ChartOptions,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from "chart.js"
import { motion } from "framer-motion"
import useTranslation from "next-translate/useTranslation"

import BitcoinChart from "../bitcoin-chart"
import { Button } from "../ui/button"
import SectionTitle from "./section-title"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const timeRanges: Record<string, { label: string; days: number }> = {
  day: { label: "اليوم", days: 1 },
  week: { label: "الأسبوع", days: 7 },
  month: { label: "الشهر", days: 30 },
  year: { label: "العام", days: 365 },
}

const DENSITY_LEVELS = {
  low: 20,
  medium: 50,
  high: 100,
}

export default function BitcoinHistorySection() {
  const { t, lang } = useTranslation("common")
  const [data, setData] = useState<any>(null)
  const [selectedRange, setSelectedRange] =
    useState<keyof typeof timeRanges>("week")
  const [density, setDensity] = useState<keyof typeof DENSITY_LEVELS>("medium")

  const fetchData = async (days: number): Promise<void> => {
    try {
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart`,
        {
          params: {
            vs_currency: "usd",
            days: days,
          },
        }
      )
      const prices = response.data.prices
      const totalPoints = DENSITY_LEVELS[density]

      const sampledPrices = prices.filter(
        (_: any, index: number) =>
          index % Math.ceil(prices.length / totalPoints) === 0
      )

      const labels = sampledPrices.map((price: [number, number]) => {
        const date = new Date(price[0])
        if (selectedRange === "day") {
          return date.toLocaleTimeString("ar-EG", {
            hour: "2-digit",
            minute: "2-digit",
          })
        } else if (selectedRange === "week") {
          return date.toLocaleDateString("ar-EG", {
            day: "2-digit",
            month: "2-digit",
          })
        } else if (selectedRange === "month") {
          return date.toLocaleDateString("ar-EG", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
        } else {
          return date.toLocaleDateString("ar-EG", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
        }
      })

      const dataPoints = sampledPrices.map(
        (price: [number, number]) => price[1]
      )

      setData({
        labels,
        datasets: [
          {
            label:
              lang === "en"
                ? "Bitcoin Price (in USD)"
                : "سعر البيتكوين (بالدولار)",
            data: dataPoints,
            borderColor: "rgba(75, 192, 192, 1)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            fill: true,
            tension: 0.3,
          },
        ],
      })
    } catch (error) {
      console.error("Error fetching data:", error)
    }
  }

  useEffect(() => {
    fetchData(timeRanges[selectedRange].days)
  }, [selectedRange, density])

  const options: ChartOptions<"line"> = {
    responsive: true,
    animation: {
      duration: 2000,
      easing: "easeInOutBounce",
    },
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: `${t("bitcoin_price_history")} (${
          timeRanges[selectedRange].label
        })`,
      },
    },
  }

  return (
    <section id="bitcoin-history-section" className="mt-12">
      <div className="flex max-lg:flex-col-reverse items-stretch">
        <motion.div
          className="grid items-center gap-4 w-full"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex flex-col items-start gap-4">
            <SectionTitle title={t("bitcoin_history_title")} />
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1.2 }}
              className="md:text-lg text-muted-foreground"
            >
              {t("bitcoin_history_description")}
            </motion.p>
            <div className="flex gap-2">
              {Object.keys(timeRanges).map((range) => (
                <Button
                  key={range}
                  onClick={() =>
                    setSelectedRange(range as keyof typeof timeRanges)
                  }
                  variant={selectedRange === range ? "default" : "outline"}
                  className={`px-4 py-2 rounded-lg ${
                    selectedRange === range ? "" : ""
                  }`}
                >
                  {t(`time_ranges.${range}`)}
                </Button>
              ))}
            </div>
            <div className="flex gap-2 mt-2">
              {Object.keys(DENSITY_LEVELS).map((level) => (
                <Button
                  key={level}
                  onClick={() =>
                    setDensity(level as keyof typeof DENSITY_LEVELS)
                  }
                  variant={density === level ? "default" : "outline"}
                >
                  {t(`density_levels.${level}`)}
                </Button>
              ))}
            </div>
          </div>
        </motion.div>
        <motion.div
          className="w-full aspect-video relative"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        >
          <BitcoinChart data={data} options={options} />
        </motion.div>
      </div>
    </section>
  )
}
