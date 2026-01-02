import { useState, useEffect } from 'react'
import { scannersAPI } from '@/lib/api'
import { Search, Filter, TrendingUp, TrendingDown, Activity, Star } from 'lucide-react'
import { useTradingStore } from '@/lib/store/tradingStore'

export function Scanners() {
  const [activeTab, setActiveTab] = useState<'custom' | 'movers'>('movers')
  const [gainers, setGainers] = useState<any[]>([])
  const [losers, setLosers] = useState<any[]>([])
  const [mostActive, setMostActive] = useState<any[]>([])
  const [scanResults, setScanResults] = useState<any[]>([])
  const [presets, setPresets] = useState<any[]>([])
  const [selectedPreset, setSelectedPreset] = useState<string>('')
  const { addToWatchlist, setSelectedSymbol } = useTradingStore()

  useEffect(() => {
    const fetchMovers = async () => {
      try {
        const [gainersRes, losersRes, activeRes] = await Promise.all([
          scannersAPI.getGainers(20),
          scannersAPI.getLosers(20),
          scannersAPI.getMostActive(20),
        ])
        setGainers(gainersRes.data)
        setLosers(losersRes.data)
        setMostActive(activeRes.data)
      } catch (error) {
        console.error('Error fetching movers:', error)
      }
    }

    fetchMovers()
    const interval = setInterval(fetchMovers, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const fetchPresets = async () => {
      try {
        const response = await scannersAPI.getPresets()
        setPresets(response.data)
      } catch (error) {
        console.error('Error fetching presets:', error)
      }
    }

    fetchPresets()
  }, [])

  const handleScan = async () => {
    try {
      const filters = [
        { field: 'rsi', operator: '>', value: 60 },
        { field: 'volume', operator: '>', value: 1000000 },
      ]
      const response = await scannersAPI.runScan({
        filters,
        universe: 'SP500',
        limit: 50,
      })
      setScanResults(response.data)
    } catch (error) {
      console.error('Scan error:', error)
    }
  }

  const handleSymbolClick = (symbol: string) => {
    setSelectedSymbol(symbol)
  }

  return (
    <div className="h-screen overflow-auto bg-slate-950 p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Market Scanners</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('movers')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'movers'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            Market Movers
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'custom'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            Custom Scan
          </button>
        </div>
      </div>

      {activeTab === 'movers' ? (
        <div className="grid grid-cols-3 gap-4">
          <div className="workspace-panel bg-slate-900">
            <div className="p-4 border-b border-slate-800 flex items-center gap-2">
              <TrendingUp size={20} className="text-green-400" />
              <h3 className="font-semibold text-white">Top Gainers</h3>
            </div>
            <div className="overflow-y-auto max-h-[calc(100vh-200px)]">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-slate-800">
                  <tr>
                    <th className="text-left px-3 py-2 text-slate-400">Symbol</th>
                    <th className="text-right px-3 py-2 text-slate-400">Price</th>
                    <th className="text-right px-3 py-2 text-slate-400">Change</th>
                    <th className="text-right px-3 py-2 text-slate-400">Volume</th>
                  </tr>
                </thead>
                <tbody>
                  {gainers.map((stock, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-slate-800 hover:bg-slate-800/50 cursor-pointer group"
                      onClick={() => handleSymbolClick(stock.symbol)}
                    >
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white">{stock.symbol}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              addToWatchlist(stock.symbol)
                            }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Star size={14} className="text-yellow-500" />
                          </button>
                        </div>
                      </td>
                      <td className="text-right px-3 py-2 text-slate-300 font-mono">
                        ${stock.price?.toFixed(2)}
                      </td>
                      <td className="text-right px-3 py-2 text-green-400 font-semibold">
                        +{stock.change_percent?.toFixed(2)}%
                      </td>
                      <td className="text-right px-3 py-2 text-slate-400 text-xs">
                        {(stock.volume / 1000000).toFixed(1)}M
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="workspace-panel bg-slate-900">
            <div className="p-4 border-b border-slate-800 flex items-center gap-2">
              <TrendingDown size={20} className="text-red-400" />
              <h3 className="font-semibold text-white">Top Losers</h3>
            </div>
            <div className="overflow-y-auto max-h-[calc(100vh-200px)]">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-slate-800">
                  <tr>
                    <th className="text-left px-3 py-2 text-slate-400">Symbol</th>
                    <th className="text-right px-3 py-2 text-slate-400">Price</th>
                    <th className="text-right px-3 py-2 text-slate-400">Change</th>
                    <th className="text-right px-3 py-2 text-slate-400">Volume</th>
                  </tr>
                </thead>
                <tbody>
                  {losers.map((stock, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-slate-800 hover:bg-slate-800/50 cursor-pointer group"
                      onClick={() => handleSymbolClick(stock.symbol)}
                    >
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white">{stock.symbol}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              addToWatchlist(stock.symbol)
                            }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Star size={14} className="text-yellow-500" />
                          </button>
                        </div>
                      </td>
                      <td className="text-right px-3 py-2 text-slate-300 font-mono">
                        ${stock.price?.toFixed(2)}
                      </td>
                      <td className="text-right px-3 py-2 text-red-400 font-semibold">
                        {stock.change_percent?.toFixed(2)}%
                      </td>
                      <td className="text-right px-3 py-2 text-slate-400 text-xs">
                        {(stock.volume / 1000000).toFixed(1)}M
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="workspace-panel bg-slate-900">
            <div className="p-4 border-b border-slate-800 flex items-center gap-2">
              <Activity size={20} className="text-blue-400" />
              <h3 className="font-semibold text-white">Most Active</h3>
            </div>
            <div className="overflow-y-auto max-h-[calc(100vh-200px)]">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-slate-800">
                  <tr>
                    <th className="text-left px-3 py-2 text-slate-400">Symbol</th>
                    <th className="text-right px-3 py-2 text-slate-400">Price</th>
                    <th className="text-right px-3 py-2 text-slate-400">Change</th>
                    <th className="text-right px-3 py-2 text-slate-400">Volume</th>
                  </tr>
                </thead>
                <tbody>
                  {mostActive.map((stock, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-slate-800 hover:bg-slate-800/50 cursor-pointer group"
                      onClick={() => handleSymbolClick(stock.symbol)}
                    >
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white">{stock.symbol}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              addToWatchlist(stock.symbol)
                            }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Star size={14} className="text-yellow-500" />
                          </button>
                        </div>
                      </td>
                      <td className="text-right px-3 py-2 text-slate-300 font-mono">
                        ${stock.price?.toFixed(2)}
                      </td>
                      <td className={`text-right px-3 py-2 font-semibold ${
                        stock.change_percent >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {stock.change_percent >= 0 ? '+' : ''}{stock.change_percent?.toFixed(2)}%
                      </td>
                      <td className="text-right px-3 py-2 text-blue-400 font-semibold text-xs">
                        {(stock.volume / 1000000).toFixed(1)}M
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-4">
          <div className="workspace-panel bg-slate-900 p-4">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <Filter size={18} />
              Scan Filters
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-2">Preset</label>
                <select
                  value={selectedPreset}
                  onChange={(e) => setSelectedPreset(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Custom</option>
                  {presets.map((preset) => (
                    <option key={preset.id} value={preset.id}>
                      {preset.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2">RSI</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    className="px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    className="px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2">Volume (Min)</label>
                <input
                  type="number"
                  placeholder="1000000"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2">Price Range</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    className="px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    className="px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2">Market Cap</label>
                <select className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Any</option>
                  <option value="mega">Mega (&gt;$200B)</option>
                  <option value="large">Large ($10B-$200B)</option>
                  <option value="mid">Mid ($2B-$10B)</option>
                  <option value="small">Small (&lt;$2B)</option>
                </select>
              </div>

              <button
                onClick={handleScan}
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <Search size={18} />
                Run Scan
              </button>
            </div>
          </div>

          <div className="col-span-3 workspace-panel bg-slate-900">
            <div className="p-4 border-b border-slate-800">
              <h3 className="font-semibold text-white">Scan Results ({scanResults.length})</h3>
            </div>
            <div className="overflow-y-auto max-h-[calc(100vh-200px)]">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-slate-800">
                  <tr>
                    <th className="text-left px-3 py-2 text-slate-400">Symbol</th>
                    <th className="text-right px-3 py-2 text-slate-400">Price</th>
                    <th className="text-right px-3 py-2 text-slate-400">Change %</th>
                    <th className="text-right px-3 py-2 text-slate-400">Volume</th>
                    <th className="text-right px-3 py-2 text-slate-400">RSI</th>
                    <th className="text-right px-3 py-2 text-slate-400">MACD</th>
                    <th className="text-right px-3 py-2 text-slate-400">Signal</th>
                    <th className="text-center px-3 py-2 text-slate-400">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {scanResults.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-8 text-slate-500">
                        Run a scan to see results
                      </td>
                    </tr>
                  ) : (
                    scanResults.map((result, idx) => (
                      <tr
                        key={idx}
                        className="border-b border-slate-800 hover:bg-slate-800/50 cursor-pointer"
                        onClick={() => handleSymbolClick(result.symbol)}
                      >
                        <td className="px-3 py-2 font-semibold text-white">{result.symbol}</td>
                        <td className="text-right px-3 py-2 text-slate-300 font-mono">
                          ${result.price?.toFixed(2)}
                        </td>
                        <td className={`text-right px-3 py-2 font-semibold ${
                          result.change_percent >= 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {result.change_percent >= 0 ? '+' : ''}{result.change_percent?.toFixed(2)}%
                        </td>
                        <td className="text-right px-3 py-2 text-slate-400">
                          {(result.volume / 1000000).toFixed(1)}M
                        </td>
                        <td className="text-right px-3 py-2 text-slate-300">
                          {result.rsi?.toFixed(1)}
                        </td>
                        <td className="text-right px-3 py-2 text-slate-300">
                          {result.macd?.toFixed(2)}
                        </td>
                        <td className="text-right px-3 py-2">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            result.signal_strength > 70 ? 'bg-green-900/30 text-green-400' :
                            result.signal_strength > 40 ? 'bg-blue-900/30 text-blue-400' :
                            'bg-slate-700 text-slate-400'
                          }`}>
                            {result.signal_strength?.toFixed(0)}
                          </span>
                        </td>
                        <td className="text-center px-3 py-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              addToWatchlist(result.symbol)
                            }}
                            className="text-yellow-500 hover:text-yellow-400"
                          >
                            <Star size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
