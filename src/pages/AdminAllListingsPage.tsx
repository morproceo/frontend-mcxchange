import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Package,
  Eye,
  Search,
  CheckCircle,
  Clock,
  XCircle,
  TrendingUp,
  Edit,
  Trash2,
  Crown,
  Mail,
  Phone,
  MapPin,
  Plus,
  X,
  Building2,
  User,
  Hash,
  Calendar,
  Truck,
  Shield,
  DollarSign,
  FileText,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  UserPlus,
  Filter,
  Download,
  Upload,
  MoreVertical,
  Globe,
  AlertTriangle,
  ShieldCheck,
  Banknote,
  Users
} from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import Textarea from '../components/ui/Textarea'
import TrustBadge from '../components/ui/TrustBadge'
import { getTrustLevel } from '../utils/helpers'

interface Listing {
  id: string
  mcNumber: string
  dotNumber: string
  title: string
  legalName: string
  dbaName: string
  price: number
  status: 'active' | 'pending' | 'sold' | 'rejected' | 'draft'
  seller: {
    id: string
    name: string
    email: string
    phone: string
    trustScore: number
    verified: boolean
  }
  views: number
  saves: number
  offers: number
  createdAt: string
  updatedAt: string
  soldDate?: string
  rejectedDate?: string
  rejectionReason?: string
  yearsActive: number
  fleetSize: number
  totalDrivers: number
  safetyRating: string
  state: string
  city: string
  isPremium: boolean
  amazonStatus: string
  amazonRelayScore: string | null
  highwaySetup: boolean
  sellingWithEmail: boolean
  sellingWithPhone: boolean
  insuranceOnFile: boolean
  bipdCoverage: number
  cargoCoverage: number
  cargoTypes: string[]
  assignedAdmin?: string
}

interface User {
  id: string
  name: string
  email: string
  role: 'seller' | 'buyer' | 'admin'
}

