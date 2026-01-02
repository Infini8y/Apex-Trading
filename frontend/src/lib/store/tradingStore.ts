import { create } from 'zustand'

interface TradingState {
  selectedSymbol: string
  watchlist: string[]
  positions: any[]
  orders: any[]
  setSelectedSymbol: (symbol: string) => void
  addToWatchlist: (symbol: string) => void
  removeFromWatchlist: (symbol: string) => void
  updatePositions: (positions: any[]) => void
  updateOrders: (orders: any[]) => void
}

export const useTradingStore = create<TradingState>((set) => ({
  selectedSymbol: 'AAPL',
  watchlist: ['AAPL', 'MSFT', 'GOOGL', 'TSLA', 'AMZN'],
  positions: [],
  orders: [],
  setSelectedSymbol: (symbol) => set({ selectedSymbol: symbol }),
  addToWatchlist: (symbol) =>
    set((state) => ({ watchlist: [...state.watchlist, symbol] })),
  removeFromWatchlist: (symbol) =>
    set((state) => ({ watchlist: state.watchlist.filter((s) => s !== symbol) })),
  updatePositions: (positions) => set({ positions }),
  updateOrders: (orders) => set({ orders }),
}))
