import { useTradingStore } from '@/lib/store/tradingStore'
import { Star, X } from 'lucide-react'

export function Watchlist() {
  const { watchlist, selectedSymbol, setSelectedSymbol, removeFromWatchlist } = useTradingStore()

  return (
    <div className="workspace-panel bg-slate-900">
      <div className="p-2 border-b border-slate-800">
        <h3 className="font-semibold text-sm text-slate-300">Watchlist</h3>
      </div>

      <div className="p-2 space-y-1">
        {watchlist.map((symbol) => (
          <div
            key={symbol}
            className={`flex items-center justify-between px-2 py-1.5 rounded cursor-pointer transition-colors ${
              selectedSymbol === symbol
                ? 'bg-blue-600 text-white'
                : 'hover:bg-slate-800 text-slate-300'
            }`}
            onClick={() => setSelectedSymbol(symbol)}
          >
            <div className="flex items-center gap-2">
              <Star size={14} className="text-yellow-500" fill="currentColor" />
              <span className="font-semibold text-sm">{symbol}</span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                removeFromWatchlist(symbol)
              }}
              className="opacity-0 group-hover:opacity-100 hover:text-red-400 transition-opacity"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
