import { useState, useEffect } from 'react'
import { strategiesAPI } from '@/lib/api'
import { Play, Pause, Plus, TrendingUp } from 'lucide-react'
import { StrategyBuilder } from '@/components/StrategyBuilder'
import { BacktestResults } from '@/components/BacktestResults'

export function Strategies() {
  const [strategies, setStrategies] = useState<any[]>([])
  const [selectedStrategy, setSelectedStrategy] = useState<any>(null)
  const [showBuilder, setShowBuilder] = useState(false)
  const [backtestResult, setBacktestResult] = useState<any>(null)

  useEffect(() => {
    const fetchStrategies = async () => {
      try {
        const response = await strategiesAPI.getStrategies()
        setStrategies(response.data)
      } catch (error) {
        console.error('Error fetching strategies:', error)
      }
    }

    fetchStrategies()
  }, [])

  const handleBacktest = async (strategy: any) => {
    try {
      const result = await strategiesAPI.runBacktest(strategy.id, {
        symbols: ['AAPL', 'MSFT'],
        start_date: new Date('2025-01-01'),
        end_date: new Date('2026-01-01'),
        initial_capital: 100000,
        commission: 0.001,
      })
      setBacktestResult(result.data)
    } catch (error) {
      console.error('Backtest error:', error)
    }
  }

  const handleDeploy = async (strategy: any) => {
    try {
      await strategiesAPI.deployStrategy(strategy.id, ['AAPL', 'MSFT', 'GOOGL'])
      alert(`Strategy "${strategy.name}" deployed successfully!`)
    } catch (error) {
      console.error('Deploy error:', error)
    }
  }

  return (
    <div className="h-screen overflow-auto bg-slate-950 p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Strategy Automation</h1>
        <button
          onClick={() => setShowBuilder(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          New Strategy
        </button>
      </div>

      {showBuilder ? (
        <StrategyBuilder onClose={() => setShowBuilder(false)} onSave={() => setShowBuilder(false)} />
      ) : (
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-1 space-y-4">
            {strategies.map((strategy) => (
              <div
                key={strategy.id}
                className={`workspace-panel bg-slate-900 p-4 cursor-pointer transition-colors ${
                  selectedStrategy?.id === strategy.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedStrategy(strategy)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-white">{strategy.name}</h3>
                    <p className="text-xs text-slate-400 mt-1">{strategy.description}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    strategy.status === 'deployed' ? 'bg-green-900/30 text-green-400' :
                    'bg-slate-700 text-slate-300'
                  }`}>
                    {strategy.status}
                  </span>
                </div>

                <div className="flex gap-2 mt-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleBacktest(strategy)
                    }}
                    className="flex-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs transition-colors flex items-center justify-center gap-1"
                  >
                    <TrendingUp size={14} />
                    Backtest
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeploy(strategy)
                    }}
                    className="flex-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs transition-colors flex items-center justify-center gap-1"
                  >
                    {strategy.status === 'deployed' ? <Pause size={14} /> : <Play size={14} />}
                    {strategy.status === 'deployed' ? 'Stop' : 'Deploy'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="col-span-2">
            {backtestResult ? (
              <BacktestResults result={backtestResult} />
            ) : selectedStrategy ? (
              <div className="workspace-panel bg-slate-900 p-6">
                <h2 className="text-xl font-bold text-white mb-4">{selectedStrategy.name}</h2>
                <p className="text-slate-400 mb-6">{selectedStrategy.description}</p>
                
                <div className="bg-slate-950 rounded-lg p-4 font-mono text-sm text-slate-300">
                  <pre className="overflow-x-auto">{selectedStrategy.code}</pre>
                </div>
              </div>
            ) : (
              <div className="workspace-panel bg-slate-900 p-6 flex items-center justify-center h-full">
                <div className="text-center text-slate-400">
                  <TrendingUp size={48} className="mx-auto mb-4 opacity-50" />
                  <p>Select a strategy to view details</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
