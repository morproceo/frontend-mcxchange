import { useState } from 'react'
import { Send, Search, MessageSquare, User } from 'lucide-react'
import GlassCard from '../components/ui/GlassCard'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Textarea from '../components/ui/Textarea'

const BuyerMessagesPage = () => {
  const [selectedConversation, setSelectedConversation] = useState<string | null>('1')
  const [message, setMessage] = useState('')

  const conversations = [
    {
      id: '1',
      seller: 'TransportPro LLC',
      listingTitle: 'MC #123456 - Established Interstate Authority',
      lastMessage: 'Thank you for your interest. The authority is still available.',
      timestamp: '2 hours ago',
      unread: 2
    },
    {
      id: '2',
      seller: 'Regional Routes LLC',
      listingTitle: 'MC #789012 - Regional Carrier Authority',
      lastMessage: 'Transfer documents have been sent to your email.',
      timestamp: '1 day ago',
      unread: 0
    },
    {
      id: '3',
      seller: 'Fast Freight Inc',
      listingTitle: 'MC #901234 - Expedited Freight Authority',
      lastMessage: 'I can do $37,500 as final offer.',
      timestamp: '2 days ago',
      unread: 1
    }
  ]

  const messages = selectedConversation === '1' ? [
    {
      id: '1',
      sender: 'buyer',
      content: 'Hi, I\'m interested in your MC authority. Can you provide more details about the operating history?',
      timestamp: '10:30 AM'
    },
    {
      id: '2',
      sender: 'seller',
      content: 'Hello! Yes, this authority has been active for 5 years with clean compliance record. We have all documentation ready.',
      timestamp: '10:45 AM'
    },
    {
      id: '3',
      sender: 'buyer',
      content: 'That sounds great. I noticed you have Amazon approval. Is that transferable?',
      timestamp: '11:00 AM'
    },
    {
      id: '4',
      sender: 'seller',
      content: 'Yes, the Amazon approval transfers with the authority. I can provide the approval letter as part of the documentation.',
      timestamp: '11:15 AM'
    },
    {
      id: '5',
      sender: 'buyer',
      content: 'Perfect. I\'m ready to make an offer. Would you consider $44,000?',
      timestamp: '11:30 AM'
    },
    {
      id: '6',
      sender: 'seller',
      content: 'Thank you for your interest. The authority is still available. Let me review your offer and get back to you within 24 hours.',
      timestamp: '2:15 PM'
    }
  ] : []

  const handleSendMessage = () => {
    if (message.trim()) {
      alert(`Message sent: ${message}`)
      setMessage('')
    }
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-1">Messages</h2>
          <p className="text-white/60">Communicate with sellers</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Conversations List */}
          <div className="lg:col-span-1">
            <GlassCard>
              <div className="mb-4">
                <Input
                  placeholder="Search conversations..."
                  icon={<Search className="w-4 h-4" />}
                />
              </div>

              <div className="space-y-2">
                {conversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv.id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedConversation === conv.id
                        ? 'bg-primary-500/20 border border-primary-500/50'
                        : 'glass-subtle hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <div className="font-semibold text-sm">{conv.seller}</div>
                      {conv.unread > 0 && (
                        <span className="bg-primary-500 text-white text-xs px-2 py-0.5 rounded-full">
                          {conv.unread}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-white/60 mb-2">{conv.listingTitle}</div>
                    <div className="text-xs text-white/80 line-clamp-1">{conv.lastMessage}</div>
                    <div className="text-xs text-white/40 mt-1">{conv.timestamp}</div>
                  </button>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-2">
            {selectedConversation ? (
              <GlassCard className="flex flex-col h-[600px]">
                {/* Chat Header */}
                <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                  <div className="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center">
                    <User className="w-5 h-5 text-primary-400" />
                  </div>
                  <div>
                    <div className="font-semibold">
                      {conversations.find(c => c.id === selectedConversation)?.seller}
                    </div>
                    <div className="text-xs text-white/60">
                      {conversations.find(c => c.id === selectedConversation)?.listingTitle}
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto py-4 space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender === 'buyer' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] px-4 py-3 rounded-lg ${
                          msg.sender === 'buyer'
                            ? 'bg-primary-500 text-white'
                            : 'glass-subtle'
                        }`}
                      >
                        <p className="text-sm mb-1">{msg.content}</p>
                        <div className="text-xs opacity-70">{msg.timestamp}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="pt-4 border-t border-white/10">
                  <div className="flex gap-3">
                    <Textarea
                      placeholder="Type your message..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={2}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault()
                          handleSendMessage()
                        }
                      }}
                    />
                    <Button onClick={handleSendMessage}>
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </GlassCard>
            ) : (
              <GlassCard className="h-[600px] flex items-center justify-center">
                <div className="text-center">
                  <MessageSquare className="w-16 h-16 text-white/20 mx-auto mb-4" />
                  <p className="text-white/60">Select a conversation to start messaging</p>
                </div>
              </GlassCard>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BuyerMessagesPage
