import { useState, useEffect } from 'react'
import { marketDataAPI } from '@/lib/api'
import { useTradingStore } from '@/lib/store/tradingStore'
import { OptionsChain } from '@/components/OptionsChain'
import { VolatilitySurface } from '@/components/VolatilitySurface'
import { GreeksChart } from '@/components/GreeksChart'
import { RiskGraph } from '@/components/RiskGraph'
import { TrendingUp, Activity, PieChart, BarChart3 } from 'lucide-react'

export function Options() {
  const selectedSymbol = useTradingStore((state) => state.selectedSymbol)
  const [activeTab, setActiveTab] = useState<'chain' | 'surface' | 'greeks' | 'risk'>('chain')
  const [expirations, setExpirations] = useState<string[]>([])
  const [selectedExpiration, setSelectedExpiration] = useState('')

  useEffect(() => {
    const mockExpirations = [
      '2026-01-09',
      '2026-01-16',
      '2026-01-23',
      '2026-02-20',
      '2026-03-20',
      '2026-06-19',
    ]
    setExpirations(mockExpirations)
    setSelectedExpiration(mockExpirations[0])
  }, [selectedSymbol])

  const tabs = [
    { id: 'chain', label: 'Options Chain', icon: TrendingUp },
    { id: 'surface', label: 'Vol Surface', icon: Activity },
    { id: 'greeks', label: 'Greeks', icon: PieChart },
    { id: 'risk', label: 'Risk Graph', icon: BarChart3 },
  ]

  return (
    <div className="h-screen flex flex-col bg-slate-950">
      <header className="h-14 bg-slate-900 border-b border-slate-800 flex items-center px-4 justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-white">Options Analytics</h1>
          <span className="text-slate-400">•</span>
          <span className="text-lg font-semibold text-blue-400">{selectedSymbol}</span>
        </div>
        
        <div className="flex items-center gap-4">
          <select
            value={selectedExpiration}
            onChange={(e) => setSelectedExpiration(e.target.value)}
            className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {expirations.map((exp) => (
              <option key={exp} value={exp}>
                {new Date(exp).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}
              </option>
            ))}
          </select>
        </div>
      </header>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="border-b border-slate-800 bg-slate-900">
          <div className="flex gap-1 px-4 pt-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-t-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-slate-950 text-white border-t border-l border-r border-slate-800'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4">
          {activeTab === 'chain' && (
            <OptionsChain symbol={selectedSymbol} expiration={selectedExpiration} />
          )}
          {activeTab === 'surface' && (
            <VolatilitySurface symbol={selectedSymbol} />
          )}
          {activeTab === 'greeks' && (
            <GreeksChart symbol={selectedSymbol} expiration={selectedExpiration} />
          )}
          {activeTab === 'risk' && (
            <RiskGraph symbol={selectedSymbol} />
          )}
        </div>
      </div>
    </div>
  )
}
