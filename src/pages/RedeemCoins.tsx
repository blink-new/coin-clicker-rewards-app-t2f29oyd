import { useState } from 'react'
import { Coins, DollarSign, Gift, AlertCircle, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

interface RedeemCoinsProps {
  coins: number
  spendCoins: (amount: number) => boolean
  addRedemption: (redemption: any) => void
}

interface RedemptionTier {
  id: string
  coins: number
  cash: number
  popular?: boolean
}

const redemptionTiers: RedemptionTier[] = [
  { id: 'tier1', coins: 5000, cash: 1 },
  { id: 'tier2', coins: 10000, cash: 5, popular: true },
  { id: 'tier3', coins: 20000, cash: 10 },
  { id: 'tier4', coins: 50000, cash: 20 },
  { id: 'tier5', coins: 100000, cash: 50 },
  { id: 'tier6', coins: 250000, cash: 100 },
]

export default function RedeemCoins({ coins, spendCoins, addRedemption }: RedeemCoinsProps) {
  const [isRedeeming, setIsRedeeming] = useState<string | null>(null)
  const [showEmailDialog, setShowEmailDialog] = useState(false)
  const [selectedTier, setSelectedTier] = useState<RedemptionTier | null>(null)
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')

  const handleRedeemClick = (tier: RedemptionTier) => {
    console.log('Redeem button clicked for tier:', tier, 'Current coins:', coins)
    
    if (coins < tier.coins) {
      toast.error(`You need ${(tier.coins - coins).toLocaleString()} more coins to redeem this tier!`)
      return
    }

    console.log('Opening email dialog for tier:', tier)
    setSelectedTier(tier)
    setShowEmailDialog(true)
    setEmail('')
    setEmailError('')
    
    console.log('Dialog state after setting:', { showEmailDialog: true, selectedTier: tier })
    
    // Force a re-render to ensure dialog appears
    setTimeout(() => {
      console.log('Dialog state check after timeout:', { showEmailDialog, selectedTier })
    }, 100)
  }

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleConfirmRedemption = async () => {
    if (!email.trim()) {
      setEmailError('Email is required')
      return
    }

    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address')
      return
    }

    if (!selectedTier) return

    setEmailError('')
    setShowEmailDialog(false)
    setIsRedeeming(selectedTier.id)

    // Simulate PayPal processing
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))

      if (spendCoins(selectedTier.coins)) {
        const redemption = {
          id: Date.now().toString(),
          date: new Date().toISOString(),
          coins: selectedTier.coins,
          cash: selectedTier.cash,
          status: 'completed',
          paypalEmail: email,
        }

        addRedemption(redemption)
        toast.success(`🎉 Successfully redeemed ${selectedTier.cash}! PayPal payment will be sent to ${email} within 24 hours.`)
      } else {
        toast.error('Insufficient coins!')
      }
    } catch (error) {
      toast.error('Redemption failed. Please try again.')
    } finally {
      setIsRedeeming(null)
      setSelectedTier(null)
    }
  }

  const getAffordabilityStatus = (requiredCoins: number) => {
    if (coins >= requiredCoins) return 'affordable'
    if (coins >= requiredCoins * 0.8) return 'close'
    return 'far'
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-800">Redeem Your Coins</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Exchange your hard-earned coins for real PayPal cash! Choose from our redemption tiers below.
        </p>
        
        {/* Current Balance */}
        <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white px-6 py-3 rounded-full font-semibold text-lg shadow-lg">
          <Coins className="w-6 h-6" />
          <span>{coins.toLocaleString()} coins available</span>
        </div>
      </div>

      {/* Redemption Tiers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {redemptionTiers.map((tier) => {
          const affordability = getAffordabilityStatus(tier.coins)
          const isAffordable = affordability === 'affordable'
          const isProcessing = isRedeeming === tier.id

          return (
            <Card 
              key={tier.id} 
              className={`
                relative transition-all duration-200 hover:shadow-lg
                ${tier.popular ? 'ring-2 ring-emerald-400 shadow-lg' : ''}
                ${isAffordable ? 'border-emerald-300' : 'border-gray-200'}
              `}
            >
              {tier.popular && (
                <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-emerald-500 hover:bg-emerald-600">
                  Most Popular
                </Badge>
              )}

              <CardHeader className="text-center pb-4">
                <div className="flex items-center justify-center mb-2">
                  <div className={`
                    w-16 h-16 rounded-full flex items-center justify-center
                    ${isAffordable ? 'bg-emerald-100' : 'bg-gray-100'}
                  `}>
                    <DollarSign className={`
                      w-8 h-8 
                      ${isAffordable ? 'text-emerald-600' : 'text-gray-400'}
                    `} />
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold text-gray-800">
                  ${tier.cash}
                </CardTitle>
                <CardDescription className="text-lg">
                  {tier.coins.toLocaleString()} coins
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Progress</span>
                    <span className={`
                      font-medium
                      ${isAffordable ? 'text-emerald-600' : 'text-gray-600'}
                    `}>
                      {Math.min(100, Math.round((coins / tier.coins) * 100))}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`
                        h-2 rounded-full transition-all duration-300
                        ${isAffordable ? 'bg-emerald-500' : 'bg-amber-400'}
                      `}
                      style={{ 
                        width: `${Math.min(100, (coins / tier.coins) * 100)}%` 
                      }}
                    />
                  </div>
                </div>

                {/* Status */}
                {!isAffordable && (
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <AlertCircle className="w-4 h-4" />
                    <span>
                      Need {(tier.coins - coins).toLocaleString()} more coins
                    </span>
                  </div>
                )}

                {/* Redeem Button */}
                <Button
                  onClick={() => handleRedeemClick(tier)}
                  disabled={!isAffordable || isProcessing}
                  className={`
                    w-full font-semibold
                    ${isAffordable 
                      ? 'bg-emerald-500 hover:bg-emerald-600 text-white' 
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }
                  `}
                >
                  {isProcessing ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Processing...</span>
                    </div>
                  ) : isAffordable ? (
                    <div className="flex items-center space-x-2">
                      <Gift className="w-4 h-4" />
                      <span>Redeem ${tier.cash}</span>
                    </div>
                  ) : (
                    'Insufficient Coins'
                  )}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Info Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-800 mb-2">How Redemption Works</h3>
        <ul className="text-blue-700 text-sm space-y-1">
          <li>• PayPal payments are processed within 24 hours</li>
          <li>• You'll receive an email confirmation once payment is sent</li>
          <li>• Minimum redemption is $1 (5,000 coins)</li>
          <li>• All transactions are secure and tracked in your history</li>
        </ul>
      </div>

      {/* Email Input Dialog */}
      {showEmailDialog && <div className="fixed top-4 right-4 bg-red-500 text-white p-2 rounded z-50">Dialog should be open!</div>}
      <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Mail className="w-5 h-5 text-emerald-600" />
              <span>Enter PayPal Email</span>
            </DialogTitle>
            <DialogDescription>
              {selectedTier && (
                <>
                  You're about to redeem <strong>{selectedTier.coins.toLocaleString()} coins</strong> for <strong>${selectedTier.cash}</strong>.
                  Please enter your PayPal email address to receive the payment.
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="paypal-email">PayPal Email Address</Label>
              <Input
                id="paypal-email"
                type="email"
                placeholder="your-email@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (emailError) setEmailError('')
                }}
                className={emailError ? 'border-red-500' : ''}
              />
              {emailError && (
                <p className="text-sm text-red-600">{emailError}</p>
              )}
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-sm text-amber-800">
                <strong>Important:</strong> Make sure this email is associated with your PayPal account. 
                Payments will be sent to this address within 24 hours.
              </p>
            </div>

            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowEmailDialog(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmRedemption}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600"
              >
                Confirm Redemption
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}