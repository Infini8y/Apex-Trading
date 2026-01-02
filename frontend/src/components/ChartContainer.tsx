import { useEffect, useRef, useState } from 'react'
import { createChart, IChartApi, ISeriesApi, CandlestickData } from 'lightweight-charts'
import { marketDataAPI } from '@/lib/api'
import { Loader2 } from 'lucide-react'

interface ChartContainerProps {
  symbol: string
}

export function ChartContainer({ symbol }: ChartContainerProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<IChartApi | null>(null)
  const seriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeframe, setTimeframe] = useState('1Min')

  useEffect(() => {
    if (!chartContainerRef.current) return

    chartRef.current = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
      layout: {
        background: { color: '#0f172a' },
        textColor: '#cbd5e1',
      },
      grid: {
        vertLines: { color: '#1e293b' },
        horzLines: { color: '#1e293b' },
      },
      crosshair: {
        mode: 1,
      },
      rightPriceScale: {
        borderColor: '#334155',
      },
      timeScale: {
        borderColor: '#334155',
        timeVisible: true,
        secondsVisible: false,
      },
    })

    seriesRef.current = chartRef.current.addCandlestickSeries({
      upColor: '#22c55e',
      downColor: '#ef4444',
      borderUpColor: '#22c55e',
      borderDownColor: '#ef4444',
      wickUpColor: '#22c55e',
      wickDownColor: '#ef4444',
    })

    const handleResize = () => {
      if (chartRef.current && chartContainerRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight,
        })
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      chartRef.current?.remove()
    }
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const response = await marketDataAPI.getBars(symbol, timeframe)
        const data: CandlestickData[] = response.data.map((bar: any) => ({
          time: new Date(bar.timestamp).getTime() / 1000,
          open: bar.open,
          high: bar.high,
          low: bar.low,
          close: bar.close,
        }))

        seriesRef.current?.setData(data)
        chartRef.current?.timeScale().fitContent()
      } catch (error) {
        console.error('Error fetching chart data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [symbol, timeframe])

  return (
    <div className="relative w-full h-full">
      <div className="absolute top-2 left-2 z-10 flex gap-1">
        {['1Min', '5Min', '15Min', '1H', '1D'].map((tf) => (
          <button
            key={tf}
            onClick={() => setTimeframe(tf)}
            className={`px-3 py-1 text-xs rounded transition-colors ${
              timeframe === tf
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            {tf}
          </button>
        ))}
      </div>

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50">
          <Loader2 className="animate-spin text-blue-500" size={32} />
        </div>
      )}

      <div ref={chartContainerRef} className="w-full h-full" />
    </div>
  )
}
