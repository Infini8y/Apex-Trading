import { useState, useEffect } from 'react'
import { marketDataAPI } from '@/lib/api'
import { ArrowUp, ArrowDown } from 'lucide-react'

interface OptionsChainProps {
  symbol: string
  expiration: string
}

interface OptionContract {
  strike: number
  call_bid: number
  call_ask: number
  call_last: number
  call_volume: number
  call_oi: number
  call_iv: number
  call_delta: number
  put_bid: number
  put_ask: number
  put_last: number
  put_volume: number
  put_oi: number
  put_iv: number
  put_delta: number
}

export function OptionsChain({ symbol, expiration }: OptionsChainProps) {
  const [contracts, setContracts] = useState<OptionContract[]>([])
  const [spotPrice, setSpotPrice] = useState(175.0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchChain = async () => {
      setLoading(true)
      try {
        const mockContracts: OptionContract[] = []
        for (let i = -10; i <= 10; i++) {
          const strike = spotPrice + i * 5
          mockContracts.push({
            strike,
            call_bid: Math.max(0.05, spotPrice - strike + Math.random() * 2),
            call_ask: Math.max(0.1, spotPrice - strike + Math.random() * 2 + 0.1),
            call_last: Math.max(0.08, spotPrice - strike + Math.random() * 2),
            call_volume: Math.floor(Math.random() * 1000),
            call_oi: Math.floor(Math.random() * 5000),
            call_iv: 0.2 + Math.random() * 0.3,
            call_delta: strike < spotPrice ? 0.5 + Math.random() * 0.4 : 0.1 + Math.random() * 0.4,
            put_bid: Math.max(0.05, strike - spotPrice + Math.random() * 2),
            put_ask: Math.max(0.1, strike - spotPrice + Math.random() * 2 + 0.1),
            put_last: Math.max(0.08, strike - spotPrice + Math.random() * 2),
            put_volume: Math.floor(Math.random() * 1000),
            put_oi: Math.floor(Math.random() * 5000),
            put_iv: 0.2 + Math.random() * 0.3,
            put_delta: strike > spotPrice ? -0.5 - Math.random() * 0.4 : -0.1 - Math.random() * 0.4,
          })
        }
        setContracts(mockContracts)
      } catch (error) {
        console.error('Error fetching options chain:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchChain()
  }, [symbol, expiration, spotPrice])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-slate-400">Loading options chain...</div>
      </div>
    )
  }

  return (
    <div className="workspace-panel bg-slate-900">
      <div className="overflow-x-auto">
        <table className="w-full text-xs font-mono">
          <thead className="sticky top-0 bg-slate-800 z-10">
            <tr>
              <th colSpan={7} className="text-center py-2 text-green-400 font-semibold border-r border-slate-700">
                CALLS
              </th>
              <th className="text-center py-2 text-white font-semibold border-r border-slate-700">
                STRIKE
              </th>
              <th colSpan={7} className="text-center py-2 text-red-400 font-semibold">
                PUTS
              </th>
            </tr>
            <tr className="text-slate-400">
              <th className="text-right px-2 py-1">Delta</th>
              <th className="text-right px-2 py-1">IV</th>
              <th className="text-right px-2 py-1">Volume</th>
              <th className="text-right px-2 py-1">OI</th>
              <th className="text-right px-2 py-1">Last</th>
              <th className="text-right px-2 py-1">Bid</th>
              <th className="text-right px-2 py-1 border-r border-slate-700">Ask</th>
              <th className="text-center px-2 py-1 border-r border-slate-700">Price</th>
              <th className="text-left px-2 py-1">Bid</th>
              <th className="text-left px-2 py-1">Ask</th>
              <th className="text-left px-2 py-1">Last</th>
              <th className="text-left px-2 py-1">OI</th>
              <th className="text-left px-2 py-1">Volume</th>
              <th className="text-left px-2 py-1">IV</th>
              <th className="text-left px-2 py-1">Delta</th>
            </tr>
          </thead>
          <tbody>
            {contracts.map((contract, idx) => {
              const isATM = Math.abs(contract.strike - spotPrice) < 2.5
              const isITMCall = contract.strike < spotPrice
              const isITMPut = contract.strike > spotPrice

              return (
                <tr
                  key={idx}
                  className={`border-b border-slate-800/50 hover:bg-slate-800/30 ${
                    isATM ? 'bg-blue-900/10' : ''
                  }`}
                >
                  <td className={`text-right px-2 py-1.5 ${isITMCall ? 'text-green-300' : 'text-slate-500'}`}>
                    {contract.call_delta.toFixed(3)}
                  </td>
                  <td className="text-right px-2 py-1.5 text-slate-300">
                    {(contract.call_iv * 100).toFixed(1)}%
                  </td>
                  <td className="text-right px-2 py-1.5 text-slate-300">
                    {contract.call_volume.toLocaleString()}
                  </td>
                  <td className="text-right px-2 py-1.5 text-slate-400">
                    {contract.call_oi.toLocaleString()}
                  </td>
                  <td className="text-right px-2 py-1.5 text-white font-semibold">
                    ${contract.call_last.toFixed(2)}
                  </td>
                  <td className="text-right px-2 py-1.5 text-green-400">
                    ${contract.call_bid.toFixed(2)}
                  </td>
                  <td className="text-right px-2 py-1.5 text-red-400 border-r border-slate-700">
                    ${contract.call_ask.toFixed(2)}
                  </td>
                  
                  <td className="text-center px-3 py-1.5 font-bold text-white border-r border-slate-700">
                    {contract.strike.toFixed(0)}
                    {isATM && <ArrowUp size={12} className="inline ml-1 text-blue-400" />}
                  </td>
                  
                  <td className="text-left px-2 py-1.5 text-green-400">
                    ${contract.put_bid.toFixed(2)}
                  </td>
                  <td className="text-left px-2 py-1.5 text-red-400">
                    ${contract.put_ask.toFixed(2)}
                  </td>
                  <td className="text-left px-2 py-1.5 text-white font-semibold">
                    ${contract.put_last.toFixed(2)}
                  </td>
                  <td className="text-left px-2 py-1.5 text-slate-400">
                    {contract.put_oi.toLocaleString()}
                  </td>
                  <td className="text-left px-2 py-1.5 text-slate-300">
                    {contract.put_volume.toLocaleString()}
                  </td>
                  <td className="text-left px-2 py-1.5 text-slate-300">
                    {(contract.put_iv * 100).toFixed(1)}%
                  </td>
                  <td className={`text-left px-2 py-1.5 ${isITMPut ? 'text-red-300' : 'text-slate-500'}`}>
                    {contract.put_delta.toFixed(3)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
