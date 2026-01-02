import { useState } from 'react'
import { ChartContainer } from '@/components/ChartContainer'
import { useTradingStore } from '@/lib/store/tradingStore'
import { LayoutGrid, Plus } from 'lucide-react'

export function Charts() {
  const selectedSymbol = useTradingStore((state) => state.selectedSymbol)
  const setSelectedSymbol = useTradingStore((state) => state.setSelectedSymbol)
  const [charts, setCharts] = useState([
    { id: 1, symbol: 'AAPL' },
    { id: 2, symbol: 'MSFT' },
    { id: 3, symbol: 'GOOGL' },
    { id: 4, symbol: 'TSLA' },
  ])

  return (
    <div className="h-screen flex flex-col bg-slate-950">
      <header className="h-14 bg-slate-900 border-b border-slate-800 flex items-center px-4 justify-between">
        <h1 className="text-xl font-bold text-white">Advanced Charting</h1>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded flex items-center gap-2 transition-colors">
            <LayoutGrid size={16} />
            Layout
          </button>
          <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded flex items-center gap-2 transition-colors">
            <Plus size={16} />
            Add Chart
          </button>
        </div>
      </header>

      <div className="flex-1 p-2 grid grid-cols-2 grid-rows-2 gap-2">
        {charts.map((chart) => (
          <div key={chart.id} className="workspace-panel bg-slate-900">
            <div className="h-full flex flex-col">
              <div className="p-2 border-b border-slate-800 flex items-center justify-between">
                <input
                  type="text"
                  value={chart.symbol}
                  onChange={(e) => {
                    const newCharts = charts.map((c) =>
                      c.id === chart.id ? { ...c, symbol: e.target.value.toUpperCase() } : c
                    )
                    setCharts(newCharts)
                  }}
                  className="bg-transparent text-white font-semibold text-sm focus:outline-none"
                />
              </div>
              <div className="flex-1">
                <ChartContainer symbol={chart.symbol} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
