import { Link, useLocation } from 'react-router-dom'
import { Coins, Gift, History } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavigationProps {
  coins: number
}

export default function Navigation({ coins }: NavigationProps) {
  const location = useLocation()

  const navItems = [
    { path: '/', label: 'Clicker', icon: Coins },
    { path: '/redeem', label: 'Redeem', icon: Gift },
    { path: '/history', label: 'History', icon: History },
  ]

  return (
    <nav className="bg-white/80 backdrop-blur-sm border-b border-amber-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
              <Coins className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-800">CoinClicker</span>
          </div>

          {/* Coin Counter */}
          <div className="flex items-center space-x-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white px-4 py-2 rounded-full font-semibold">
            <Coins className="w-5 h-5" />
            <span>{coins.toLocaleString()}</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 pb-4">
          {navItems.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={cn(
                'flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200',
                location.pathname === path
                  ? 'bg-amber-100 text-amber-800 shadow-sm'
                  : 'text-gray-600 hover:text-amber-700 hover:bg-amber-50'
              )}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}