const AdminAllListingsPage = () => {
  const navigate = useNavigate()
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'pending' | 'rejected' | 'sold' | 'premium' | 'draft'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table')
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [sortField, setSortField] = useState<'mcNumber' | 'price' | 'createdAt' | 'views'>('createdAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  // Mock users for assignment
  const [users] = useState<User[]>([
    { id: 'admin-1', name: 'Admin (Me)', email: 'admin@domilea.com', role: 'admin' },
    { id: 'seller-1', name: 'John Smith', email: 'john@email.com', role: 'seller' },
    { id: 'seller-2', name: 'Sarah Johnson', email: 'sarah@email.com', role: 'seller' },
    { id: 'seller-3', name: 'Mike Wilson', email: 'mike@email.com', role: 'seller' },
    { id: 'seller-4', name: 'Emily Davis', email: 'emily@email.com', role: 'seller' },
  ])

  // New listing form state
  const [newListing, setNewListing] = useState({
    mcNumber: '',
    dotNumber: '',
    legalName: '',
    dbaName: '',
    title: '',
    price: '',
    state: '',
    city: '',
    yearsActive: '',
    fleetSize: '',
    totalDrivers: '',
    safetyRating: 'satisfactory',
    amazonStatus: 'none',
    amazonRelayScore: '',
    highwaySetup: false,
    isPremium: false,
    sellingWithEmail: true,
    sellingWithPhone: true,
    bipdCoverage: '',
    cargoCoverage: '',
    cargoTypes: '',
    assignedTo: '',
    notes: ''
  })

  const [allListings, setAllListings] = useState<Listing[]>([
    {
      id: '1',
      mcNumber: '123456',
      dotNumber: '1234567',
      title: 'Established Interstate Authority - Clean Record',
      legalName: 'TransportPro LLC',
      dbaName: 'Transport Pro',
      price: 45000,
      status: 'active',
      seller: {
        id: 'seller-1',
        name: 'John Smith',
        email: 'john@transportpro.com',
        phone: '(555) 123-4567',
        trustScore: 85,
        verified: true
      },
      views: 234,
      saves: 12,
      offers: 3,
      createdAt: '2024-01-05',
      updatedAt: '2024-01-10',
      yearsActive: 5,
      fleetSize: 12,
      totalDrivers: 15,
      safetyRating: 'Satisfactory',
      state: 'TX',
      city: 'Houston',
      isPremium: false,
      amazonStatus: 'active',
      amazonRelayScore: 'A',
      highwaySetup: true,
      sellingWithEmail: true,
      sellingWithPhone: true,
      insuranceOnFile: true,
      bipdCoverage: 1000000,
      cargoCoverage: 100000,
      cargoTypes: ['General Freight', 'Dry Van', 'Refrigerated']
    },
    {
      id: '2',
      mcNumber: '789012',
      dotNumber: '7890123',
      title: 'Regional Carrier Authority - Excellent Safety',
      legalName: 'Regional Routes LLC',
      dbaName: 'Regional Routes',
      price: 32000,
      status: 'sold',
      seller: {
        id: 'seller-2',
        name: 'Sarah Johnson',
        email: 'admin@regional.com',
        phone: '(555) 234-5678',
        trustScore: 78,
        verified: true
      },
      views: 189,
      saves: 8,
      offers: 5,
      createdAt: '2023-12-28',
      updatedAt: '2024-01-09',
      soldDate: '2024-01-09',
      yearsActive: 3,
      fleetSize: 8,
      totalDrivers: 10,
      safetyRating: 'Satisfactory',
      state: 'IL',
      city: 'Chicago',
      isPremium: false,
      amazonStatus: 'active',
      amazonRelayScore: 'B',
      highwaySetup: true,
      sellingWithEmail: true,
      sellingWithPhone: false,
      insuranceOnFile: true,
      bipdCoverage: 750000,
      cargoCoverage: 100000,
      cargoTypes: ['General Freight', 'Dry Van']
    },
    {
      id: '3',
      mcNumber: '345678',
      dotNumber: '3456789',
      title: 'Premium Long Haul Authority - Amazon Approved',
      legalName: 'Highway Carriers Inc',
      dbaName: 'Highway Carriers',
      price: 82000,
      status: 'active',
      seller: {
        id: 'seller-3',
        name: 'Mike Wilson',
        email: 'sales@highway.com',
        phone: '(555) 345-6789',
        trustScore: 92,
        verified: true
      },
      views: 456,
      saves: 28,
      offers: 8,
      createdAt: '2023-12-15',
      updatedAt: '2024-01-08',
      yearsActive: 7,
      fleetSize: 15,
      totalDrivers: 20,
      safetyRating: 'Satisfactory',
      state: 'CA',
      city: 'Los Angeles',
      isPremium: true,
      amazonStatus: 'active',
      amazonRelayScore: 'A',
      highwaySetup: true,
      sellingWithEmail: true,
      sellingWithPhone: true,
      insuranceOnFile: true,
      bipdCoverage: 1000000,
      cargoCoverage: 250000,
      cargoTypes: ['General Freight', 'Refrigerated', 'Intermodal']
    },
    {
      id: '4',
      mcNumber: '901234',
      dotNumber: '9012345',
      title: 'Expedited Freight Authority',
      legalName: 'Fast Freight Inc',
      dbaName: 'Fast Freight',
      price: 38000,
      status: 'pending',
      seller: {
        id: 'seller-4',
        name: 'Emily Davis',
        email: 'info@fastfreight.com',
        phone: '(555) 456-7890',
        trustScore: 81,
        verified: true
      },
      views: 45,
      saves: 2,
      offers: 0,
      createdAt: '2024-01-10',
      updatedAt: '2024-01-10',
      yearsActive: 4,
      fleetSize: 6,
      totalDrivers: 8,
      safetyRating: 'Satisfactory',
      state: 'FL',
      city: 'Miami',
      isPremium: false,
      amazonStatus: 'pending',
      amazonRelayScore: null,
      highwaySetup: false,
      sellingWithEmail: true,
      sellingWithPhone: true,
      insuranceOnFile: true,
      bipdCoverage: 750000,
      cargoCoverage: 100000,
      cargoTypes: ['General Freight', 'Expedited']
    },
    {
      id: '5',
      mcNumber: '456789',
      dotNumber: '4567890',
      title: 'Premium Specialized Hauling Authority',
      legalName: 'Specialty Transport LLC',
      dbaName: 'Specialty Transport',
      price: 78000,
      status: 'active',
      seller: {
        id: 'seller-1',
        name: 'John Smith',
        email: 'contact@specialty.com',
        phone: '(555) 567-8901',
        trustScore: 88,
        verified: true
      },
      views: 312,
      saves: 19,
      offers: 6,
      createdAt: '2024-01-02',
      updatedAt: '2024-01-07',
      yearsActive: 6,
      fleetSize: 10,
      totalDrivers: 12,
      safetyRating: 'Satisfactory',
      state: 'OH',
      city: 'Columbus',
      isPremium: true,
      amazonStatus: 'none',
      amazonRelayScore: null,
      highwaySetup: true,
      sellingWithEmail: true,
      sellingWithPhone: true,
      insuranceOnFile: true,
      bipdCoverage: 1000000,
      cargoCoverage: 500000,
      cargoTypes: ['Heavy Haul', 'Oversized', 'Flatbed']
    },
    {
      id: '6',
      mcNumber: '998877',
      dotNumber: '9988770',
      title: 'Hazmat Certified Authority',
      legalName: 'Safety First Transport LLC',
      dbaName: 'Safety First',
      price: 55000,
      status: 'rejected',
      seller: {
        id: 'seller-2',
        name: 'Sarah Johnson',
        email: 'contact@safetyfirst.com',
        phone: '(555) 678-9012',
        trustScore: 62,
        verified: false
      },
      views: 34,
      saves: 1,
      offers: 0,
      createdAt: '2024-01-08',
      updatedAt: '2024-01-09',
      rejectedDate: '2024-01-09',
      rejectionReason: 'Incomplete documentation - missing insurance certificates',
      yearsActive: 2,
      fleetSize: 5,
      totalDrivers: 6,
      safetyRating: 'Conditional',
      state: 'NV',
      city: 'Las Vegas',
      isPremium: false,
      amazonStatus: 'suspended',
      amazonRelayScore: 'D',
      highwaySetup: false,
      sellingWithEmail: false,
      sellingWithPhone: false,
      insuranceOnFile: false,
      bipdCoverage: 0,
      cargoCoverage: 0,
      cargoTypes: ['Hazmat', 'Tanker']
    },
    {
      id: '7',
      mcNumber: '112233',
      dotNumber: '1122334',
      title: 'Reefer Transport Authority',
      legalName: 'Cold Chain Logistics Inc',
      dbaName: 'Cold Chain',
      price: 47000,
      status: 'active',
      seller: {
        id: 'seller-3',
        name: 'Mike Wilson',
        email: 'admin@coldchain.com',
        phone: '(555) 789-0123',
        trustScore: 86,
        verified: true
      },
      views: 298,
      saves: 16,
      offers: 7,
      createdAt: '2023-12-10',
      updatedAt: '2024-01-05',
      yearsActive: 5,
      fleetSize: 11,
      totalDrivers: 14,
      safetyRating: 'Satisfactory',
      state: 'CO',
      city: 'Denver',
      isPremium: false,
      amazonStatus: 'active',
      amazonRelayScore: 'B',
      highwaySetup: true,
      sellingWithEmail: true,
      sellingWithPhone: true,
      insuranceOnFile: true,
      bipdCoverage: 1000000,
      cargoCoverage: 150000,
      cargoTypes: ['Refrigerated', 'Temperature Controlled']
    },
    {
      id: '8',
      mcNumber: '556677',
      dotNumber: '5566778',
      title: 'Draft - New Authority Listing',
      legalName: 'Pending Verification LLC',
      dbaName: '',
      price: 40000,
      status: 'draft',
      seller: {
        id: 'admin-1',
        name: 'Admin (Me)',
        email: 'admin@domilea.com',
        phone: '(555) 000-0000',
        trustScore: 100,
        verified: true
      },
      views: 0,
      saves: 0,
      offers: 0,
      createdAt: '2024-01-11',
      updatedAt: '2024-01-11',
      yearsActive: 3,
      fleetSize: 5,
      totalDrivers: 6,
      safetyRating: 'Satisfactory',
      state: 'AZ',
      city: 'Phoenix',
      isPremium: false,
      amazonStatus: 'none',
      amazonRelayScore: null,
      highwaySetup: false,
      sellingWithEmail: false,
      sellingWithPhone: false,
      insuranceOnFile: true,
      bipdCoverage: 750000,
      cargoCoverage: 100000,
      cargoTypes: ['General Freight'],
      assignedAdmin: 'admin-1'
    }
  ])

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('desc')
    }
  }

  const filteredListings = allListings
    .filter(listing => {
      let matchesFilter = false
      if (activeFilter === 'all') {
        matchesFilter = true
      } else if (activeFilter === 'premium') {
        matchesFilter = listing.isPremium
      } else {
        matchesFilter = listing.status === activeFilter
      }
      const matchesSearch =
        listing.mcNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.dotNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.legalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.seller.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.city.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesFilter && matchesSearch
    })
    .sort((a, b) => {
      let comparison = 0
      switch (sortField) {
        case 'mcNumber':
          comparison = a.mcNumber.localeCompare(b.mcNumber)
          break
        case 'price':
          comparison = a.price - b.price
          break
        case 'createdAt':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          break
        case 'views':
          comparison = a.views - b.views
          break
      }
      return sortOrder === 'asc' ? comparison : -comparison
    })

  const stats = [
    { label: 'Total', value: allListings.length, color: 'bg-gray-100 text-gray-700' },
    { label: 'Active', value: allListings.filter(l => l.status === 'active').length, color: 'bg-green-100 text-green-700' },
    { label: 'Pending', value: allListings.filter(l => l.status === 'pending').length, color: 'bg-yellow-100 text-yellow-700' },
    { label: 'Sold', value: allListings.filter(l => l.status === 'sold').length, color: 'bg-blue-100 text-blue-700' },
    { label: 'Rejected', value: allListings.filter(l => l.status === 'rejected').length, color: 'bg-red-100 text-red-700' },
    { label: 'Draft', value: allListings.filter(l => l.status === 'draft').length, color: 'bg-purple-100 text-purple-700' },
    { label: 'Premium', value: allListings.filter(l => l.isPremium).length, color: 'bg-amber-100 text-amber-700' },
  ]

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      active: 'bg-green-100 text-green-700',
      pending: 'bg-yellow-100 text-yellow-700',
      sold: 'bg-blue-100 text-blue-700',
      rejected: 'bg-red-100 text-red-700',
      draft: 'bg-purple-100 text-purple-700'
    }
    return styles[status] || 'bg-gray-100 text-gray-700'
  }

  const openDetailModal = (listing: Listing) => {
    setSelectedListing(listing)
    setShowDetailModal(true)
  }

  const handleAddListing = () => {
    const newId = `new-${Date.now()}`
    const listing: Listing = {
      id: newId,
      mcNumber: newListing.mcNumber,
      dotNumber: newListing.dotNumber,
      title: newListing.title || `${newListing.legalName} - MC Authority`,
      legalName: newListing.legalName,
      dbaName: newListing.dbaName,
      price: parseInt(newListing.price) || 0,
      status: 'draft',
      seller: users.find(u => u.id === newListing.assignedTo) ? {
        id: newListing.assignedTo,
        name: users.find(u => u.id === newListing.assignedTo)!.name,
        email: users.find(u => u.id === newListing.assignedTo)!.email,
        phone: '',
        trustScore: 100,
        verified: true
      } : {
        id: 'admin-1',
        name: 'Admin (Me)',
        email: 'admin@domilea.com',
        phone: '',
        trustScore: 100,
        verified: true
      },
      views: 0,
      saves: 0,
      offers: 0,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      yearsActive: parseInt(newListing.yearsActive) || 0,
      fleetSize: parseInt(newListing.fleetSize) || 0,
      totalDrivers: parseInt(newListing.totalDrivers) || 0,
      safetyRating: newListing.safetyRating,
      state: newListing.state,
      city: newListing.city,
      isPremium: newListing.isPremium,
      amazonStatus: newListing.amazonStatus,
      amazonRelayScore: newListing.amazonRelayScore || null,
      highwaySetup: newListing.highwaySetup,
      sellingWithEmail: newListing.sellingWithEmail,
      sellingWithPhone: newListing.sellingWithPhone,
      insuranceOnFile: true,
      bipdCoverage: parseInt(newListing.bipdCoverage) || 0,
      cargoCoverage: parseInt(newListing.cargoCoverage) || 0,
      cargoTypes: newListing.cargoTypes.split(',').map(t => t.trim()).filter(Boolean),
      assignedAdmin: newListing.assignedTo || 'admin-1'
    }

    setAllListings([listing, ...allListings])
    setShowAddModal(false)
    setNewListing({
      mcNumber: '',
      dotNumber: '',
      legalName: '',
      dbaName: '',
      title: '',
      price: '',
      state: '',
      city: '',
      yearsActive: '',
      fleetSize: '',
      totalDrivers: '',
      safetyRating: 'satisfactory',
      amazonStatus: 'none',
      amazonRelayScore: '',
      highwaySetup: false,
      isPremium: false,
      sellingWithEmail: true,
      sellingWithPhone: true,
      bipdCoverage: '',
      cargoCoverage: '',
      cargoTypes: '',
      assignedTo: '',
      notes: ''
    })
  }

  const SortIcon = ({ field }: { field: typeof sortField }) => {
    if (sortField !== field) return <ChevronDown className="w-4 h-4 text-gray-400" />
    return sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
  }

  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">All Listings</h1>
          <p className="text-gray-600 mt-1">View and manage all MC authority listings</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => setViewMode(viewMode === 'table' ? 'cards' : 'table')}>
            {viewMode === 'table' ? 'Card View' : 'Table View'}
          </Button>
          <Button onClick={() => setShowAddModal(true)} className="bg-indigo-600 hover:bg-indigo-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Listing
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="flex flex-wrap gap-2">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`px-4 py-2 rounded-lg ${stat.color} flex items-center gap-2`}
          >
            <span className="font-bold">{stat.value}</span>
            <span className="text-sm">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search by MC, DOT, company name, seller, location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {(['all', 'active', 'pending', 'sold', 'rejected', 'draft', 'premium'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${
                  activeFilter === filter
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filter === 'premium' && <Crown className="w-3 h-3 inline mr-1" />}
                {filter}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Table View */}
      {viewMode === 'table' && (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('mcNumber')}
                  >
                    <div className="flex items-center gap-1">
                      MC/DOT <SortIcon field="mcNumber" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Owner/Seller
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Location
                  </th>
                  <th
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('price')}
                  >
                    <div className="flex items-center gap-1">
                      Price <SortIcon field="price" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('views')}
                  >
                    <div className="flex items-center gap-1">
                      Stats <SortIcon field="views" />
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('createdAt')}
                  >
                    <div className="flex items-center gap-1">
                      Created <SortIcon field="createdAt" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredListings.map((listing) => (
                  <tr
                    key={listing.id}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => openDetailModal(listing)}
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        {listing.isPremium && <Crown className="w-4 h-4 text-amber-500" />}
                        <div>
                          <p className="font-semibold text-gray-900">MC-{listing.mcNumber}</p>
                          <p className="text-xs text-gray-500">DOT-{listing.dotNumber}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-medium text-gray-900">{listing.legalName}</p>
                      {listing.dbaName && (
                        <p className="text-xs text-gray-500">DBA: {listing.dbaName}</p>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                          <User className="w-4 h-4 text-gray-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{listing.seller.name}</p>
                          <p className="text-xs text-gray-500">{listing.seller.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm text-gray-900">{listing.city}, {listing.state}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-semibold text-gray-900">
                        {listing.isPremium ? 'Contact' : `$${listing.price.toLocaleString()}`}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusBadge(listing.status)}`}>
                        {listing.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-xs text-gray-500">
                        <p>{listing.views} views</p>
                        <p>{listing.offers} offers</p>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">
                      {new Date(listing.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => openDetailModal(listing)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4 text-gray-600" />
                        </button>
                        <button
                          onClick={() => navigate(`/mc/${listing.id}`)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <ExternalLink className="w-4 h-4 text-gray-600" />
                        </button>
                        {listing.status === 'pending' && (
                          <button
                            onClick={() => navigate(`/admin/review/${listing.id}`)}
                            className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                          >
                            <CheckCircle className="w-4 h-4 text-blue-600" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredListings.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No listings found</h3>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </div>
          )}
        </Card>
      )}

      {/* Card View */}
      {viewMode === 'cards' && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredListings.map((listing) => (
            <Card
              key={listing.id}
              hover
              className="cursor-pointer"
              onClick={() => openDetailModal(listing)}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    {listing.isPremium && <Crown className="w-4 h-4 text-amber-500" />}
                    <h3 className="font-semibold text-gray-900">MC-{listing.mcNumber}</h3>
                  </div>
                  <p className="text-xs text-gray-500">DOT-{listing.dotNumber}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusBadge(listing.status)}`}>
                  {listing.status}
                </span>
              </div>

              <p className="font-medium text-gray-900 mb-1">{listing.legalName}</p>
              <p className="text-sm text-gray-500 mb-3">{listing.city}, {listing.state}</p>

              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                  <User className="w-3 h-3 text-gray-600" />
                </div>
                <span className="text-sm text-gray-600">{listing.seller.name}</span>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <p className="text-lg font-bold text-gray-900">
                  {listing.isPremium ? 'Contact' : `$${listing.price.toLocaleString()}`}
                </p>
                <div className="text-xs text-gray-500">
                  {listing.views} views | {listing.offers} offers
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      <AnimatePresence>
        {showDetailModal && selectedListing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowDetailModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-2xl">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      {selectedListing.isPremium && (
                        <span className="px-2 py-1 bg-amber-400 text-amber-900 rounded text-xs font-bold flex items-center gap-1">
                          <Crown className="w-3 h-3" /> PREMIUM
                        </span>
                      )}
                      <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${
                        selectedListing.status === 'active' ? 'bg-green-400 text-green-900' :
                        selectedListing.status === 'pending' ? 'bg-yellow-400 text-yellow-900' :
                        selectedListing.status === 'sold' ? 'bg-blue-400 text-blue-900' :
                        selectedListing.status === 'draft' ? 'bg-purple-400 text-purple-900' :
                        'bg-red-400 text-red-900'
                      }`}>
                        {selectedListing.status}
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold">MC-{selectedListing.mcNumber}</h2>
                    <p className="text-indigo-200">DOT-{selectedListing.dotNumber}</p>
                  </div>
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Company Info */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-indigo-600" />
                      Company Information
                    </h3>
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs text-gray-500">Legal Name</p>
                        <p className="font-medium text-gray-900">{selectedListing.legalName}</p>
                      </div>
                      {selectedListing.dbaName && (
                        <div>
                          <p className="text-xs text-gray-500">DBA</p>
                          <p className="font-medium text-gray-900">{selectedListing.dbaName}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-xs text-gray-500">Location</p>
                        <p className="font-medium text-gray-900">{selectedListing.city}, {selectedListing.state}</p>
                      </div>
                      <div className="grid grid-cols-3 gap-2 pt-2">
                        <div className="text-center p-2 bg-white rounded-lg">
                          <p className="text-lg font-bold text-gray-900">{selectedListing.yearsActive}</p>
                          <p className="text-xs text-gray-500">Years</p>
                        </div>
                        <div className="text-center p-2 bg-white rounded-lg">
                          <p className="text-lg font-bold text-gray-900">{selectedListing.fleetSize}</p>
                          <p className="text-xs text-gray-500">Trucks</p>
                        </div>
                        <div className="text-center p-2 bg-white rounded-lg">
                          <p className="text-lg font-bold text-gray-900">{selectedListing.totalDrivers}</p>
                          <p className="text-xs text-gray-500">Drivers</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-xl">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <User className="w-5 h-5 text-indigo-600" />
                      Owner / Seller
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                          <User className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{selectedListing.seller.name}</p>
                          <div className="flex items-center gap-1">
                            <TrustBadge
                              score={selectedListing.seller.trustScore}
                              level={getTrustLevel(selectedListing.seller.trustScore)}
                              verified={selectedListing.seller.verified}
                              size="sm"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-600 flex items-center gap-2">
                          <Mail className="w-4 h-4" /> {selectedListing.seller.email}
                        </p>
                        {selectedListing.seller.phone && (
                          <p className="text-sm text-gray-600 flex items-center gap-2">
                            <Phone className="w-4 h-4" /> {selectedListing.seller.phone}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Safety & Compliance */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-indigo-600" />
                      Safety & Compliance
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Safety Rating</span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          selectedListing.safetyRating === 'Satisfactory' ? 'bg-green-100 text-green-700' :
                          selectedListing.safetyRating === 'Conditional' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {selectedListing.safetyRating}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Insurance on File</span>
                        {selectedListing.insuranceOnFile ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-500" />
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">BIPD Coverage</span>
                        <span className="font-medium">${selectedListing.bipdCoverage.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Cargo Coverage</span>
                        <span className="font-medium">${selectedListing.cargoCoverage.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-xl">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Globe className="w-5 h-5 text-indigo-600" />
                      Platform Integrations
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Amazon Relay</span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          selectedListing.amazonStatus === 'active' ? 'bg-green-100 text-green-700' :
                          selectedListing.amazonStatus === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          selectedListing.amazonStatus === 'suspended' ? 'bg-red-100 text-red-700' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {selectedListing.amazonStatus === 'active' && selectedListing.amazonRelayScore
                            ? `Active (${selectedListing.amazonRelayScore})`
                            : selectedListing.amazonStatus.charAt(0).toUpperCase() + selectedListing.amazonStatus.slice(1)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Highway Setup</span>
                        {selectedListing.highwaySetup ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <XCircle className="w-5 h-5 text-gray-300" />
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Selling with Email</span>
                        {selectedListing.sellingWithEmail ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <XCircle className="w-5 h-5 text-gray-300" />
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Selling with Phone</span>
                        {selectedListing.sellingWithPhone ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <XCircle className="w-5 h-5 text-gray-300" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cargo Types */}
                {selectedListing.cargoTypes.length > 0 && (
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Truck className="w-5 h-5 text-indigo-600" />
                      Cargo Types
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedListing.cargoTypes.map((cargo, i) => (
                        <span key={i} className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-sm text-gray-700">
                          {cargo}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Financial & Stats */}
                <div className="p-4 bg-gray-50 rounded-xl">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-indigo-600" />
                    Pricing & Statistics
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-white rounded-lg">
                      <p className="text-2xl font-bold text-gray-900">
                        {selectedListing.isPremium ? 'Contact' : `$${selectedListing.price.toLocaleString()}`}
                      </p>
                      <p className="text-xs text-gray-500">Asking Price</p>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg">
                      <p className="text-2xl font-bold text-gray-900">{selectedListing.views}</p>
                      <p className="text-xs text-gray-500">Views</p>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg">
                      <p className="text-2xl font-bold text-gray-900">{selectedListing.saves}</p>
                      <p className="text-xs text-gray-500">Saves</p>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg">
                      <p className="text-2xl font-bold text-gray-900">{selectedListing.offers}</p>
                      <p className="text-xs text-gray-500">Offers</p>
                    </div>
                  </div>
                </div>

                {/* Rejection Reason */}
                {selectedListing.rejectionReason && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                    <h3 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5" />
                      Rejection Reason
                    </h3>
                    <p className="text-red-700">{selectedListing.rejectionReason}</p>
                    {selectedListing.rejectedDate && (
                      <p className="text-sm text-red-600 mt-2">
                        Rejected on {new Date(selectedListing.rejectedDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                  <Button onClick={() => navigate(`/mc/${selectedListing.id}`)}>
                    <Eye className="w-4 h-4 mr-2" />
                    View Public Page
                  </Button>
                  {selectedListing.status === 'pending' && (
                    <Button
                      onClick={() => navigate(`/admin/review/${selectedListing.id}`)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Review Listing
                    </Button>
                  )}
                  <Button variant="outline">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="outline" className="text-red-600 hover:bg-red-50">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Listing Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                      <Plus className="w-6 h-6" />
                      Add New Listing
                    </h2>
                    <p className="text-indigo-200 mt-1">Manually create a listing and assign to a user</p>
                  </div>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* MC/DOT Info */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Hash className="w-5 h-5 text-indigo-600" />
                    Authority Numbers
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">MC Number *</label>
                      <Input
                        placeholder="123456"
                        value={newListing.mcNumber}
                        onChange={(e) => setNewListing({ ...newListing, mcNumber: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">DOT Number *</label>
                      <Input
                        placeholder="1234567"
                        value={newListing.dotNumber}
                        onChange={(e) => setNewListing({ ...newListing, dotNumber: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* Company Info */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-indigo-600" />
                    Company Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Legal Name *</label>
                      <Input
                        placeholder="Company LLC"
                        value={newListing.legalName}
                        onChange={(e) => setNewListing({ ...newListing, legalName: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">DBA Name</label>
                      <Input
                        placeholder="Trading As"
                        value={newListing.dbaName}
                        onChange={(e) => setNewListing({ ...newListing, dbaName: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                      <Input
                        placeholder="Houston"
                        value={newListing.city}
                        onChange={(e) => setNewListing({ ...newListing, city: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                      <Input
                        placeholder="TX"
                        value={newListing.state}
                        onChange={(e) => setNewListing({ ...newListing, state: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* Listing Info */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-indigo-600" />
                    Listing Details
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Listing Title</label>
                      <Input
                        placeholder="Interstate Carrier Authority - Clean Record"
                        value={newListing.title}
                        onChange={(e) => setNewListing({ ...newListing, title: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Asking Price ($)</label>
                      <Input
                        type="number"
                        placeholder="45000"
                        value={newListing.price}
                        onChange={(e) => setNewListing({ ...newListing, price: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Years Active</label>
                      <Input
                        type="number"
                        placeholder="5"
                        value={newListing.yearsActive}
                        onChange={(e) => setNewListing({ ...newListing, yearsActive: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Fleet Size</label>
                      <Input
                        type="number"
                        placeholder="10"
                        value={newListing.fleetSize}
                        onChange={(e) => setNewListing({ ...newListing, fleetSize: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Total Drivers</label>
                      <Input
                        type="number"
                        placeholder="12"
                        value={newListing.totalDrivers}
                        onChange={(e) => setNewListing({ ...newListing, totalDrivers: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* Safety & Insurance */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-indigo-600" />
                    Safety & Insurance
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Safety Rating</label>
                      <select
                        value={newListing.safetyRating}
                        onChange={(e) => setNewListing({ ...newListing, safetyRating: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="satisfactory">Satisfactory</option>
                        <option value="conditional">Conditional</option>
                        <option value="unsatisfactory">Unsatisfactory</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Amazon Status</label>
                      <select
                        value={newListing.amazonStatus}
                        onChange={(e) => setNewListing({ ...newListing, amazonStatus: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="none">None</option>
                        <option value="pending">Pending</option>
                        <option value="active">Active</option>
                        <option value="suspended">Suspended</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">BIPD Coverage ($)</label>
                      <Input
                        type="number"
                        placeholder="1000000"
                        value={newListing.bipdCoverage}
                        onChange={(e) => setNewListing({ ...newListing, bipdCoverage: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Cargo Coverage ($)</label>
                      <Input
                        type="number"
                        placeholder="100000"
                        value={newListing.cargoCoverage}
                        onChange={(e) => setNewListing({ ...newListing, cargoCoverage: e.target.value })}
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Cargo Types (comma separated)</label>
                      <Input
                        placeholder="General Freight, Dry Van, Refrigerated"
                        value={newListing.cargoTypes}
                        onChange={(e) => setNewListing({ ...newListing, cargoTypes: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* Options */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Options</h3>
                  <div className="flex flex-wrap gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newListing.isPremium}
                        onChange={(e) => setNewListing({ ...newListing, isPremium: e.target.checked })}
                        className="rounded text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-sm text-gray-700">Premium Listing</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newListing.highwaySetup}
                        onChange={(e) => setNewListing({ ...newListing, highwaySetup: e.target.checked })}
                        className="rounded text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-sm text-gray-700">Highway Setup</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newListing.sellingWithEmail}
                        onChange={(e) => setNewListing({ ...newListing, sellingWithEmail: e.target.checked })}
                        className="rounded text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-sm text-gray-700">Includes Email</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newListing.sellingWithPhone}
                        onChange={(e) => setNewListing({ ...newListing, sellingWithPhone: e.target.checked })}
                        className="rounded text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-sm text-gray-700">Includes Phone</span>
                    </label>
                  </div>
                </div>

                {/* Assignment */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <UserPlus className="w-5 h-5 text-indigo-600" />
                    Assign Listing
                  </h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Assign to User</label>
                    <select
                      value={newListing.assignedTo}
                      onChange={(e) => setNewListing({ ...newListing, assignedTo: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">Assign to myself (Admin)</option>
                      {users.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.name} ({user.email}) - {user.role}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      The listing will be created as a draft and assigned to the selected user
                    </p>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Admin Notes</label>
                  <Textarea
                    placeholder="Any internal notes about this listing..."
                    value={newListing.notes}
                    onChange={(e) => setNewListing({ ...newListing, notes: e.target.value })}
                    rows={3}
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <Button
                    onClick={handleAddListing}
                    disabled={!newListing.mcNumber || !newListing.dotNumber || !newListing.legalName}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Listing
                  </Button>
                  <Button variant="outline" onClick={() => setShowAddModal(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AdminAllListingsPage
