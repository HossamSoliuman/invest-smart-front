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

import BitcoinChart from "./bitcoin-chart"
import { Card } from "./ui/card"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const DENSITY_LEVELS = {
  medium: 50,
}

const CRYPTOCOMPARE_API_KEY =
  "8bf5f7bcf8fe14a2139e7e3d29aab86822676ce3fac177506f39576a18a2b184"

export default function DashboardHistory() {
  const { t, lang } = useTranslation("common")
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async (): Promise<void> => {
    try {
      setError(null) // Reset error before fetching
      const response = await axios.get(
        `https://min-api.cryptocompare.com/data/v2/histohour`,
        {
          params: {
            fsym: "BTC", // Bitcoin
            tsym: "USD", // US Dollar
            limit: 24, // Last 24 hours
            api_key: CRYPTOCOMPARE_API_KEY,
          },
        }
      )

      const prices = response.data.Data.Data

      const totalPoints = DENSITY_LEVELS.medium
      const sampledPrices = prices.filter(
        (_: any, index: number) =>
          index % Math.ceil(prices.length / totalPoints) === 0
      )

      const labels = sampledPrices.map((price: any) => {
        const date = new Date(price.time * 1000)
        return date.toLocaleTimeString("ar-EG", {
          hour: "2-digit",
          minute: "2-digit",
        })
      })

      const dataPoints = sampledPrices.map((price: any) => price.close)

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
    } catch (error: any) {
      setError(error?.response?.data?.Message || t("fetch_error"))
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

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
        text: t("bitcoin_price_history"),
      },
    },
  }

  return (
    <Card id="bitcoin-history-section" className="p-6 w-full lg:max-w-[560px]">
      <div className="flex flex-col-reverse items-stretch">
        {error ? (
          <motion.div
            className="text-red-600 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            {error}
          </motion.div>
        ) : (
          <motion.div
            className="w-full aspect-video relative"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          >
            <BitcoinChart data={data} options={options} />
          </motion.div>
        )}
      </div>
    </Card>
  )
}
