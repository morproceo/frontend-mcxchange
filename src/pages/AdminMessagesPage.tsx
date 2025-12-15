import { useState } from 'react'
import 'framer-motion'
import {
  MessageSquare,
  Search,
  CheckCircle,
  Clock,
  AlertCircle,
  Send,
  Phone,
  Mail,
  ExternalLink,
  ChevronDown,
  Hash
} from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Textarea from '../components/ui/Textarea'
import { MCInquiry } from '../types'
import { formatDistanceToNow } from 'date-fns'

// Mock data for inquiries
const mockInquiries: MCInquiry[] = [
  {
    id: '1',
    listingId: '1',
    mcNumber: '123456',
    userId: 'user1',
    userName: 'John Smith',
    userEmail: 'john.smith@email.com',
    userPhone: '(555) 123-4567',
    message: "I'm interested in this MC authority. Can you provide more details about the transfer process and timeline? Also, are there any outstanding violations or pending issues I should know about?",
    status: 'new',
    createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 30),
    responses: []
  },
  {
    id: '2',
    listingId: '2',
    mcNumber: '789012',
    userId: 'user2',
    userName: 'Sarah Johnson',
    userEmail: 'sarah.j@trucking.com',
    userPhone: '(555) 987-6543',
    message: "What's the asking price for this authority? I'm looking to expand my fleet and this looks like a good fit. Please send me all available documentation.",
    status: 'in-progress',
    adminNotes: 'Sent initial pricing info, waiting for documents from seller',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 45),
    responses: [
      {
        id: 'r1',
        inquiryId: '2',
        adminId: 'admin1',
        adminName: 'Admin Team',
        message: "Thank you for your interest! The asking price for MC #789012 is $45,000. I'll send you the documentation package shortly.",
        createdAt: new Date(Date.now() - 1000 * 60 * 60)
      }
    ]
  },
  {
    id: '3',
    listingId: '3',
    mcNumber: '345678',
    userId: 'user3',
    userName: 'Mike Williams',
    userEmail: 'mike.w@logistics.com',
    message: 'Is this MC still available? I can close quickly if all documents are in order.',
    status: 'responded',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
    responses: [
      {
        id: 'r2',
        inquiryId: '3',
        adminId: 'admin1',
        adminName: 'Admin Team',
        message: 'Yes, this MC is still available! All documents are ready for review. Would you like to schedule a call to discuss the details?',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12)
      }
    ]
  },
  {
    id: '4',
    listingId: '4',
    mcNumber: '567890',
    userId: 'user4',
    userName: 'Emily Davis',
    userEmail: 'emily.d@carriers.com',
    userPhone: '(555) 456-7890',
    message: 'Looking for an MC with clean history. Does this one have any issues?',
    status: 'closed',
    adminNotes: 'Deal completed - MC transferred successfully',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    responses: [
      {
        id: 'r3',
        inquiryId: '4',
        adminId: 'admin1',
        adminName: 'Admin Team',
        message: 'This MC has a clean history with no violations. Let me send you the full compliance report.',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36)
      },
      {
        id: 'r4',
        inquiryId: '4',
        adminId: 'admin1',
        adminName: 'Admin Team',
        message: 'Great news! Transfer has been completed. Welcome to your new MC authority!',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24)
      }
    ]
  }
]

const statusConfig = {
  new: { label: 'New', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: AlertCircle },
  'in-progress': { label: 'In Progress', color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: Clock },
  responded: { label: 'Responded', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: CheckCircle },
  closed: { label: 'Closed', color: 'bg-gray-100 text-gray-700 border-gray-200', icon: CheckCircle }
}

