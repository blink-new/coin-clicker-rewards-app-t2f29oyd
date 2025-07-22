import { History, DollarSign, Calendar, CheckCircle, Clock, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

interface Redemption {
  id: string
  date: string
  coins: number
  cash: number
  status: 'completed' | 'pending' | 'failed'
  paypalEmail: string
}

interface RedemptionHistoryProps {
  redemptions: Redemption[]
}

export default function RedemptionHistory({ redemptions }: RedemptionHistoryProps) {
  const totalRedeemed = redemptions
    .filter(r => r.status === 'completed')
    .reduce((sum, r) => sum + r.cash, 0)

  const totalCoinsSpent = redemptions
    .filter(r => r.status === 'completed')
    .reduce((sum, r) => sum + r.coins, 0)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200">Completed</Badge>
      case 'pending':
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">Pending</Badge>
      case 'failed':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Failed</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-800">Redemption History</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Track all your coin redemptions and PayPal payments in one place.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Redeemed</CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">${totalRedeemed}</div>
            <p className="text-xs text-muted-foreground">
              Lifetime PayPal earnings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Coins Spent</CardTitle>
            <TrendingUp className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{totalCoinsSpent.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Total coins redeemed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <History className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{redemptions.length}</div>
            <p className="text-xs text-muted-foreground">
              Total redemptions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Redemption Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <History className="w-5 h-5" />
            <span>Transaction History</span>
          </CardTitle>
          <CardDescription>
            All your coin redemptions and their current status
          </CardDescription>
        </CardHeader>
        <CardContent>
          {redemptions.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <History className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">No Redemptions Yet</h3>
              <p className="text-gray-600 mb-4">
                Start clicking coins and redeem them for PayPal cash to see your history here!
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Coins Spent</TableHead>
                    <TableHead>PayPal Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Transaction ID</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {redemptions.map((redemption) => (
                    <TableRow key={redemption.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">
                            {formatDate(redemption.date)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <DollarSign className="w-4 h-4 text-emerald-600" />
                          <span className="font-semibold text-emerald-600">
                            ${redemption.cash}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 bg-amber-400 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-amber-600 rounded-full" />
                          </div>
                          <span>{redemption.coins.toLocaleString()}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {redemption.paypalEmail}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(redemption.status)}
                      </TableCell>
                      <TableCell className="text-right">
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {redemption.id}
                        </code>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity Summary */}
      {redemptions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <span>Recent Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {redemptions.slice(0, 3).map((redemption) => (
                <div key={redemption.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center
                      ${redemption.status === 'completed' ? 'bg-emerald-100' : 'bg-amber-100'}
                    `}>
                      {redemption.status === 'completed' ? (
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Clock className="w-4 h-4 text-amber-600" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium">
                        Redeemed ${redemption.cash} for {redemption.coins.toLocaleString()} coins
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatDate(redemption.date)}
                      </div>
                    </div>
                  </div>
                  {getStatusBadge(redemption.status)}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}