import { useState, useEffect, useRef } from 'react'
import {
  Send,
  Download,
  FileText,
  DollarSign,
  Calendar,
  User,
  Plus,
  Trash2,
  Eye,
  Printer,
  X,
  CheckCircle,
  Clock,
  AlertCircle,
  Building2,
  Mail,
  Phone,
  Hash,
  Loader2,
  ExternalLink,
  Ban,
  RefreshCw,
  CreditCard,
  Landmark,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Textarea from '../components/ui/Textarea'
import Select from '../components/ui/Select'
import api from '../services/api'
import { format } from 'date-fns'

interface LineItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
}

interface InvoiceData {
  invoiceNumber: string
  invoiceType: 'mc_sale' | 'deposit' | 'listing_fee' | 'platform_fee' | 'custom'
  userId: string
  userName: string
  userEmail: string
  userPhone: string
  userCompany: string
  mcNumber: string
  transactionId: string
  lineItems: LineItem[]
  notes: string
  dueDate: string
  issueDate: string
  paymentMethods: string[]
  autoSend: boolean
}

const INVOICE_TYPES = [
  { value: 'mc_sale', label: 'Trucking Business Sale' },
  { value: 'deposit', label: 'Deposit Payment' },
  { value: 'listing_fee', label: 'Listing Fee' },
  { value: 'platform_fee', label: 'Platform Fee' },
  { value: 'custom', label: 'Custom Invoice' },
]

const PAYMENT_METHOD_OPTIONS = [
  { value: 'us_bank_account', label: 'Bank Transfer / Wire (ACH)', icon: Landmark },
  { value: 'card', label: 'Credit / Debit Card', icon: CreditCard },
]

