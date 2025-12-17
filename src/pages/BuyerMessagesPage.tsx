import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Send, Search, MessageSquare, User } from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Textarea from '../components/ui/Textarea'

interface Conversation {
  id: string
  seller: string
  listingTitle: string
  lastMessage: string
  timestamp: string
  unread: number
}

interface Message {
  id: string
  sender: 'buyer' | 'seller'
  content: string
  timestamp: string
}

const BuyerMessagesPage = () => {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [message, setMessage] = useState('')

  // Empty arrays - will be populated from API
  const conversations: Conversation[] = []
  const messages: Message[] = []

  const handleSendMessage = () => {
    if (message.trim()) {
      // API call would go here
      console.log('Sending message:', message)
      setMessage('')
    }
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Messages</h2>
          <p className="text-gray-500">Communicate with sellers</p>
        </div>

        {conversations.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">No messages yet</h3>
              <p className="text-gray-500 mb-6">
                Start a conversation by contacting a seller about their listing
              </p>
              <Link to="/marketplace">
                <Button>Browse Marketplace</Button>
              </Link>
            </div>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Conversations List */}
            <div className="lg:col-span-1">
              <Card>
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
                          ? 'bg-gray-100 border border-gray-200'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-1">
                        <div className="font-semibold text-sm text-gray-900">{conv.seller}</div>
                        {conv.unread > 0 && (
                          <span className="bg-gray-900 text-white text-xs px-2 py-0.5 rounded-full">
                            {conv.unread}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 mb-2">{conv.listingTitle}</div>
                      <div className="text-xs text-gray-600 line-clamp-1">{conv.lastMessage}</div>
                      <div className="text-xs text-gray-400 mt-1">{conv.timestamp}</div>
                    </button>
                  ))}
                </div>
              </Card>
            </div>

            {/* Chat Area */}
            <div className="lg:col-span-2">
              {selectedConversation ? (
                <Card className="flex flex-col h-[600px]">
                  {/* Chat Header */}
                  <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <User className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        {conversations.find(c => c.id === selectedConversation)?.seller}
                      </div>
                      <div className="text-xs text-gray-500">
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
                              ? 'bg-gray-900 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <p className="text-sm mb-1">{msg.content}</p>
                          <div className="text-xs opacity-70">{msg.timestamp}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Message Input */}
                  <div className="pt-4 border-t border-gray-100">
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
                </Card>
              ) : (
                <Card className="h-[600px] flex items-center justify-center">
                  <div className="text-center">
                    <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Select a conversation to start messaging</p>
                  </div>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default BuyerMessagesPage
