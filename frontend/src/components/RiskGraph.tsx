import { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts'

interface RiskGraphProps {
  symbol: string
}

export function RiskGraph({ symbol }: RiskGraphProps) {
  const [data, setData] = useState<any[]>([])
  const [spotPrice] = useState(175)

  useEffect(() => {
    const mockData = []
    for (let price = 150; price <= 200; price += 2) {
      const longCall = Math.max(0, price - 180) - 5
      const shortPut = price > 170 ? 3 : -(170 - price) + 3
      const pnl = longCall + shortPut

      mockData.push({
        price,
        pnl,
        longCall,
        shortPut,
      })
    }
    setData(mockData)
  }, [symbol])

  return (
    <div className="workspace-panel bg-slate-900 h-[calc(100vh-200px)]">
      <div className="p-3 border-b border-slate-800">
        <h3 className="font-semibold text-slate-300">Risk / Reward Graph</h3>
        <p className="text-xs text-slate-500 mt-1">P&L across underlying price range at expiration</p>
      </div>
      <div className="p-4 h-[calc(100%-60px)]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="price" stroke="#94a3b8" label={{ value: 'Underlying Price', position: 'insideBottom', offset: -5 }} />
            <YAxis stroke="#94a3b8" label={{ value: 'P&L', angle: -90, position: 'insideLeft' }} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
              labelStyle={{ color: '#cbd5e1' }}
            />
            <Legend />
            <ReferenceLine y={0} stroke="#64748b" strokeDasharray="3 3" />
            <ReferenceLine x={spotPrice} stroke="#3b82f6" strokeDasharray="3 3" label="Current" />
            <Line type="monotone" dataKey="pnl" stroke="#8b5cf6" strokeWidth={3} name="Total P&L" dot={false} />
            <Line type="monotone" dataKey="longCall" stroke="#22c55e" strokeWidth={1.5} name="Long Call" dot={false} />
            <Line type="monotone" dataKey="shortPut" stroke="#ef4444" strokeWidth={1.5} name="Short Put" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
