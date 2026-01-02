import { useState } from 'react'
import { Bell, Palette, Key, Shield, Database, Zap } from 'lucide-react'

export function Settings() {
  const [activeSection, setActiveSection] = useState('general')

  const sections = [
    { id: 'general', label: 'General', icon: Zap },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'api', label: 'API Keys', icon: Key },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'data', label: 'Data Sources', icon: Database },
  ]

  return (
    <div className="h-screen overflow-auto bg-slate-950 p-6">
      <h1 className="text-2xl font-bold text-white mb-6">Settings</h1>

      <div className="grid grid-cols-4 gap-6">
        <div className="col-span-1 space-y-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full px-4 py-3 rounded-lg text-left transition-colors flex items-center gap-3 ${
                activeSection === section.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <section.icon size={20} />
              <span className="font-medium">{section.label}</span>
            </button>
          ))}
        </div>

        <div className="col-span-3 workspace-panel bg-slate-900 p-6">
          {activeSection === 'general' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white mb-4">General Settings</h2>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Default Symbol
                </label>
                <input
                  type="text"
                  defaultValue="AAPL"
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Default Order Type
                </label>
                <select className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="market">Market</option>
                  <option value="limit">Limit</option>
                  <option value="stop">Stop</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Default Quantity
                </label>
                <input
                  type="number"
                  defaultValue="100"
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="confirmOrders"
                  defaultChecked
                  className="w-4 h-4 bg-slate-800 border-slate-700 rounded"
                />
                <label htmlFor="confirmOrders" className="text-sm text-slate-300">
                  Confirm orders before placement
                </label>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="enableHotkeys"
                  defaultChecked
                  className="w-4 h-4 bg-slate-800 border-slate-700 rounded"
                />
                <label htmlFor="enableHotkeys" className="text-sm text-slate-300">
                  Enable trading hotkeys
                </label>
              </div>
            </div>
          )}

          {activeSection === 'appearance' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white mb-4">Appearance</h2>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Theme</label>
                <div className="grid grid-cols-3 gap-3">
                  <button className="p-4 bg-slate-950 border-2 border-blue-500 rounded-lg text-white">
                    Dark
                  </button>
                  <button className="p-4 bg-white border-2 border-slate-700 rounded-lg text-slate-900">
                    Light
                  </button>
                  <button className="p-4 bg-gradient-to-br from-slate-900 to-blue-900 border-2 border-slate-700 rounded-lg text-white">
                    Professional
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Chart Color Scheme
                </label>
                <select className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="default">Default (Green/Red)</option>
                  <option value="traditional">Traditional (White/Black)</option>
                  <option value="colorblind">Colorblind Friendly</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Font Size
                </label>
                <input
                  type="range"
                  min="12"
                  max="18"
                  defaultValue="14"
                  className="w-full"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="animations"
                  defaultChecked
                  className="w-4 h-4 bg-slate-800 border-slate-700 rounded"
                />
                <label htmlFor="animations" className="text-sm text-slate-300">
                  Enable animations
                </label>
              </div>
            </div>
          )}

          {activeSection === 'notifications' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white mb-4">Notifications</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-800 rounded-lg">
                  <div>
                    <h3 className="text-white font-medium">Order Fills</h3>
                    <p className="text-sm text-slate-400">Get notified when orders are filled</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-800 rounded-lg">
                  <div>
                    <h3 className="text-white font-medium">Price Alerts</h3>
                    <p className="text-sm text-slate-400">Receive alerts for price movements</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-800 rounded-lg">
                  <div>
                    <h3 className="text-white font-medium">AI Signals</h3>
                    <p className="text-sm text-slate-400">Notifications for AI-generated signals</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-800 rounded-lg">
                  <div>
                    <h3 className="text-white font-medium">Risk Alerts</h3>
                    <p className="text-sm text-slate-400">Warnings for risk threshold breaches</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-800 rounded-lg">
                  <div>
                    <h3 className="text-white font-medium">News Updates</h3>
                    <p className="text-sm text-slate-400">Breaking news for watchlist symbols</p>
                  </div>
                  <input type="checkbox" className="w-4 h-4" />
                </div>
              </div>
            </div>
          )}

          {activeSection === 'api' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white mb-4">API Keys</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Polygon.io API Key
                  </label>
                  <input
                    type="password"
                    placeholder="Enter your Polygon API key"
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-slate-500 mt-1">Used for real-time market data</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Alpaca API Key
                  </label>
                  <input
                    type="password"
                    placeholder="Enter your Alpaca API key"
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Alpaca Secret Key
                  </label>
                  <input
                    type="password"
                    placeholder="Enter your Alpaca secret key"
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-slate-500 mt-1">Used for order execution</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Interactive Brokers
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <input
                      type="text"
                      placeholder="Host"
                      defaultValue="127.0.0.1"
                      className="px-4 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="number"
                      placeholder="Port"
                      defaultValue="7497"
                      className="px-4 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="number"
                      placeholder="Client ID"
                      defaultValue="1"
                      className="px-4 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold transition-colors">
                  Save API Keys
                </button>
              </div>
            </div>
          )}

          {activeSection === 'security' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white mb-4">Security</h2>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Change Password
                </label>
                <input
                  type="password"
                  placeholder="Current password"
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
                />
                <input
                  type="password"
                  placeholder="New password"
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
                />
                <input
                  type="password"
                  placeholder="Confirm new password"
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="twoFactor"
                  className="w-4 h-4 bg-slate-800 border-slate-700 rounded"
                />
                <label htmlFor="twoFactor" className="text-sm text-slate-300">
                  Enable two-factor authentication
                </label>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="biometric"
                  className="w-4 h-4 bg-slate-800 border-slate-700 rounded"
                />
                <label htmlFor="biometric" className="text-sm text-slate-300">
                  Enable biometric login
                </label>
              </div>

              <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold transition-colors">
                Update Security Settings
              </button>
            </div>
          )}

          {activeSection === 'data' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white mb-4">Data Sources</h2>
              
              <div className="space-y-4">
                <div className="p-4 bg-slate-800 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-white font-medium">Polygon.io</h3>
                    <span className="px-2 py-1 bg-green-900/30 text-green-400 rounded text-xs font-semibold">
                      Connected
                    </span>
                  </div>
                  <p className="text-sm text-slate-400">Real-time and historical market data</p>
                </div>

                <div className="p-4 bg-slate-800 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-white font-medium">Alpaca</h3>
                    <span className="px-2 py-1 bg-green-900/30 text-green-400 rounded text-xs font-semibold">
                      Connected
                    </span>
                  </div>
                  <p className="text-sm text-slate-400">Stock and crypto trading data</p>
                </div>

                <div className="p-4 bg-slate-800 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-white font-medium">Interactive Brokers</h3>
                    <span className="px-2 py-1 bg-slate-700 text-slate-400 rounded text-xs font-semibold">
                      Disconnected
                    </span>
                  </div>
                  <p className="text-sm text-slate-400">Multi-asset trading and data</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Data Refresh Rate
                  </label>
                  <select className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="100">100ms (Real-time)</option>
                    <option value="500">500ms</option>
                    <option value="1000">1 second</option>
                    <option value="5000">5 seconds</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Historical Data Cache
                  </label>
                  <select className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="1">1 day</option>
                    <option value="7">7 days</option>
                    <option value="30">30 days</option>
                    <option value="90">90 days</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
