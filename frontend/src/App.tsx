import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MainLayout } from './pages/MainLayout'
import { TradingDashboard } from './pages/TradingDashboard'
import { Charts } from './pages/Charts'
import { Options } from './pages/Options'
import { Portfolio } from './pages/Portfolio'
import { Strategies } from './pages/Strategies'
import { Scanners } from './pages/Scanners'
import { Settings } from './pages/Settings'
import { Login } from './pages/Login'
import { useAuthStore } from './lib/store/authStore'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5000,
    },
  },
})

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore()
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <MainLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<TradingDashboard />} />
            <Route path="charts" element={<Charts />} />
            <Route path="options" element={<Options />} />
            <Route path="portfolio" element={<Portfolio />} />
            <Route path="strategies" element={<Strategies />} />
            <Route path="scanners" element={<Scanners />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
