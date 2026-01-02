import { useEffect, useState } from 'react'
import { marketDataAPI } from '@/lib/api'
import { ArrowUp, ArrowDown } from 'lucide-react'

interface DOMLadderProps {
  symbol: string
}

interface DOMLevel {
  price: number
  bidSize: number
  askSize: number
}

export function DOMLadder({ symbol }: DOMLadderProps) {
  const [levels, setLevels] = useState<DOMLevel[]>([])
  const [lastPrice, setLastPrice] = useState(175.0)

  useEffect(() => {
    const fetchDepth = async () => {
      try {
        const response = await marketDataAPI.getDepth(symbol)
        const bids = response.data.bids || []
        const asks = response.data.asks || []

        const combined: DOMLevel[] = []
        const maxLevels = Math.max(bids.length, asks.length)

        for (let i = 0; i < Math.min(maxLevels, 20); i++) {
          const price = lastPrice + (10 - i) * 0.1
          combined.push({
            price: parseFloat(price.toFixed(2)),
            bidSize: bids[i]?.size || 0,
            askSize: asks[i]?.size || 0,
          })
        }

        setLevels(combined)
      } catch (error) {
        console.error('Error fetching depth:', error)
      }
    }

    fetchDepth()
    const interval = setInterval(fetchDepth, 1000)

    return () => clearInterval(interval)
  }, [symbol, lastPrice])

  const handleClick = (price: number, side: 'buy' | 'sell') => {
    console.log(`Place ${side} order at ${price}`)
  }

  return (
    <div className="workspace-panel bg-slate-900 h-[60vh] flex flex-col">
      <div className="p-2 border-b border-slate-800 flex items-center justify-between">
        <h3 className="font-semibold text-sm text-slate-300">DOM</h3>
        <span className="text-xs text-slate-500">{symbol}</span>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin dom-ladder">
        <div className="grid grid-cols-[1fr_auto_1fr] gap-0 text-xs">
          <div className="text-right font-semibold text-green-400 px-2 py-1 bg-slate-800/50">
            Bid Size
          </div>
          <div className="font-semibold text-slate-300 px-2 py-1 bg-slate-800/50 text-center">
            Price
          </div>
          <div className="text-left font-semibold text-red-400 px-2 py-1 bg-slate-800/50">
            Ask Size
          </div>

          {levels.map((level, idx) => {
            const isLastPrice = Math.abs(level.price - lastPrice) < 0.05
            return (
              <div
                key={idx}
                className="contents"
                style={{ backgroundColor: isLastPrice ? '#1e40af20' : 'transparent' }}
              >
                <div
                  className="text-right px-2 py-1 hover:bg-green-900/20 cursor-pointer transition-colors"
                  onClick={() => handleClick(level.price, 'buy')}
                >
                  {level.bidSize > 0 && (
                    <span className="text-green-400">{level.bidSize}</span>
                  )}
                </div>
                <div className="px-2 py-1 text-center font-mono font-semibold text-white">
                  {level.price.toFixed(2)}
                  {isLastPrice && <ArrowUp size={12} className="inline ml-1 text-blue-400" />}
                </div>
                <div
                  className="text-left px-2 py-1 hover:bg-red-900/20 cursor-pointer transition-colors"
                  onClick={() => handleClick(level.price, 'sell')}
                >
                  {level.askSize > 0 && (
                    <span className="text-red-400">{level.askSize}</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
