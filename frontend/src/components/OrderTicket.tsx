import { useState } from 'react'
import { ordersAPI } from '@/lib/api'
import { useTradingStore } from '@/lib/store/tradingStore'
import { TrendingUp, TrendingDown } from 'lucide-react'

export function OrderTicket() {
  const selectedSymbol = useTradingStore((state) => state.selectedSymbol)
  const [side, setSide] = useState<'buy' | 'sell'>('buy')
  const [orderType, setOrderType] = useState('limit')
  const [qty, setQty] = useState('100')
  const [price, setPrice] = useState('175.00')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await ordersAPI.placeOrder({
        symbol: selectedSymbol,
        qty: parseFloat(qty),
        side,
        type: orderType,
        limit_price: orderType === 'limit' ? parseFloat(price) : undefined,
        time_in_force: 'day',
      })
      alert('Order placed successfully!')
    } catch (error) {
      console.error('Order failed:', error)
      alert('Order failed!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="workspace-panel bg-slate-900 order-ticket">
      <div className="p-3 border-b border-slate-800">
        <h3 className="font-semibold text-sm text-slate-300">Order Ticket</h3>
      </div>

      <form onSubmit={handleSubmit} className="p-3 space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setSide('buy')}
            className={`py-2 rounded font-semibold text-sm transition-colors flex items-center justify-center gap-1 ${
              side === 'buy'
                ? 'bg-green-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            <TrendingUp size={16} />
            Buy
          </button>
          <button
            type="button"
            onClick={() => setSide('sell')}
            className={`py-2 rounded font-semibold text-sm transition-colors flex items-center justify-center gap-1 ${
              side === 'sell'
                ? 'bg-red-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            <TrendingDown size={16} />
            Sell
          </button>
        </div>

        <div>
          <label className="block text-xs text-slate-400 mb-1">Type</label>
          <select
            value={orderType}
            onChange={(e) => setOrderType(e.target.value)}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="market">Market</option>
            <option value="limit">Limit</option>
            <option value="stop">Stop</option>
            <option value="stop_limit">Stop Limit</option>
          </select>
        </div>

        <div>
          <label className="block text-xs text-slate-400 mb-1">Quantity</label>
          <input
            type="number"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-sm text-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="1"
          />
        </div>

        {orderType !== 'market' && (
          <div>
            <label className="block text-xs text-slate-400 mb-1">Limit Price</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-sm text-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
              step="0.01"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded font-semibold text-sm transition-colors ${
            side === 'buy'
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : 'bg-red-600 hover:bg-red-700 text-white'
          } disabled:opacity-50`}
        >
          {loading ? 'Placing...' : `Place ${side.toUpperCase()} Order`}
        </button>
      </form>
    </div>
  )
}
