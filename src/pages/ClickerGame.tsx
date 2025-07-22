import { useState, useCallback } from 'react'
import { Coins, Zap } from 'lucide-react'
import { toast } from 'sonner'

interface ClickerGameProps {
  coins: number
  addCoins: (amount: number) => void
}

interface FloatingCoin {
  id: number
  x: number
  y: number
}

export default function ClickerGame({ coins, addCoins }: ClickerGameProps) {
  const [isClicking, setIsClicking] = useState(false)
  const [floatingCoins, setFloatingCoins] = useState<FloatingCoin[]>([])
  const [clickCount, setClickCount] = useState(0)

  const handleClick = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    // Add coins
    addCoins(100)
    setClickCount(prev => prev + 1)

    // Create floating coin animation
    const newFloatingCoin: FloatingCoin = {
      id: Date.now() + Math.random(),
      x: x - 20,
      y: y - 20,
    }

    setFloatingCoins(prev => [...prev, newFloatingCoin])

    // Remove floating coin after animation
    setTimeout(() => {
      setFloatingCoins(prev => prev.filter(coin => coin.id !== newFloatingCoin.id))
    }, 800)

    // Click animation
    setIsClicking(true)
    setTimeout(() => setIsClicking(false), 150)

    // Show milestone toasts
    if (clickCount > 0 && (clickCount + 1) % 50 === 0) {
      toast.success(`🎉 ${clickCount + 1} clicks! You're on fire!`)
    }
  }, [addCoins, clickCount])

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-gray-800">Coin Clicker</h1>
        <p className="text-gray-600">Click the golden coin to earn rewards!</p>
        <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <Zap className="w-4 h-4" />
            <span>+100 coins per click</span>
          </div>
          <div className="flex items-center space-x-1">
            <Coins className="w-4 h-4" />
            <span>{clickCount} total clicks</span>
          </div>
        </div>
      </div>

      {/* Main Clicker Button */}
      <div className="relative">
        <button
          onClick={handleClick}
          className={`
            relative w-64 h-64 rounded-full bg-gradient-to-br from-amber-300 via-amber-400 to-amber-600
            shadow-2xl hover:shadow-3xl transform transition-all duration-150 active:scale-95
            border-8 border-amber-200 hover:border-amber-300
            ${isClicking ? 'coin-click-animation' : ''}
            focus:outline-none focus:ring-4 focus:ring-amber-300/50
          `}
          style={{
            background: `
              radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.3) 0%, transparent 50%),
              linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)
            `,
          }}
        >
          {/* Coin Symbol */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Coins className="w-24 h-24 text-amber-800 drop-shadow-lg" />
          </div>

          {/* Shine Effect */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent" />

          {/* Click Ripple Effect */}
          {isClicking && (
            <div className="absolute inset-0 rounded-full border-4 border-amber-300 pulse-ring" />
          )}
        </button>

        {/* Floating Coins */}
        {floatingCoins.map((coin) => (
          <div
            key={coin.id}
            className="absolute pointer-events-none coin-float"
            style={{
              left: coin.x,
              top: coin.y,
            }}
          >
            <div className="flex items-center space-x-1 bg-amber-500 text-white px-2 py-1 rounded-full text-sm font-semibold shadow-lg">
              <Coins className="w-3 h-3" />
              <span>+100</span>
            </div>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-md">
        <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 text-center border border-amber-200">
          <div className="text-2xl font-bold text-amber-600">{coins.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Total Coins</div>
        </div>
        <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 text-center border border-amber-200">
          <div className="text-2xl font-bold text-emerald-600">{clickCount}</div>
          <div className="text-sm text-gray-600">Clicks</div>
        </div>
        <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 text-center border border-amber-200">
          <div className="text-2xl font-bold text-purple-600">{(clickCount * 100).toLocaleString()}</div>
          <div className="text-sm text-gray-600">Coins Earned</div>
        </div>
      </div>

      {/* Tips */}
      <div className="text-center text-sm text-gray-500 max-w-md">
        <p>💡 <strong>Tip:</strong> Keep clicking to earn coins, then visit the Redeem page to exchange them for real PayPal cash!</p>
      </div>
    </div>
  )
}