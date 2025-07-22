import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Toaster } from 'sonner'
import Navigation from './components/Navigation'
import ClickerGame from './pages/ClickerGame'
import RedeemCoins from './pages/RedeemCoins'
import RedemptionHistory from './pages/RedemptionHistory'

function App() {
  const [coins, setCoins] = useState(() => {
    const saved = localStorage.getItem('coins')
    return saved ? parseInt(saved) : 0
  })

  const [redemptions, setRedemptions] = useState(() => {
    const saved = localStorage.getItem('redemptions')
    return saved ? JSON.parse(saved) : []
  })

  // Save coins to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('coins', coins.toString())
  }, [coins])

  // Save redemptions to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('redemptions', JSON.stringify(redemptions))
  }, [redemptions])

  const addCoins = (amount: number) => {
    setCoins(prev => prev + amount)
  }

  const spendCoins = (amount: number) => {
    if (coins >= amount) {
      setCoins(prev => prev - amount)
      return true
    }
    return false
  }

  const addRedemption = (redemption: any) => {
    setRedemptions(prev => [redemption, ...prev])
  }

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
        <Navigation coins={coins} />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route 
              path="/" 
              element={<ClickerGame coins={coins} addCoins={addCoins} />} 
            />
            <Route 
              path="/redeem" 
              element={
                <RedeemCoins 
                  coins={coins} 
                  spendCoins={spendCoins} 
                  addRedemption={addRedemption} 
                />
              } 
            />
            <Route 
              path="/history" 
              element={<RedemptionHistory redemptions={redemptions} />} 
            />
          </Routes>
        </main>
        <Toaster position="top-center" richColors />
      </div>
    </Router>
  )
}

export default App