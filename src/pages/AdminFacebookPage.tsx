import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Facebook,
  Settings,
  Search,
  RefreshCw,
  CheckCircle,
  XCircle,
  ExternalLink,
  ArrowLeft,
  Loader2,
  DollarSign,
  MapPin,
  Calendar,
  Truck,
  Share2,
  AlertCircle,
  Users
} from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Textarea from '../components/ui/Textarea'
import api from '../services/api'
import { toast } from 'react-hot-toast'

interface Listing {
  id: string
  mcNumber: string
  title: string
  askingPrice: number
  state?: string
  yearsActive?: number
  fleetSize?: number
  safetyRating?: string
  createdAt: string
}

interface FacebookConfig {
  accessTokenSet: boolean
  group1Id: string
  group1Name: string
  group2Id: string
  group2Name: string
  isConfigured: boolean
  group1Configured: boolean
  group2Configured: boolean
}

const AdminFacebookPage = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'listings' | 'settings'>('listings')
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({ total: 0, pages: 0 })

  // Config state
  const [config, setConfig] = useState<FacebookConfig | null>(null)
  const [accessToken, setAccessToken] = useState('')
  const [group1Id, setGroup1Id] = useState('')
  const [group1Name, setGroup1Name] = useState('')
  const [group2Id, setGroup2Id] = useState('')
  const [group2Name, setGroup2Name] = useState('')
  const [savingConfig, setSavingConfig] = useState(false)
  const [testingConnection, setTestingConnection] = useState(false)

  // Share modal state
  const [showShareModal, setShowShareModal] = useState(false)
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null)
  const [customMessage, setCustomMessage] = useState('')
  const [postToGroup1, setPostToGroup1] = useState(true)
  const [postToGroup2, setPostToGroup2] = useState(true)
  const [sharing, setSharing] = useState(false)

  useEffect(() => {
    loadConfig()
    loadListings()
  }, [])

  useEffect(() => {
    loadListings()
  }, [page])

  const loadConfig = async () => {
    try {
      const data = await api.getFacebookConfig()
      setConfig(data)
      setGroup1Id(data.group1Id || '')
      setGroup1Name(data.group1Name || 'Group 1')
      setGroup2Id(data.group2Id || '')
      setGroup2Name(data.group2Name || 'Group 2')
    } catch (error) {
      console.error('Failed to load Facebook config:', error)
    }
  }

  const loadListings = async () => {
    setLoading(true)
    try {
      const response = await api.getFacebookListings({
        page,
        limit: 20,
        search: searchQuery || undefined,
      })
      setListings(response.listings)
      setPagination({ total: response.pagination.total, pages: response.pagination.pages })
    } catch (error) {
      console.error('Failed to load listings:', error)
      toast.error('Failed to load listings')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    setPage(1)
    loadListings()
  }

  const handleSaveConfig = async () => {
    setSavingConfig(true)
    try {
      await api.updateFacebookConfig({
        accessToken: accessToken || undefined,
        group1Id: group1Id || undefined,
        group1Name: group1Name || undefined,
        group2Id: group2Id || undefined,
        group2Name: group2Name || undefined,
      })
      toast.success('Facebook configuration saved')
      setAccessToken('')
      loadConfig()
    } catch (error: any) {
      toast.error(error.message || 'Failed to save configuration')
    } finally {
      setSavingConfig(false)
    }
  }

  const handleTestConnection = async () => {
    setTestingConnection(true)
    try {
      const result = await api.testFacebookConnection()
      if (result.success) {
        toast.success(`Connected as: ${result.userName}`)
      } else {
        toast.error(result.message)
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to test connection')
    } finally {
      setTestingConnection(false)
    }
  }

  const openShareModal = (listing: Listing) => {
    setSelectedListing(listing)
    setCustomMessage('')
    setPostToGroup1(config?.group1Configured || false)
    setPostToGroup2(config?.group2Configured || false)
    setShowShareModal(true)
  }

  const handleShare = async () => {
    if (!selectedListing) return

    if (!postToGroup1 && !postToGroup2) {
      toast.error('Please select at least one group')
      return
    }

    setSharing(true)
    try {
      const result = await api.shareListingToFacebook(selectedListing.id, {
        customMessage: customMessage || undefined,
        postToGroup1,
        postToGroup2,
      })

      if (result.success) {
        toast.success('Listing shared to Facebook!')
        setShowShareModal(false)
      } else {
        // Show partial success/failure
        if (result.results.group1?.error) {
          toast.error(`Group 1: ${result.results.group1.error}`)
        }
        if (result.results.group2?.error) {
          toast.error(`Group 2: ${result.results.group2.error}`)
        }
        if (result.results.group1?.success || result.results.group2?.success) {
          toast.success('Posted to some groups successfully')
          setShowShareModal(false)
        }
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to share listing')
    } finally {
      setSharing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/admin')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Facebook Groups</h1>
            <p className="text-gray-500">Share listings to your Facebook groups</p>
          </div>
        </div>

        {/* Connection Status */}
        <div className="flex items-center gap-2">
          {config?.isConfigured ? (
            <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1.5 rounded-full text-sm">
              <CheckCircle className="w-4 h-4" />
              Connected
            </div>
          ) : (
            <div className="flex items-center gap-2 text-yellow-600 bg-yellow-50 px-3 py-1.5 rounded-full text-sm">
              <AlertCircle className="w-4 h-4" />
              Not Configured
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={activeTab === 'listings' ? 'primary' : 'ghost'}
          onClick={() => setActiveTab('listings')}
        >
          <Share2 className="w-4 h-4 mr-2" />
          Share Listings
        </Button>
        <Button
          variant={activeTab === 'settings' ? 'primary' : 'ghost'}
          onClick={() => setActiveTab('settings')}
        >
          <Settings className="w-4 h-4 mr-2" />
          Settings
        </Button>
      </div>

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Facebook Configuration</h2>

          <div className="space-y-6 max-w-xl">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">How to set up:</h3>
              <ol className="list-decimal list-inside text-sm text-blue-800 space-y-1">
                <li>Create a Facebook App at developers.facebook.com</li>
                <li>Get a Page Access Token with publish_to_groups permission</li>
                <li>Get your Facebook Group IDs</li>
                <li>Enter the configuration below</li>
              </ol>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Access Token {config?.accessTokenSet && <span className="text-green-600">(Set)</span>}
              </label>
              <Input
                type="password"
                placeholder={config?.accessTokenSet ? '••••••••••••••••' : 'Enter your access token'}
                value={accessToken}
                onChange={(e) => setAccessToken(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">
                Leave blank to keep existing token
              </p>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Group 1
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Group ID
                  </label>
                  <Input
                    placeholder="123456789"
                    value={group1Id}
                    onChange={(e) => setGroup1Id(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Group Name
                  </label>
                  <Input
                    placeholder="My Trucking Group"
                    value={group1Name}
                    onChange={(e) => setGroup1Name(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Group 2
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Group ID
                  </label>
                  <Input
                    placeholder="987654321"
                    value={group2Id}
                    onChange={(e) => setGroup2Id(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Group Name
                  </label>
                  <Input
                    placeholder="MC Authority Sales"
                    value={group2Name}
                    onChange={(e) => setGroup2Name(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={handleSaveConfig} disabled={savingConfig}>
                {savingConfig ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Configuration'
                )}
              </Button>

              {config?.accessTokenSet && (
                <Button
                  variant="secondary"
                  onClick={handleTestConnection}
                  disabled={testingConnection}
                >
                  {testingConnection ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Test Connection
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Listings Tab */}
      {activeTab === 'listings' && (
        <>
          {/* Not configured warning */}
          {!config?.isConfigured && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-yellow-800">Facebook not configured</h3>
                <p className="text-sm text-yellow-700">
                  Please configure your Facebook settings in the Settings tab to share listings.
                </p>
              </div>
            </div>
          )}

          {/* Group Status */}
          {config?.isConfigured && (
            <div className="flex gap-4 mb-6">
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${config.group1Configured ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                <Users className="w-4 h-4" />
                {config.group1Name}: {config.group1Configured ? 'Ready' : 'Not Set'}
              </div>
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${config.group2Configured ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                <Users className="w-4 h-4" />
                {config.group2Name}: {config.group2Configured ? 'Ready' : 'Not Set'}
              </div>
            </div>
          )}

          {/* Search */}
          <Card className="p-4 mb-6">
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search by MC number or title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  icon={<Search className="w-4 h-4" />}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <Button onClick={handleSearch}>
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
              <Button variant="ghost" onClick={loadListings}>
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </Card>

          {/* Listings Table */}
          <Card className="overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-secondary-500" />
              </div>
            ) : listings.length === 0 ? (
              <div className="text-center py-12">
                <Truck className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No active listings</h3>
                <p className="text-gray-500">Active listings will appear here for sharing.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Listing</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">MC #</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Price</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Location</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Details</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {listings.map((listing) => (
                      <motion.tr
                        key={listing.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <Truck className="w-6 h-6 text-gray-400" />
                            </div>
                            <div className="max-w-xs">
                              <div className="font-medium text-gray-900 truncate">{listing.title}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-mono text-secondary-600">{listing.mcNumber}</span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1 text-gray-900 font-medium">
                            <DollarSign className="w-4 h-4 text-gray-400" />
                            {listing.askingPrice.toLocaleString()}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          {listing.state && (
                            <div className="flex items-center gap-1 text-gray-600">
                              <MapPin className="w-4 h-4 text-gray-400" />
                              {listing.state}
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex flex-col gap-1 text-sm text-gray-500">
                            {listing.yearsActive && (
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {listing.yearsActive} yrs
                              </div>
                            )}
                            {listing.fleetSize && (
                              <div className="flex items-center gap-1">
                                <Truck className="w-3 h-3" />
                                {listing.fleetSize} trucks
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              onClick={() => openShareModal(listing)}
                              disabled={!config?.isConfigured}
                            >
                              <Facebook className="w-4 h-4 mr-1" />
                              Share
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => window.open(`/mc/${listing.id}`, '_blank')}
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-between p-4 border-t border-gray-200">
                <div className="text-sm text-gray-500">
                  Page {page} of {pagination.pages} ({pagination.total} total)
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                    disabled={page === pagination.pages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </>
      )}

      {/* Share Modal */}
      {showShareModal && selectedListing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl max-w-lg w-full"
          >
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Facebook className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Share to Facebook</h2>
                    <p className="text-sm text-gray-500">Post to your Facebook groups</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <XCircle className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto">
              {/* Compact Listing Preview */}
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <div className="flex gap-3 items-center">
                  <div className="w-14 h-14 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Truck className="w-6 h-6 text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-secondary-100 text-secondary-700 px-1.5 py-0.5 rounded text-xs font-bold">MC# ***{selectedListing.mcNumber.slice(-3)}</span>
                      <span className="text-sm font-medium text-gray-900">${selectedListing.askingPrice.toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-gray-700 truncate">{selectedListing.title}</p>
                  </div>
                </div>
              </div>

              {/* Group Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Post to Groups</label>
                <div className="space-y-2">
                  <label className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${postToGroup1 ? 'bg-blue-50 border-blue-300' : 'bg-gray-50 border-gray-200'} ${!config?.group1Configured ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <input
                      type="checkbox"
                      checked={postToGroup1}
                      onChange={(e) => setPostToGroup1(e.target.checked)}
                      disabled={!config?.group1Configured}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <Users className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium">{config?.group1Name || 'Group 1'}</span>
                    {!config?.group1Configured && <span className="text-xs text-gray-400">(Not configured)</span>}
                  </label>
                  <label className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${postToGroup2 ? 'bg-blue-50 border-blue-300' : 'bg-gray-50 border-gray-200'} ${!config?.group2Configured ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <input
                      type="checkbox"
                      checked={postToGroup2}
                      onChange={(e) => setPostToGroup2(e.target.checked)}
                      disabled={!config?.group2Configured}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <Users className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium">{config?.group2Name || 'Group 2'}</span>
                    {!config?.group2Configured && <span className="text-xs text-gray-400">(Not configured)</span>}
                  </label>
                </div>
              </div>

              {/* Custom Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Custom Message (Optional)</label>
                <Textarea
                  placeholder="Add a message..."
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  rows={2}
                />
              </div>

              {/* Compact Post Preview */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="text-xs font-medium text-blue-700 mb-2 flex items-center gap-1">
                  <Facebook className="w-3 h-3" /> Preview
                </div>
                <div className="text-xs text-gray-700 space-y-1">
                  {customMessage && <div className="italic">{customMessage}</div>}
                  <div className="font-semibold">🚛 {selectedListing.title}</div>
                  <div>📋 MC# ***{selectedListing.mcNumber.slice(-3)}</div>
                  <div>💰 Listing Price: ${selectedListing.askingPrice.toLocaleString()}</div>
                  {selectedListing.state && <div>📍 {selectedListing.state}</div>}
                  <div className="text-blue-600">🔗 View Listing</div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-gray-200 flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={() => setShowShareModal(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleShare} disabled={sharing || (!postToGroup1 && !postToGroup2)}>
                {sharing ? (
                  <><Loader2 className="w-4 h-4 mr-1 animate-spin" />Sharing...</>
                ) : (
                  <><Facebook className="w-4 h-4 mr-1" />Share</>
                )}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default AdminFacebookPage
