"use client"

import { useEffect } from "react"

export default function TradingViewMiniWidget() {
  useEffect(() => {
    const container = document.querySelector(
      ".tradingview-widget-container__widget"
    ) as HTMLElement

    if (container) {
      container.style.backgroundColor = "transparent"

      const script = document.createElement("script")
      script.src =
        "https://s3.tradingview.com/external-embedding/embed-widget-symbol-info.js"
      script.async = true
      script.innerHTML = JSON.stringify({
        symbol: "MARKETSCOM:BITCOIN",
        locale: "en",
        colorTheme: "light",
        isTransparent: true,
        width: "100%",
        height: "60",
        autosize: true,
        showMarketCap: false,
        show24hVolume: false,
        showCirculatingSupply: false,
        showMaxSupply: false,
        showSymbolLogo: false,
      })
      container.appendChild(script)
    }

    return () => {
      if (container) {
        container.innerHTML = ""
      }
    }
  }, [])

  return (
    <div className="tradingview-widget-container">
      <div className="tradingview-widget-container__widget"></div>
    </div>
  )
}
