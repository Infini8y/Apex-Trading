import { useEffect, useState } from 'react'
import { ordersAPI } from '@/lib/api'
import { useTradingStore } from '@/lib/store/tradingStore'
import { X } from 'lucide-react'

export function OrdersList() {
  const [orders, setOrders] = useState<any[]>([])
  const updateOrders = useTradingStore((state) => state.updateOrders)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await ordersAPI.getOrders()
        setOrders(response.data)
        updateOrders(response.data)
      } catch (error) {
        console.error('Error fetching orders:', error)
      }
    }

    fetchOrders()
    const interval = setInterval(fetchOrders, 5000)

    return () => clearInterval(interval)
  }, [])

  const handleCancel = async (orderId: string) => {
    try {
      await ordersAPI.cancelOrder(orderId)
      setOrders(orders.filter((o) => o.id !== orderId))
    } catch (error) {
      console.error('Error canceling order:', error)
    }
  }

  return (
    <div className="workspace-panel bg-slate-900">
      <div className="p-2 border-b border-slate-800">
        <h3 className="font-semibold text-sm text-slate-300">Orders</h3>
      </div>

      <div className="overflow-y-auto scrollbar-thin max-h-full">
        <table className="w-full text-xs">
          <thead className="sticky top-0 bg-slate-800">
            <tr>
              <th className="text-left px-2 py-1 text-slate-400 font-semibold">Symbol</th>
              <th className="text-left px-2 py-1 text-slate-400 font-semibold">Side</th>
              <th className="text-right px-2 py-1 text-slate-400 font-semibold">Qty</th>
              <th className="text-right px-2 py-1 text-slate-400 font-semibold">Price</th>
              <th className="text-left px-2 py-1 text-slate-400 font-semibold">Status</th>
              <th className="text-center px-2 py-1 text-slate-400 font-semibold"></th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-4 text-slate-500">
                  No orders
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                  <td className="px-2 py-1.5 text-white font-semibold">{order.symbol}</td>
                  <td className={`px-2 py-1.5 font-semibold ${
                    order.side === 'buy' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {order.side.toUpperCase()}
                  </td>
                  <td className="text-right px-2 py-1.5 text-slate-300">{order.qty}</td>
                  <td className="text-right px-2 py-1.5 text-slate-300 font-mono">
                    ${order.limit_price?.toFixed(2) || 'MKT'}
                  </td>
                  <td className="px-2 py-1.5">
                    <span className={`px-1.5 py-0.5 rounded text-xs ${
                      order.status === 'filled' ? 'bg-green-900/30 text-green-400' :
                      order.status === 'canceled' ? 'bg-slate-700 text-slate-400' :
                      'bg-blue-900/30 text-blue-400'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="text-center px-2 py-1.5">
                    {order.status === 'pending' && (
                      <button
                        onClick={() => handleCancel(order.id)}
                        className="text-slate-400 hover:text-red-400 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
