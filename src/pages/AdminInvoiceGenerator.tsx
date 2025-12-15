import { useState } from 'react'
import { Send, Download, FileText, DollarSign, Calendar, User } from 'lucide-react'
import GlassCard from '../components/ui/GlassCard'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Textarea from '../components/ui/Textarea'

const AdminInvoiceGenerator = () => {
  const [invoiceData, setInvoiceData] = useState({
    userId: '',
    userName: '',
    userEmail: '',
    mcNumber: '',
    amount: '',
    description: '',
    dueDate: ''
  })

  const recentInvoices = [
    {
      id: 'INV-001',
      userName: 'John Transport LLC',
      userEmail: 'john@transport.com',
      mcNumber: '123456',
      amount: 45000,
      status: 'paid',
      sentDate: '2024-01-10',
      paidDate: '2024-01-12'
    },
    {
      id: 'INV-002',
      userName: 'Express Freight Corp',
      userEmail: 'billing@express.com',
      mcNumber: '789012',
      amount: 32000,
      status: 'pending',
      sentDate: '2024-01-11',
      dueDate: '2024-01-18'
    },
    {
      id: 'INV-003',
      userName: 'Regional Routes LLC',
      userEmail: 'finance@regional.com',
      mcNumber: '901234',
      amount: 38000,
      status: 'pending',
      sentDate: '2024-01-12',
      dueDate: '2024-01-19'
    }
  ]

  const users = [
    { id: '1', name: 'John Transport LLC', email: 'john@transport.com' },
    { id: '2', name: 'Express Freight Corp', email: 'billing@express.com' },
    { id: '3', name: 'Regional Routes LLC', email: 'finance@regional.com' },
    { id: '4', name: 'Quick Logistics Inc', email: 'accounts@quick.com' }
  ]

  const handleGenerateInvoice = () => {
    if (!invoiceData.userName || !invoiceData.amount) {
      alert('Please fill in required fields')
      return
    }

    const invoiceNumber = `INV-${String(recentInvoices.length + 1).padStart(3, '0')}`
    alert(`Invoice ${invoiceNumber} generated and sent to ${invoiceData.userEmail}`)

    // Reset form
    setInvoiceData({
      userId: '',
      userName: '',
      userEmail: '',
      mcNumber: '',
      amount: '',
      description: '',
      dueDate: ''
    })
  }

  const handleUserSelect = (userId: string) => {
    const user = users.find(u => u.id === userId)
    if (user) {
      setInvoiceData({
        ...invoiceData,
        userId: user.id,
        userName: user.name,
        userEmail: user.email
      })
    }
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-1">Invoice Generator</h2>
          <p className="text-white/60">Create and send invoices to users</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Invoice Form */}
          <div className="lg:col-span-2">
            <GlassCard>
              <h3 className="text-xl font-bold mb-6">Create New Invoice</h3>

              <div className="space-y-4">
                {/* User Selection */}
                <div>
                  <label className="block text-sm font-medium mb-2">Select User</label>
                  <select
                    value={invoiceData.userId}
                    onChange={(e) => handleUserSelect(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg glass-subtle border border-white/10 focus:border-primary-500 focus:outline-none transition-colors"
                  >
                    <option value="">-- Select User --</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name} ({user.email})
                      </option>
                    ))}
                  </select>
                </div>

                {invoiceData.userId && (
                  <>
                    {/* User Details */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <Input
                        label="User Name"
                        value={invoiceData.userName}
                        disabled
                        icon={<User className="w-4 h-4" />}
                      />
                      <Input
                        label="Email Address"
                        value={invoiceData.userEmail}
                        disabled
                      />
                    </div>

                    {/* MC Number */}
                    <Input
                      label="MC Number (Optional)"
                      placeholder="Enter MC number"
                      value={invoiceData.mcNumber}
                      onChange={(e) => setInvoiceData({ ...invoiceData, mcNumber: e.target.value })}
                    />

                    {/* Amount */}
                    <Input
                      label="Amount *"
                      type="number"
                      placeholder="Enter invoice amount"
                      value={invoiceData.amount}
                      onChange={(e) => setInvoiceData({ ...invoiceData, amount: e.target.value })}
                      icon={<DollarSign className="w-4 h-4" />}
                    />

                    {/* Due Date */}
                    <Input
                      label="Due Date"
                      type="date"
                      value={invoiceData.dueDate}
                      onChange={(e) => setInvoiceData({ ...invoiceData, dueDate: e.target.value })}
                      icon={<Calendar className="w-4 h-4" />}
                    />

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Description</label>
                      <Textarea
                        placeholder="Enter invoice description or notes..."
                        value={invoiceData.description}
                        onChange={(e) => setInvoiceData({ ...invoiceData, description: e.target.value })}
                        rows={4}
                      />
                    </div>

                    {/* Preview */}
                    <GlassCard variant="subtle">
                      <h4 className="font-semibold mb-3">Invoice Preview</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-white/60">To:</span>
                          <span>{invoiceData.userName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/60">Email:</span>
                          <span>{invoiceData.userEmail}</span>
                        </div>
                        {invoiceData.mcNumber && (
                          <div className="flex justify-between">
                            <span className="text-white/60">MC Number:</span>
                            <span>#{invoiceData.mcNumber}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-white/60">Amount:</span>
                          <span className="text-xl font-bold text-primary-400">
                            ${invoiceData.amount ? Number(invoiceData.amount).toLocaleString() : '0'}
                          </span>
                        </div>
                        {invoiceData.dueDate && (
                          <div className="flex justify-between">
                            <span className="text-white/60">Due Date:</span>
                            <span>{new Date(invoiceData.dueDate).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                    </GlassCard>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <Button fullWidth onClick={handleGenerateInvoice}>
                        <Send className="w-4 h-4 mr-2" />
                        Generate & Send Invoice
                      </Button>
                      <Button fullWidth variant="secondary">
                        <Download className="w-4 h-4 mr-2" />
                        Download PDF
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </GlassCard>
          </div>

          {/* Recent Invoices */}
          <div>
            <GlassCard>
              <h3 className="text-lg font-bold mb-4">Recent Invoices</h3>

              <div className="space-y-3">
                {recentInvoices.map((invoice) => (
                  <div key={invoice.id} className="glass-subtle rounded-lg p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="font-semibold text-sm">{invoice.id}</div>
                        <div className="text-xs text-white/60">{invoice.userName}</div>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        invoice.status === 'paid'
                          ? 'bg-trust-high/20 text-trust-high'
                          : 'bg-yellow-400/20 text-yellow-400'
                      }`}>
                        {invoice.status}
                      </span>
                    </div>

                    <div className="text-lg font-bold text-primary-400 mb-2">
                      ${invoice.amount.toLocaleString()}
                    </div>

                    <div className="text-xs text-white/60 space-y-1">
                      <div>MC #{invoice.mcNumber}</div>
                      <div>Sent: {new Date(invoice.sentDate).toLocaleDateString()}</div>
                      {invoice.paidDate && (
                        <div>Paid: {new Date(invoice.paidDate).toLocaleDateString()}</div>
                      )}
                    </div>

                    <div className="flex gap-2 mt-3">
                      <Button variant="ghost" size="sm" fullWidth>
                        <FileText className="w-3 h-3 mr-1" />
                        View
                      </Button>
                      <Button variant="ghost" size="sm" fullWidth>
                        <Download className="w-3 h-3 mr-1" />
                        PDF
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminInvoiceGenerator
