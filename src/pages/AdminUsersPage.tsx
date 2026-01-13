import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users,
  User,
  Search,
  CheckCircle,
  Clock,
  Ban,
  Shield,
  ShieldOff,
  Eye,
  Mail,
  Phone,
  Calendar,
  ShoppingCart,
  Package,
  Crown,
  X,
  Download,
  MoreVertical,
  MessageSquare,
  DollarSign,
  Star,
  TrendingUp,
  UserPlus,
  Edit,
  Trash2,
  CreditCard,
  History,
  FileText,
  RefreshCw,
  AlertCircle,
  Coins,
  Plus,
  Minus,
  Loader2
} from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import TrustBadge from '../components/ui/TrustBadge'
import api from '../services/api'

interface UserData {
  id: string
  name: string
  email: string
  phone?: string
  role: 'BUYER' | 'SELLER' | 'ADMIN'
  status: 'ACTIVE' | 'INACTIVE' | 'BLOCKED' | 'PENDING'
  verified: boolean
  trustScore: number
  memberSince: string
  lastLoginAt?: string
  companyName?: string
  _count?: {
    listings: number
    sentOffers: number
    buyerTransactions: number
    sellerTransactions: number
  }
}

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

const AdminUsersPage = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'buyers' | 'sellers' | 'admins' | 'blocked' | 'pending'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null)
  const [userDetails, setUserDetails] = useState<any>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null)
  const [sortField, setSortField] = useState<'name' | 'memberSince' | 'lastActive' | 'trustScore'>('memberSince')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  // API state
  const [users, setUsers] = useState<UserData[]>([])
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 20, total: 0, totalPages: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    buyers: 0,
    sellers: 0,
    admins: 0,
    blocked: 0,
    pending: 0,
    verified: 0
  })

  // Credits adjustment state
  const [creditAmount, setCreditAmount] = useState<string>('')
  const [creditReason, setCreditReason] = useState<string>('')
  const [creditAdjusting, setCreditAdjusting] = useState(false)

  // Fetch users from API
  const fetchUsers = async () => {
    setLoading(true)
    setError(null)
    try {
      // Map tab to role/status filter
      let role: string | undefined
      let status: string | undefined

      switch (activeTab) {
        case 'buyers':
          role = 'BUYER'
          break
        case 'sellers':
          role = 'SELLER'
          break
        case 'admins':
          role = 'ADMIN'
          break
        case 'blocked':
          status = 'BLOCKED'
          break
        case 'pending':
          status = 'PENDING'
          break
      }

      const response = await api.getAdminUsers({
        page: pagination.page,
        limit: pagination.limit,
        search: searchTerm || undefined,
        role,
        status
      })

      setUsers(response.users)
      setPagination(response.pagination)

      // Calculate stats from all users (fetch without filters for stats)
      const allResponse = await api.getAdminUsers({ limit: 1000 })
      const allUsers = allResponse.users

      setStats({
        total: allUsers.length,
        active: allUsers.filter((u: UserData) => u.status === 'ACTIVE').length,
        buyers: allUsers.filter((u: UserData) => u.role === 'BUYER').length,
        sellers: allUsers.filter((u: UserData) => u.role === 'SELLER').length,
        admins: allUsers.filter((u: UserData) => u.role === 'ADMIN').length,
        blocked: allUsers.filter((u: UserData) => u.status === 'BLOCKED').length,
        pending: allUsers.filter((u: UserData) => u.status === 'PENDING').length,
        verified: allUsers.filter((u: UserData) => u.verified).length
      })
    } catch (err: any) {
      setError(err.message || 'Failed to fetch users')
      console.error('Failed to fetch users:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [activeTab, pagination.page, searchTerm])

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (pagination.page === 1) {
        fetchUsers()
      } else {
        setPagination(prev => ({ ...prev, page: 1 }))
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [searchTerm])

  const getTrustLevel = (score: number) => {
    if (score >= 80) return 'high'
    if (score >= 50) return 'medium'
    return 'low'
  }

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      ACTIVE: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      INACTIVE: 'bg-gray-100 text-gray-500 border-gray-200',
      BLOCKED: 'bg-red-100 text-red-700 border-red-200',
      PENDING: 'bg-amber-100 text-amber-700 border-amber-200'
    }
    return styles[status] || 'bg-gray-100 text-gray-700'
  }

  const getRoleBadge = (role: string) => {
    const styles: Record<string, string> = {
      BUYER: 'bg-purple-100 text-purple-700 border-purple-200',
      SELLER: 'bg-blue-100 text-blue-700 border-blue-200',
      ADMIN: 'bg-indigo-100 text-indigo-700 border-indigo-200'
    }
    return styles[role] || 'bg-gray-100 text-gray-700'
  }

  const handleBlockUser = async (userId: string) => {
    try {
      await api.blockUser(userId, 'Blocked by admin')
      fetchUsers()
      setShowActionMenu(null)
    } catch (err: any) {
      console.error('Failed to block user:', err)
      alert(err.message || 'Failed to block user')
    }
  }

  const handleUnblockUser = async (userId: string) => {
    try {
      await api.unblockUser(userId)
      fetchUsers()
      setShowActionMenu(null)
    } catch (err: any) {
      console.error('Failed to unblock user:', err)
      alert(err.message || 'Failed to unblock user')
    }
  }

  const handleVerifyUser = async (userId: string) => {
    try {
      await api.verifySeller(userId)
      fetchUsers()
      setShowActionMenu(null)
    } catch (err: any) {
      console.error('Failed to verify user:', err)
      alert(err.message || 'Failed to verify user')
    }
  }

  const openUserDetail = async (user: UserData) => {
    setSelectedUser(user)
    setShowDetailModal(true)
    setCreditAmount('')
    setCreditReason('')
    try {
      const details = await api.getAdminUserDetails(user.id)
      setUserDetails(details)
    } catch (err) {
      console.error('Failed to fetch user details:', err)
    }
  }

  const handleAdjustCredits = async (isAdding: boolean) => {
    if (!userDetails || !creditAmount || !creditReason.trim()) return

    const amount = parseInt(creditAmount, 10)
    if (isNaN(amount) || amount <= 0) return

    const adjustmentAmount = isAdding ? amount : -amount
    const userId = userDetails.data?.id || userDetails.id

    try {
      setCreditAdjusting(true)
      const response = await api.adjustUserCredits(userId, adjustmentAmount, creditReason.trim()) as any
      const result = response.data || response

      // Update userDetails with new credits
      setUserDetails((prev: any) => {
        if (!prev) return prev
        const data = prev.data || prev
        return {
          ...prev,
          data: {
            ...data,
            totalCredits: result.newTotal,
            usedCredits: result.usedCredits,
          },
          totalCredits: result.newTotal,
          usedCredits: result.usedCredits,
        }
      })

      // Clear inputs
      setCreditAmount('')
      setCreditReason('')
    } catch (err: any) {
      console.error('Failed to adjust credits:', err)
      alert(err.message || 'Failed to adjust credits')
    } finally {
      setCreditAdjusting(false)
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const tabs = [
    { key: 'all', label: 'All Users', count: stats.total, icon: Users },
    { key: 'buyers', label: 'Buyers', count: stats.buyers, icon: ShoppingCart },
    { key: 'sellers', label: 'Sellers', count: stats.sellers, icon: Package },
    { key: 'admins', label: 'Admins', count: stats.admins, icon: Shield },
    { key: 'blocked', label: 'Blocked', count: stats.blocked, icon: Ban },
    { key: 'pending', label: 'Pending', count: stats.pending, icon: Clock }
  ]

  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-1">View and manage all platform users</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={fetchUsers} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            <UserPlus className="w-4 h-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <p className="text-red-700">{error}</p>
          <Button variant="ghost" size="sm" onClick={fetchUsers}>
            Retry
          </Button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-gray-500" />
            <span className="text-xs text-gray-500">Total</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            <span className="text-xs text-gray-500">Active</span>
          </div>
          <p className="text-2xl font-bold text-emerald-600">{stats.active}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <ShoppingCart className="w-4 h-4 text-purple-500" />
            <span className="text-xs text-gray-500">Buyers</span>
          </div>
          <p className="text-2xl font-bold text-purple-600">{stats.buyers}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Package className="w-4 h-4 text-blue-500" />
            <span className="text-xs text-gray-500">Sellers</span>
          </div>
          <p className="text-2xl font-bold text-blue-600">{stats.sellers}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-indigo-500" />
            <span className="text-xs text-gray-500">Admins</span>
          </div>
          <p className="text-2xl font-bold text-indigo-600">{stats.admins}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4 text-teal-500" />
            <span className="text-xs text-gray-500">Verified</span>
          </div>
          <p className="text-2xl font-bold text-teal-600">{stats.verified}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-amber-500" />
            <span className="text-xs text-gray-500">Pending</span>
          </div>
          <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Ban className="w-4 h-4 text-red-500" />
            <span className="text-xs text-gray-500">Blocked</span>
          </div>
          <p className="text-2xl font-bold text-red-600">{stats.blocked}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as typeof activeTab)}
            className={`px-4 py-2 rounded-xl font-medium transition-colors flex items-center gap-2 ${
              activeTab === tab.key
                ? 'bg-black text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            <span className={`px-2 py-0.5 rounded-full text-xs ${
              activeTab === tab.key
                ? 'bg-white/20 text-white'
                : 'bg-gray-200 text-gray-600'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Search and Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search by name, email, or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={sortField}
              onChange={(e) => setSortField(e.target.value as typeof sortField)}
              className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="memberSince">Member Since</option>
              <option value="name">Name</option>
              <option value="lastActive">Last Active</option>
              <option value="trustScore">Trust Score</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-3 py-2 border border-gray-200 rounded-xl text-sm hover:bg-gray-50"
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>
      </Card>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="w-8 h-8 text-gray-400 animate-spin" />
        </div>
      )}

      {/* Users List */}
      {!loading && (
        <div className="space-y-3">
          {users.map((user) => (
            <Card key={user.id} hover className="cursor-pointer">
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                    user.status === 'BLOCKED'
                      ? 'bg-red-100 text-red-600'
                      : user.status === 'INACTIVE'
                      ? 'bg-gray-100 text-gray-400'
                      : user.status === 'PENDING'
                      ? 'bg-amber-100 text-amber-600'
                      : user.role === 'ADMIN'
                      ? 'bg-indigo-100 text-indigo-600'
                      : user.role === 'SELLER'
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-purple-100 text-purple-600'
                  }`}
                  onClick={() => openUserDetail(user)}
                >
                  {getInitials(user.name)}
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0" onClick={() => openUserDetail(user)}>
                  <div className="flex items-center gap-3 mb-1 flex-wrap">
                    <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>

                    {/* Role Badge */}
                    <span className={`px-2 py-0.5 rounded-lg text-xs font-medium border ${getRoleBadge(user.role)}`}>
                      {user.role.charAt(0) + user.role.slice(1).toLowerCase()}
                    </span>

                    {/* Status Badge */}
                    <span className={`px-2 py-0.5 rounded-lg text-xs font-medium border flex items-center gap-1 ${getStatusBadge(user.status)}`}>
                      {user.status === 'BLOCKED' && <Ban className="w-3 h-3" />}
                      {user.status === 'ACTIVE' && <CheckCircle className="w-3 h-3" />}
                      {user.status === 'PENDING' && <Clock className="w-3 h-3" />}
                      {user.status.charAt(0) + user.status.slice(1).toLowerCase()}
                    </span>

                    {/* Verified Badge */}
                    {user.verified && (
                      <span className="px-2 py-0.5 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                        <Shield className="w-3 h-3" />
                        Verified
                      </span>
                    )}
                  </div>

                  {/* Contact Info */}
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-2 flex-wrap">
                    <div className="flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      <span className="truncate max-w-[200px]">{user.email}</span>
                    </div>
                    {user.phone && (
                      <div className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        <span>{user.phone}</span>
                      </div>
                    )}
                    {user.companyName && (
                      <div className="flex items-center gap-1">
                        <Package className="w-3 h-3" />
                        <span>{user.companyName}</span>
                      </div>
                    )}
                  </div>

                  {/* Stats Row */}
                  <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>Member since {formatDate(user.memberSince)}</span>
                    </div>
                    {user.lastLoginAt && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>Last login {formatDate(user.lastLoginAt)}</span>
                      </div>
                    )}
                    {user._count && user.role === 'SELLER' && (
                      <>
                        <div className="flex items-center gap-1">
                          <Package className="w-3 h-3" />
                          <span>{user._count.listings} listings</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <ShoppingCart className="w-3 h-3" />
                          <span>{user._count.sellerTransactions} sales</span>
                        </div>
                      </>
                    )}
                    {user._count && user.role === 'BUYER' && (
                      <>
                        <div className="flex items-center gap-1">
                          <ShoppingCart className="w-3 h-3" />
                          <span>{user._count.buyerTransactions} purchases</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" />
                          <span>{user._count.sentOffers} offers</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Trust Score */}
                <div className="hidden md:block">
                  <TrustBadge
                    score={user.trustScore}
                    level={getTrustLevel(user.trustScore)}
                    verified={user.verified}
                    size="sm"
                  />
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openUserDetail(user)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        setShowActionMenu(showActionMenu === user.id ? null : user.id)
                      }}
                    >
                      <MoreVertical className="w-4 h-4" />
                    </Button>

                    {/* Action Menu */}
                    <AnimatePresence>
                      {showActionMenu === user.id && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-lg border border-gray-200 py-2 w-48 z-10"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() => openUserDetail(user)}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                          >
                            <Eye className="w-4 h-4" />
                            View Profile
                          </button>
                          <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                            <MessageSquare className="w-4 h-4" />
                            Send Message
                          </button>
                          <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                            <Edit className="w-4 h-4" />
                            Edit User
                          </button>
                          {!user.verified && user.status !== 'BLOCKED' && user.role === 'SELLER' && (
                            <button
                              onClick={() => handleVerifyUser(user.id)}
                              className="w-full px-4 py-2 text-left text-sm text-emerald-600 hover:bg-emerald-50 flex items-center gap-2"
                            >
                              <Shield className="w-4 h-4" />
                              Verify Seller
                            </button>
                          )}
                          <hr className="my-2" />
                          {user.status === 'BLOCKED' ? (
                            <button
                              onClick={() => handleUnblockUser(user.id)}
                              className="w-full px-4 py-2 text-left text-sm text-emerald-600 hover:bg-emerald-50 flex items-center gap-2"
                            >
                              <ShieldOff className="w-4 h-4" />
                              Unblock User
                            </button>
                          ) : (
                            <button
                              onClick={() => handleBlockUser(user.id)}
                              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                            >
                              <Ban className="w-4 h-4" />
                              Block User
                            </button>
                          )}
                          {user.role !== 'ADMIN' && (
                            <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                              <Trash2 className="w-4 h-4" />
                              Delete User
                            </button>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </Card>
          ))}

          {users.length === 0 && !loading && (
            <Card>
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
                <p className="text-gray-500">
                  {searchTerm ? 'Try adjusting your search' : 'No users in this category'}
                </p>
              </div>
            </Card>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page === 1}
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
              >
                Previous
              </Button>
              <span className="text-sm text-gray-600">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page === pagination.totalPages}
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      )}

      {/* User Detail Modal */}
      <AnimatePresence>
        {showDetailModal && selectedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => {
              setShowDetailModal(false)
              setUserDetails(null)
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className={`sticky top-0 p-6 rounded-t-2xl text-white ${
                selectedUser.role === 'ADMIN'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600'
                  : selectedUser.role === 'SELLER'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600'
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold">
                      {getInitials(selectedUser.name)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h2 className="text-2xl font-bold">{selectedUser.name}</h2>
                        {selectedUser.verified && (
                          <Shield className="w-5 h-5 text-emerald-300" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-white/80">
                        <span>{selectedUser.role.charAt(0) + selectedUser.role.slice(1).toLowerCase()}</span>
                        <span>•</span>
                        <span>{selectedUser.status.charAt(0) + selectedUser.status.slice(1).toLowerCase()}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowDetailModal(false)
                      setUserDetails(null)
                    }}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Trust Score */}
                <div className="flex justify-center">
                  <TrustBadge
                    score={selectedUser.trustScore}
                    level={getTrustLevel(selectedUser.trustScore)}
                    verified={selectedUser.verified}
                    size="lg"
                  />
                </div>

                {/* Contact Info */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <User className="w-5 h-5 text-indigo-600" />
                      Contact Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-700">{selectedUser.email}</span>
                      </div>
                      {selectedUser.phone && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-700">{selectedUser.phone}</span>
                        </div>
                      )}
                      {selectedUser.companyName && (
                        <div className="flex items-center gap-2 text-sm">
                          <Package className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-700">{selectedUser.companyName}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-xl">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-indigo-600" />
                      Account Details
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Member Since</span>
                        <span className="text-gray-700">{formatDate(selectedUser.memberSince)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Last Login</span>
                        <span className="text-gray-700">{formatDate(selectedUser.lastLoginAt)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Status</span>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusBadge(selectedUser.status)}`}>
                          {selectedUser.status}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Verified</span>
                        <span className={selectedUser.verified ? 'text-emerald-600' : 'text-gray-400'}>
                          {selectedUser.verified ? 'Yes' : 'No'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Activity Stats */}
                {selectedUser._count && (
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-indigo-600" />
                      Activity Statistics
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-white rounded-lg">
                        <p className="text-2xl font-bold text-gray-900">{selectedUser._count.listings}</p>
                        <p className="text-xs text-gray-500">Listings</p>
                      </div>
                      <div className="text-center p-3 bg-white rounded-lg">
                        <p className="text-2xl font-bold text-gray-900">{selectedUser._count.sentOffers}</p>
                        <p className="text-xs text-gray-500">Offers Sent</p>
                      </div>
                      <div className="text-center p-3 bg-white rounded-lg">
                        <p className="text-2xl font-bold text-gray-900">{selectedUser._count.buyerTransactions}</p>
                        <p className="text-xs text-gray-500">Purchases</p>
                      </div>
                      <div className="text-center p-3 bg-white rounded-lg">
                        <p className="text-2xl font-bold text-gray-900">{selectedUser._count.sellerTransactions}</p>
                        <p className="text-xs text-gray-500">Sales</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Credits Management */}
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Coins className="w-5 h-5 text-amber-600" />
                    Credits Management
                  </h3>

                  {/* Current Credits Display */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center p-3 bg-white rounded-lg">
                      <p className="text-2xl font-bold text-gray-900">
                        {userDetails?.data?.totalCredits ?? userDetails?.totalCredits ?? 0}
                      </p>
                      <p className="text-xs text-gray-500">Total Credits</p>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg">
                      <p className="text-2xl font-bold text-emerald-600">
                        {(userDetails?.data?.totalCredits ?? userDetails?.totalCredits ?? 0) -
                         (userDetails?.data?.usedCredits ?? userDetails?.usedCredits ?? 0)}
                      </p>
                      <p className="text-xs text-gray-500">Available</p>
                    </div>
                  </div>

                  {/* Quick Adjust */}
                  <div className="bg-white rounded-lg p-4 border border-amber-100">
                    <div className="text-xs font-medium text-gray-500 mb-2">Quick Adjust Credits</div>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="number"
                        placeholder="Amount"
                        value={creditAmount}
                        onChange={(e) => setCreditAmount(e.target.value)}
                        min="1"
                        className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Reason (required)"
                      value={creditReason}
                      onChange={(e) => setCreditReason(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 mb-2"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAdjustCredits(true)}
                        disabled={!creditAmount || !creditReason.trim() || creditAdjusting}
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm font-medium bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {creditAdjusting ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <Plus className="w-4 h-4" />
                            Add Credits
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handleAdjustCredits(false)}
                        disabled={!creditAmount || !creditReason.trim() || creditAdjusting ||
                          ((userDetails?.data?.totalCredits ?? userDetails?.totalCredits ?? 0) -
                           (userDetails?.data?.usedCredits ?? userDetails?.usedCredits ?? 0)) === 0}
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm font-medium bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {creditAdjusting ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <Minus className="w-4 h-4" />
                            Remove Credits
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                  <Button variant="outline">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                  <Button variant="outline">
                    <History className="w-4 h-4 mr-2" />
                    View Activity Log
                  </Button>
                  {!selectedUser.verified && selectedUser.status !== 'BLOCKED' && selectedUser.role === 'SELLER' && (
                    <Button
                      onClick={() => {
                        handleVerifyUser(selectedUser.id)
                        setSelectedUser({ ...selectedUser, verified: true })
                      }}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      <Shield className="w-4 h-4 mr-2" />
                      Verify Seller
                    </Button>
                  )}
                  {selectedUser.status === 'BLOCKED' ? (
                    <Button
                      onClick={() => {
                        handleUnblockUser(selectedUser.id)
                        setSelectedUser({ ...selectedUser, status: 'ACTIVE' })
                      }}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      <ShieldOff className="w-4 h-4 mr-2" />
                      Unblock User
                    </Button>
                  ) : selectedUser.role !== 'ADMIN' && (
                    <Button
                      variant="danger"
                      onClick={() => {
                        handleBlockUser(selectedUser.id)
                        setSelectedUser({ ...selectedUser, status: 'BLOCKED' })
                      }}
                    >
                      <Ban className="w-4 h-4 mr-2" />
                      Block User
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click outside to close action menu */}
      {showActionMenu && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowActionMenu(null)}
        />
      )}
    </div>
  )
}

export default AdminUsersPage