const AdminMessagesPage = () => {
  const [inquiries, setInquiries] = useState<MCInquiry[]>(mockInquiries)
  const [selectedInquiry, setSelectedInquiry] = useState<MCInquiry | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [replyMessage, setReplyMessage] = useState('')
  const [showStatusDropdown, setShowStatusDropdown] = useState<string | null>(null)

  const filteredInquiries = inquiries.filter(inquiry => {
    const matchesStatus = filterStatus === 'all' || inquiry.status === filterStatus
    const matchesSearch = searchTerm === '' ||
      inquiry.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.mcNumber.includes(searchTerm) ||
      inquiry.userEmail.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const handleSendReply = () => {
    if (!selectedInquiry || !replyMessage.trim()) return

    const newResponse = {
      id: `r${Date.now()}`,
      inquiryId: selectedInquiry.id,
      adminId: 'admin1',
      adminName: 'Admin Team',
      message: replyMessage,
      createdAt: new Date()
    }

    setInquiries(prev => prev.map(inq =>
      inq.id === selectedInquiry.id
        ? {
            ...inq,
            responses: [...inq.responses, newResponse],
            status: 'responded' as const,
            updatedAt: new Date()
          }
        : inq
    ))

    setSelectedInquiry(prev => prev ? {
      ...prev,
      responses: [...prev.responses, newResponse],
      status: 'responded',
      updatedAt: new Date()
    } : null)

    setReplyMessage('')
  }

  const handleStatusChange = (inquiryId: string, newStatus: MCInquiry['status']) => {
    setInquiries(prev => prev.map(inq =>
      inq.id === inquiryId
        ? { ...inq, status: newStatus, updatedAt: new Date() }
        : inq
    ))

    if (selectedInquiry?.id === inquiryId) {
      setSelectedInquiry(prev => prev ? { ...prev, status: newStatus, updatedAt: new Date() } : null)
    }

    setShowStatusDropdown(null)
  }

  const stats = {
    total: inquiries.length,
    new: inquiries.filter(i => i.status === 'new').length,
    inProgress: inquiries.filter(i => i.status === 'in-progress').length,
    responded: inquiries.filter(i => i.status === 'responded').length
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">MC Inquiries</h1>
          <p className="text-gray-500">Manage all messages from potential buyers</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-sm text-gray-500">Total</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{stats.new}</div>
              <div className="text-sm text-gray-500">New</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{stats.inProgress}</div>
              <div className="text-sm text-gray-500">In Progress</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{stats.responded}</div>
              <div className="text-sm text-gray-500">Responded</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Inquiry List */}
        <div className="lg:col-span-1 space-y-4">
          {/* Search & Filter */}
          <Card className="p-4">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, MC#..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              {['all', 'new', 'in-progress', 'responded', 'closed'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    filterStatus === status
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {status === 'all' ? 'All' : status === 'in-progress' ? 'In Progress' : status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </Card>

          {/* Inquiry List */}
          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {filteredInquiries.length === 0 ? (
              <Card className="p-8 text-center">
                <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No inquiries found</p>
              </Card>
            ) : (
              filteredInquiries.map((inquiry) => {
                // StatusIcon available for future use
void statusConfig[inquiry.status].icon
                return (
                  <Card
                    key={inquiry.id}
                    hover
                    className={`p-4 cursor-pointer transition-all ${
                      selectedInquiry?.id === inquiry.id ? 'ring-2 ring-indigo-500 bg-indigo-50/50' : ''
                    }`}
                    onClick={() => setSelectedInquiry(inquiry)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                          <span className="text-xs font-bold text-white">{inquiry.userName.charAt(0)}</span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 text-sm">{inquiry.userName}</div>
                          <div className="text-xs text-gray-500">MC #{inquiry.mcNumber}</div>
                        </div>
                      </div>
                      <div className={`px-2 py-0.5 rounded-full text-xs font-medium border ${statusConfig[inquiry.status].color}`}>
                        {statusConfig[inquiry.status].label}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-2">{inquiry.message}</p>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>{formatDistanceToNow(inquiry.createdAt, { addSuffix: true })}</span>
                      {inquiry.responses.length > 0 && (
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" />
                          {inquiry.responses.length}
                        </span>
                      )}
                    </div>
                  </Card>
                )
              })
            )}
          </div>
        </div>

        {/* Inquiry Detail */}
        <div className="lg:col-span-2">
          {selectedInquiry ? (
            <Card className="h-full flex flex-col">
              {/* Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                      <span className="text-lg font-bold text-white">{selectedInquiry.userName.charAt(0)}</span>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">{selectedInquiry.userName}</h2>
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Hash className="w-3 h-3" />
                          MC {selectedInquiry.mcNumber}
                        </span>
                        <span>{formatDistanceToNow(selectedInquiry.createdAt, { addSuffix: true })}</span>
                      </div>
                    </div>
                  </div>

                  {/* Status Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setShowStatusDropdown(showStatusDropdown === selectedInquiry.id ? null : selectedInquiry.id)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium border flex items-center gap-2 ${statusConfig[selectedInquiry.status].color}`}
                    >
                      {statusConfig[selectedInquiry.status].label}
                      <ChevronDown className="w-4 h-4" />
                    </button>

                    {showStatusDropdown === selectedInquiry.id && (
                      <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-10">
                        {(['new', 'in-progress', 'responded', 'closed'] as const).map((status) => (
                          <button
                            key={status}
                            onClick={() => handleStatusChange(selectedInquiry.id, status)}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                          >
                            <div className={`w-2 h-2 rounded-full ${
                              status === 'new' ? 'bg-blue-500' :
                              status === 'in-progress' ? 'bg-yellow-500' :
                              status === 'responded' ? 'bg-emerald-500' : 'bg-gray-500'
                            }`} />
                            {status === 'in-progress' ? 'In Progress' : status.charAt(0).toUpperCase() + status.slice(1)}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Contact Info */}
                <div className="flex flex-wrap gap-4">
                  <a
                    href={`mailto:${selectedInquiry.userEmail}`}
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-indigo-600 transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    {selectedInquiry.userEmail}
                  </a>
                  {selectedInquiry.userPhone && (
                    <a
                      href={`tel:${selectedInquiry.userPhone}`}
                      className="flex items-center gap-2 text-sm text-gray-600 hover:text-indigo-600 transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                      {selectedInquiry.userPhone}
                    </a>
                  )}
                  <a
                    href={`/mc/${selectedInquiry.listingId}`}
                    target="_blank"
                    className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View Listing
                  </a>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 p-6 overflow-y-auto space-y-4 max-h-[400px]">
                {/* Original Inquiry */}
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-white">{selectedInquiry.userName.charAt(0)}</span>
                  </div>
                  <div className="flex-1">
                    <div className="bg-gray-100 rounded-2xl rounded-tl-none p-4">
                      <p className="text-gray-800">{selectedInquiry.message}</p>
                    </div>
                    <div className="text-xs text-gray-400 mt-1 ml-2">
                      {formatDistanceToNow(selectedInquiry.createdAt, { addSuffix: true })}
                    </div>
                  </div>
                </div>

                {/* Responses */}
                {selectedInquiry.responses.map((response) => (
                  <div key={response.id} className="flex gap-3 justify-end">
                    <div className="flex-1 flex justify-end">
                      <div className="max-w-[80%]">
                        <div className="bg-indigo-600 text-white rounded-2xl rounded-tr-none p-4">
                          <p>{response.message}</p>
                        </div>
                        <div className="text-xs text-gray-400 mt-1 mr-2 text-right">
                          {response.adminName} • {formatDistanceToNow(response.createdAt, { addSuffix: true })}
                        </div>
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-white">A</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Reply Input */}
              <div className="p-6 border-t border-gray-100">
                <div className="flex gap-3">
                  <Textarea
                    placeholder="Type your reply..."
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    rows={2}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSendReply}
                    disabled={!replyMessage.trim()}
                    className="self-end"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Send
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="h-full flex items-center justify-center p-12">
              <div className="text-center">
                <MessageSquare className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Select an Inquiry</h3>
                <p className="text-gray-500">Choose an inquiry from the list to view details and respond</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminMessagesPage
