import { ChartOptions } from "chart.js"
import { Line } from "react-chartjs-2"

interface BitcoinChartProps {
  data: any
  options: ChartOptions<"line">
}

export default function BitcoinChart({ data, options }: BitcoinChartProps) {
  return (
    <div className="w-full aspect-video relative">
      {data ? (
        <Line className="max-w-full" data={data} options={options} />
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  )
}