const AdminInvoiceGenerator = () => {
  const [users, setUsers] = useState<any[]>([])
  const [loadingUsers, setLoadingUsers] = useState(true)
  const [showPreview, setShowPreview] = useState(false)
  const [sending, setSending] = useState(false)
  const [savedInvoices, setSavedInvoices] = useState<any[]>([])
  const [loadingInvoices, setLoadingInvoices] = useState(true)
  const [invoiceFilter, setInvoiceFilter] = useState<string>('')
  const [successMessage, setSuccessMessage] = useState<{ text: string; url?: string } | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const printRef = useRef<HTMLDivElement>(null)

  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    invoiceNumber: '',
    invoiceType: 'custom',
    userId: '',
    userName: '',
    userEmail: '',
    userPhone: '',
    userCompany: '',
    mcNumber: '',
    transactionId: '',
    lineItems: [{ id: '1', description: '', quantity: 1, unitPrice: 0 }],
    notes: '',
    dueDate: format(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
    issueDate: format(new Date(), 'yyyy-MM-dd'),
    paymentMethods: ['us_bank_account'],
    autoSend: true,
  })

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoadingUsers(true)
        const response = await api.getAdminUsers({ limit: 100 })
        setUsers(response.users || [])
      } catch (err) {
        console.error('Failed to fetch users:', err)
      } finally {
        setLoadingUsers(false)
      }
    }
    fetchUsers()
  }, [])

  // Fetch invoices from Stripe
  const fetchInvoices = async (status?: string) => {
    try {
      setLoadingInvoices(true)
      const response = await api.getAdminInvoices({
        limit: 20,
        status: status || undefined,
      })
      setSavedInvoices(response.data || [])
    } catch (err) {
      console.error('Failed to fetch invoices:', err)
    } finally {
      setLoadingInvoices(false)
    }
  }

  useEffect(() => {
    fetchInvoices(invoiceFilter)
  }, [invoiceFilter])

  // Calculate totals
  const subtotal = invoiceData.lineItems.reduce(
    (sum, item) => sum + (item.quantity * item.unitPrice), 0
  )
  const tax = 0
  const total = subtotal + tax

  const handleUserSelect = (userId: string) => {
    const user = users.find(u => u.id === userId)
    if (user) {
      setInvoiceData({
        ...invoiceData,
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        userPhone: user.phone || '',
        userCompany: user.companyName || user.name,
      })
    }
  }

  const handleInvoiceTypeChange = (type: string) => {
    let defaultLineItems: LineItem[] = []

    switch (type) {
      case 'mc_sale':
        defaultLineItems = [{ id: '1', description: 'Trucking Business Sale', quantity: 1, unitPrice: 0 }]
        break
      case 'deposit':
        defaultLineItems = [{ id: '1', description: 'Transaction Deposit (10%)', quantity: 1, unitPrice: 0 }]
        break
      case 'listing_fee':
        defaultLineItems = [{ id: '1', description: 'MC Listing Fee', quantity: 1, unitPrice: 199 }]
        break
      case 'platform_fee':
        defaultLineItems = [{ id: '1', description: 'Platform Service Fee', quantity: 1, unitPrice: 0 }]
        break
      default:
        defaultLineItems = [{ id: '1', description: '', quantity: 1, unitPrice: 0 }]
    }

    setInvoiceData({
      ...invoiceData,
      invoiceType: type as InvoiceData['invoiceType'],
      lineItems: defaultLineItems,
    })
  }

  const addLineItem = () => {
    setInvoiceData({
      ...invoiceData,
      lineItems: [
        ...invoiceData.lineItems,
        { id: Date.now().toString(), description: '', quantity: 1, unitPrice: 0 }
      ]
    })
  }

  const removeLineItem = (id: string) => {
    if (invoiceData.lineItems.length > 1) {
      setInvoiceData({
        ...invoiceData,
        lineItems: invoiceData.lineItems.filter(item => item.id !== id)
      })
    }
  }

  const updateLineItem = (id: string, field: keyof LineItem, value: string | number) => {
    setInvoiceData({
      ...invoiceData,
      lineItems: invoiceData.lineItems.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    })
  }

  const togglePaymentMethod = (method: string) => {
    setInvoiceData(prev => {
      const methods = prev.paymentMethods.includes(method)
        ? prev.paymentMethods.filter(m => m !== method)
        : [...prev.paymentMethods, method]
      // Must have at least one method
      if (methods.length === 0) return prev
      return { ...prev, paymentMethods: methods }
    })
  }

  const resetForm = () => {
    setInvoiceData({
      invoiceNumber: '',
      invoiceType: 'custom',
      userId: '',
      userName: '',
      userEmail: '',
      userPhone: '',
      userCompany: '',
      mcNumber: '',
      transactionId: '',
      lineItems: [{ id: '1', description: '', quantity: 1, unitPrice: 0 }],
      notes: '',
      dueDate: format(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
      issueDate: format(new Date(), 'yyyy-MM-dd'),
      paymentMethods: ['us_bank_account'],
      autoSend: true,
    })
  }

  const handleGenerateInvoice = async () => {
    if (!invoiceData.userId || !invoiceData.userEmail || total <= 0) {
      setErrorMessage('Please select a user and add at least one line item with a price')
      setTimeout(() => setErrorMessage(null), 5000)
      return
    }

    if (invoiceData.paymentMethods.length === 0) {
      setErrorMessage('Please select at least one payment method')
      setTimeout(() => setErrorMessage(null), 5000)
      return
    }

    setSending(true)
    setErrorMessage(null)
    setSuccessMessage(null)

    try {
      const response = await api.createAdminInvoice({
        userId: invoiceData.userId,
        lineItems: invoiceData.lineItems.map(item => ({
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
        dueDate: invoiceData.dueDate,
        notes: invoiceData.notes,
        invoiceType: invoiceData.invoiceType,
        mcNumber: invoiceData.mcNumber,
        paymentMethods: invoiceData.paymentMethods,
        autoSend: invoiceData.autoSend,
      })

      const invNumber = response.data?.invoice?.number || response.data?.invoice?.id
      setSuccessMessage({
        text: `Invoice ${invNumber} created and sent to ${invoiceData.userEmail}`,
        url: response.data?.hostedUrl || undefined,
      })

      resetForm()
      fetchInvoices(invoiceFilter)
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to create invoice')
    } finally {
      setSending(false)
    }
  }

  const handleVoidInvoice = async (invoiceId: string) => {
    if (!confirm('Are you sure you want to void this invoice? This cannot be undone.')) return

    try {
      await api.voidAdminInvoice(invoiceId)
      fetchInvoices(invoiceFilter)
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to void invoice')
      setTimeout(() => setErrorMessage(null), 5000)
    }
  }

  const handleResendInvoice = async (invoiceId: string) => {
    try {
      await api.sendAdminInvoice(invoiceId)
      setSuccessMessage({ text: 'Invoice resent successfully' })
      setTimeout(() => setSuccessMessage(null), 5000)
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to resend invoice')
      setTimeout(() => setErrorMessage(null), 5000)
    }
  }

  const handlePrint = () => {
    const printContent = printRef.current
    if (!printContent) return

    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice Preview</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 40px; }
            .invoice-header { display: flex; justify-content: space-between; margin-bottom: 40px; }
            .company-name { font-size: 24px; font-weight: bold; color: #1a1a2e; }
            .company-details { color: #666; font-size: 14px; margin-top: 8px; }
            .invoice-number { font-size: 20px; font-weight: bold; color: #1a1a2e; }
            .invoice-dates { color: #666; font-size: 14px; margin-top: 8px; }
            .bill-to { margin-bottom: 30px; }
            .bill-to-label { font-size: 12px; color: #666; text-transform: uppercase; margin-bottom: 8px; }
            .bill-to-name { font-size: 18px; font-weight: bold; }
            .bill-to-details { color: #666; font-size: 14px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            th { background: #f5f5f5; padding: 12px; text-align: left; border-bottom: 2px solid #ddd; }
            td { padding: 12px; border-bottom: 1px solid #eee; }
            .amount { text-align: right; }
            .totals { margin-left: auto; width: 300px; }
            .totals-row { display: flex; justify-content: space-between; padding: 8px 0; }
            .totals-row.total { font-size: 20px; font-weight: bold; border-top: 2px solid #1a1a2e; padding-top: 12px; }
            .notes { margin-top: 40px; padding: 20px; background: #f9f9f9; border-radius: 8px; }
            .notes-label { font-weight: bold; margin-bottom: 8px; }
            .footer { margin-top: 60px; text-align: center; color: #999; font-size: 12px; }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  }

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      draft: 'bg-gray-100 text-gray-600',
      open: 'bg-blue-100 text-blue-600',
      paid: 'bg-emerald-100 text-emerald-600',
      uncollectible: 'bg-red-100 text-red-600',
      void: 'bg-gray-100 text-gray-400',
    }
    const icons: Record<string, JSX.Element> = {
      draft: <FileText className="w-3 h-3" />,
      open: <Send className="w-3 h-3" />,
      paid: <CheckCircle className="w-3 h-3" />,
      uncollectible: <AlertCircle className="w-3 h-3" />,
      void: <X className="w-3 h-3" />,
    }
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${styles[status] || 'bg-gray-100 text-gray-600'}`}>
        {icons[status] || <Clock className="w-3 h-3" />}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  const formatCents = (cents: number) => {
    return `$${(cents / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}`
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Invoice Generator</h2>
          <p className="text-gray-500">Create and send Stripe invoices with wire transfer / ACH / card payment options</p>
        </div>

        {/* Success Message */}
        <AnimatePresence>
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex items-start gap-3"
            >
              <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-emerald-800 font-medium">{successMessage.text}</p>
                {successMessage.url && (
                  <a
                    href={successMessage.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-600 text-sm hover:underline inline-flex items-center gap-1 mt-1"
                  >
                    View payment page <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
              <button onClick={() => setSuccessMessage(null)} className="text-emerald-400 hover:text-emerald-600">
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Message */}
        <AnimatePresence>
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-red-800 flex-1">{errorMessage}</p>
              <button onClick={() => setErrorMessage(null)} className="text-red-400 hover:text-red-600">
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Invoice Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <h3 className="text-xl font-bold text-gray-900 mb-6">Create New Invoice</h3>

              <div className="space-y-6">
                {/* Invoice Details Row */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Issue Date</label>
                    <Input
                      type="date"
                      value={invoiceData.issueDate}
                      onChange={(e) => setInvoiceData({ ...invoiceData, issueDate: e.target.value })}
                      icon={<Calendar className="w-4 h-4" />}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                    <Input
                      type="date"
                      value={invoiceData.dueDate}
                      onChange={(e) => setInvoiceData({ ...invoiceData, dueDate: e.target.value })}
                      icon={<Calendar className="w-4 h-4" />}
                    />
                  </div>
                </div>

                {/* Invoice Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Invoice Type</label>
                  <Select
                    value={invoiceData.invoiceType}
                    onChange={(e) => handleInvoiceTypeChange(e.target.value)}
                    options={INVOICE_TYPES}
                  />
                </div>

                {/* Payment Methods */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Accepted Payment Methods</label>
                  <div className="flex flex-wrap gap-3">
                    {PAYMENT_METHOD_OPTIONS.map(({ value, label, icon: Icon }) => {
                      const isActive = invoiceData.paymentMethods.includes(value)
                      return (
                        <button
                          key={value}
                          type="button"
                          onClick={() => togglePaymentMethod(value)}
                          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 transition-all text-sm font-medium ${
                            isActive
                              ? 'border-secondary-500 bg-secondary-50 text-secondary-700'
                              : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          {label}
                          {isActive && <CheckCircle className="w-4 h-4 text-secondary-500" />}
                        </button>
                      )
                    })}
                  </div>
                  <p className="text-xs text-gray-400 mt-1.5">
                    Bank Transfer / Wire uses Stripe's hosted bank transfer instructions (ACH). Customer receives wire details via email.
                  </p>
                </div>

                {/* User Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bill To *</label>
                  <select
                    value={invoiceData.userId}
                    onChange={(e) => handleUserSelect(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg bg-gray-50 border border-gray-200 focus:border-secondary-500 focus:ring-2 focus:ring-secondary-500/20 focus:outline-none transition-all text-gray-900"
                  >
                    <option value="">-- Select User --</option>
                    {loadingUsers ? (
                      <option disabled>Loading users...</option>
                    ) : (
                      users.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.name} ({user.email})
                        </option>
                      ))
                    )}
                  </select>
                </div>

                {/* Selected User Details */}
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="Name / Company *"
                    placeholder="Enter name or company"
                    value={invoiceData.userName}
                    onChange={(e) => setInvoiceData({ ...invoiceData, userName: e.target.value })}
                    icon={<User className="w-4 h-4" />}
                  />
                  <Input
                    label="Email Address *"
                    type="email"
                    placeholder="Enter email"
                    value={invoiceData.userEmail}
                    onChange={(e) => setInvoiceData({ ...invoiceData, userEmail: e.target.value })}
                    icon={<Mail className="w-4 h-4" />}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="Phone Number"
                    placeholder="(555) 555-5555"
                    value={invoiceData.userPhone}
                    onChange={(e) => setInvoiceData({ ...invoiceData, userPhone: e.target.value })}
                    icon={<Phone className="w-4 h-4" />}
                  />
                  <Input
                    label="MC Number"
                    placeholder="MC Number (if applicable)"
                    value={invoiceData.mcNumber}
                    onChange={(e) => setInvoiceData({ ...invoiceData, mcNumber: e.target.value })}
                    icon={<Hash className="w-4 h-4" />}
                  />
                </div>

                {/* Line Items */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium text-gray-700">Line Items</label>
                    <Button size="sm" variant="secondary" onClick={addLineItem}>
                      <Plus className="w-4 h-4 mr-1" />
                      Add Item
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {invoiceData.lineItems.map((item) => (
                      <div key={item.id} className="flex gap-3 items-start">
                        <div className="flex-1">
                          <Input
                            placeholder="Description"
                            value={item.description}
                            onChange={(e) => updateLineItem(item.id, 'description', e.target.value)}
                          />
                        </div>
                        <div className="w-24">
                          <Input
                            type="number"
                            placeholder="Qty"
                            value={item.quantity}
                            onChange={(e) => updateLineItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                          />
                        </div>
                        <div className="w-36">
                          <Input
                            type="number"
                            placeholder="Unit Price"
                            value={item.unitPrice}
                            onChange={(e) => updateLineItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                            icon={<DollarSign className="w-4 h-4" />}
                          />
                        </div>
                        <div className="w-28 pt-2 text-right font-semibold text-gray-900">
                          ${(item.quantity * item.unitPrice).toLocaleString()}
                        </div>
                        {invoiceData.lineItems.length > 1 && (
                          <button
                            onClick={() => removeLineItem(item.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Totals */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-end">
                    <div className="w-64 space-y-2">
                      <div className="flex justify-between text-gray-600">
                        <span>Subtotal</span>
                        <span>${subtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Tax</span>
                        <span>${tax.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t border-gray-200">
                        <span>Total</span>
                        <span>${total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Auto-send toggle */}
                <div className="flex items-center gap-3">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={invoiceData.autoSend}
                      onChange={(e) => setInvoiceData({ ...invoiceData, autoSend: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-secondary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary-600"></div>
                  </label>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Auto-send to customer</span>
                    <p className="text-xs text-gray-400">
                      {invoiceData.autoSend
                        ? 'Invoice will be finalized and emailed to the customer immediately'
                        : 'Invoice will be saved as a draft — you can send it later'}
                    </p>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes / Terms</label>
                  <Textarea
                    placeholder="Add any notes, payment instructions, or terms..."
                    value={invoiceData.notes}
                    onChange={(e) => setInvoiceData({ ...invoiceData, notes: e.target.value })}
                    rows={3}
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleGenerateInvoice}
                    disabled={sending || !invoiceData.userId || !invoiceData.userEmail || total <= 0}
                  >
                    {sending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating Invoice...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        {invoiceData.autoSend ? 'Create & Send Invoice' : 'Create Draft Invoice'}
                      </>
                    )}
                  </Button>
                  <Button variant="secondary" onClick={() => setShowPreview(true)}>
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                  <Button variant="outline" onClick={handlePrint}>
                    <Printer className="w-4 h-4 mr-2" />
                    Print / PDF
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Recent Invoices from Stripe */}
          <div>
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Stripe Invoices</h3>
                <button
                  onClick={() => fetchInvoices(invoiceFilter)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Refresh"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

              {/* Filter */}
              <div className="mb-4">
                <select
                  value={invoiceFilter}
                  onChange={(e) => setInvoiceFilter(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-gray-50 border border-gray-200 focus:border-secondary-500 focus:outline-none"
                >
                  <option value="">All Invoices</option>
                  <option value="draft">Draft</option>
                  <option value="open">Open (Sent)</option>
                  <option value="paid">Paid</option>
                  <option value="void">Voided</option>
                  <option value="uncollectible">Uncollectible</option>
                </select>
              </div>

              {loadingInvoices ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                </div>
              ) : savedInvoices.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No invoices found</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {savedInvoices.map((invoice) => (
                    <div key={invoice.id} className="bg-gray-50 border border-gray-100 rounded-lg p-3">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="font-semibold text-sm text-gray-900">
                            {invoice.number || invoice.id?.slice(-8)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {invoice.customer_name || invoice.customer_email || 'Unknown'}
                          </div>
                        </div>
                        {getStatusBadge(invoice.status)}
                      </div>

                      <div className="text-lg font-bold text-secondary-600 mb-2">
                        {formatCents(invoice.amount_due || invoice.total || 0)}
                      </div>

                      <div className="text-xs text-gray-500 space-y-1">
                        {invoice.metadata?.mcNumber && (
                          <div>MC #{invoice.metadata.mcNumber}</div>
                        )}
                        {invoice.metadata?.invoiceType && (
                          <div className="capitalize">{invoice.metadata.invoiceType.replace('_', ' ')}</div>
                        )}
                        <div>Created: {new Date(invoice.created * 1000).toLocaleDateString()}</div>
                        {invoice.due_date && (
                          <div>Due: {new Date(invoice.due_date * 1000).toLocaleDateString()}</div>
                        )}
                        {invoice.status === 'paid' && invoice.status_transitions?.paid_at && (
                          <div className="text-emerald-600">
                            Paid: {new Date(invoice.status_transitions.paid_at * 1000).toLocaleDateString()}
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 mt-3">
                        {invoice.hosted_invoice_url && (
                          <a
                            href={invoice.hosted_invoice_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1"
                          >
                            <Button variant="ghost" size="sm" fullWidth>
                              <ExternalLink className="w-3 h-3 mr-1" />
                              View
                            </Button>
                          </a>
                        )}
                        {invoice.invoice_pdf && (
                          <a
                            href={invoice.invoice_pdf}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1"
                          >
                            <Button variant="ghost" size="sm" fullWidth>
                              <Download className="w-3 h-3 mr-1" />
                              PDF
                            </Button>
                          </a>
                        )}
                        {invoice.status === 'open' && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleResendInvoice(invoice.id)}
                              title="Resend invoice email"
                            >
                              <Send className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleVoidInvoice(invoice.id)}
                              title="Void invoice"
                            >
                              <Ban className="w-3 h-3 text-red-500" />
                            </Button>
                          </>
                        )}
                        {invoice.status === 'draft' && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleResendInvoice(invoice.id)}
                              title="Finalize and send"
                            >
                              <Send className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleVoidInvoice(invoice.id)}
                              title="Void invoice"
                            >
                              <Ban className="w-3 h-3 text-red-500" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>

      {/* Invoice Preview Modal */}
      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto"
            onClick={() => setShowPreview(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-3xl my-8"
              onClick={(e) => e.stopPropagation()}
            >
              <Card className="overflow-hidden">
                {/* Modal Header */}
                <div className="flex items-center justify-between pb-4 border-b border-gray-200 mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Invoice Preview</h3>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="secondary" onClick={handlePrint}>
                      <Printer className="w-4 h-4 mr-1" />
                      Print
                    </Button>
                    <button
                      onClick={() => setShowPreview(false)}
                      className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                    >
                      <X className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                </div>

                {/* Invoice Content */}
                <div ref={printRef} className="bg-white p-8 rounded-lg">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-10">
                    <div>
                      <div className="text-2xl font-bold text-gray-900">Domilea</div>
                      <div className="text-gray-500 text-sm mt-1">
                        Trucking Business Marketplace<br />
                        support@domilea.com<br />
                        www.domilea.com
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">INVOICE</div>
                      <div className="text-gray-500 text-sm mt-1">
                        Issued: {new Date(invoiceData.issueDate).toLocaleDateString()}<br />
                        Due: {new Date(invoiceData.dueDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {/* Bill To */}
                  <div className="mb-8">
                    <div className="text-xs text-gray-500 uppercase tracking-wide mb-2">Bill To</div>
                    <div className="text-lg font-bold text-gray-900">{invoiceData.userName || 'Customer Name'}</div>
                    <div className="text-gray-600 text-sm">
                      {invoiceData.userEmail && <div>{invoiceData.userEmail}</div>}
                      {invoiceData.userPhone && <div>{invoiceData.userPhone}</div>}
                      {invoiceData.mcNumber && <div>MC #{invoiceData.mcNumber}</div>}
                    </div>
                  </div>

                  {/* Payment Methods */}
                  <div className="mb-6">
                    <div className="text-xs text-gray-500 uppercase tracking-wide mb-2">Accepted Payment</div>
                    <div className="flex gap-2">
                      {invoiceData.paymentMethods.map(method => (
                        <span key={method} className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-xs text-gray-600">
                          {method === 'us_bank_account' ? <><Landmark className="w-3 h-3" /> Wire / ACH</> : <><CreditCard className="w-3 h-3" /> Card</>}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Line Items Table */}
                  <table className="w-full mb-8">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Description</th>
                        <th className="text-right py-3 px-4 font-semibold text-gray-700 w-24">Qty</th>
                        <th className="text-right py-3 px-4 font-semibold text-gray-700 w-32">Unit Price</th>
                        <th className="text-right py-3 px-4 font-semibold text-gray-700 w-32">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoiceData.lineItems.map((item) => (
                        <tr key={item.id} className="border-b border-gray-100">
                          <td className="py-3 px-4 text-gray-900">{item.description || '-'}</td>
                          <td className="py-3 px-4 text-right text-gray-600">{item.quantity}</td>
                          <td className="py-3 px-4 text-right text-gray-600">${item.unitPrice.toLocaleString()}</td>
                          <td className="py-3 px-4 text-right font-medium text-gray-900">
                            ${(item.quantity * item.unitPrice).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Totals */}
                  <div className="flex justify-end mb-8">
                    <div className="w-64">
                      <div className="flex justify-between py-2 text-gray-600">
                        <span>Subtotal</span>
                        <span>${subtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between py-2 text-gray-600">
                        <span>Tax</span>
                        <span>${tax.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between py-3 text-xl font-bold text-gray-900 border-t-2 border-gray-900 mt-2">
                        <span>Total Due</span>
                        <span>${total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  {invoiceData.notes && (
                    <div className="bg-gray-50 rounded-lg p-4 mb-8">
                      <div className="font-semibold text-gray-700 mb-2">Notes</div>
                      <div className="text-gray-600 text-sm whitespace-pre-wrap">{invoiceData.notes}</div>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="text-center text-gray-400 text-xs pt-8 border-t border-gray-200">
                    Thank you for your business!<br />
                    Payment is due by {new Date(invoiceData.dueDate).toLocaleDateString()}
                  </div>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AdminInvoiceGenerator
