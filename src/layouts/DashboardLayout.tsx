import { useState } from 'react'
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  MessageSquare,
  DollarSign,
  Settings,
  LogOut,
  Menu,
  X,
  Plus,
  FileText,
  Shield,
  Users,
  AlertTriangle,
  Search,
  Bell,
  Receipt,
  CreditCard,
  Crown,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Unlock,
  Handshake,
  Send,
  Scale,
  LucideIcon
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import TrustBadge from '../components/ui/TrustBadge'
import { getTrustLevel } from '../utils/helpers'
import { DomileaLogoFull, DomileaIcon } from '../components/ui/DomileaLogo'
import clsx from 'clsx'

interface DashboardLayoutProps {
  children?: React.ReactNode
}

interface MenuItem {
  icon: LucideIcon
  label: string
  path: string
}

interface MenuCategory {
  label: string
  icon: LucideIcon
  items: MenuItem[]
}

type MenuStructure = (MenuItem | MenuCategory)[]

const DashboardLayout = ({ children }: DashboardLayoutProps = {}) => {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['Sales Pipeline', 'Moderation']))

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev)
      if (newSet.has(category)) {
        newSet.delete(category)
      } else {
        newSet.add(category)
      }
      return newSet
    })
  }

  // Define menu items based on user role
  const getMenuItems = (): MenuStructure => {
    switch (user?.role) {
      case 'seller':
        return [
          { icon: LayoutDashboard, label: 'Dashboard', path: '/seller/dashboard' },
          { icon: Package, label: 'My Listings', path: '/seller/listings' },
          { icon: Plus, label: 'Create Listing', path: '/seller/create-listing' },
          { icon: MessageSquare, label: 'Offers', path: '/seller/offers' },
          { icon: Handshake, label: 'Transactions', path: '/seller/transactions' },
          { icon: DollarSign, label: 'Earnings', path: '/seller/earnings' },
          { icon: FileText, label: 'Documents', path: '/seller/documents' },
        ]
      case 'buyer':
        return [
          { icon: LayoutDashboard, label: 'Dashboard', path: '/buyer/dashboard' },
          { icon: Unlock, label: 'Unlocked MCs', path: '/buyer/unlocked' },
          { icon: ShoppingCart, label: 'My Offers', path: '/buyer/offers' },
          { icon: Handshake, label: 'Transactions', path: '/buyer/transactions' },
          { icon: Package, label: 'Purchases', path: '/buyer/purchases' },
          { icon: MessageSquare, label: 'Messages', path: '/buyer/messages' },
        ]
      case 'admin':
        return [
          // Dashboard is standalone
          { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
          // Sales Pipeline category
          {
            label: 'Sales Pipeline',
            icon: Handshake,
            items: [
              { icon: MessageSquare, label: 'Inquiries', path: '/admin/messages' },
              { icon: Send, label: 'Offers', path: '/admin/offers' },
              { icon: Scale, label: 'Active Closings', path: '/admin/active-closings' },
              { icon: Handshake, label: 'Transactions', path: '/admin/transactions' },
            ]
          },
          // Finance category
          {
            label: 'Finance',
            icon: DollarSign,
            items: [
              { icon: CreditCard, label: 'Payments', path: '/admin/payments' },
              { icon: Receipt, label: 'Invoices', path: '/admin/invoices' },
            ]
          },
          // Moderation category
          {
            label: 'Moderation',
            icon: Shield,
            items: [
              { icon: AlertTriangle, label: 'Pending Review', path: '/admin/pending' },
              { icon: Shield, label: 'Reported Items', path: '/admin/reported' },
              { icon: Crown, label: 'Premium Requests', path: '/admin/premium-requests' },
              { icon: MessageSquare, label: 'Consultations', path: '/admin/consultations' },
            ]
          },
          // Tools category
          {
            label: 'Tools',
            icon: Search,
            items: [
              { icon: Search, label: 'AI Due Diligence', path: '/admin/ai-due-diligence' },
              { icon: CreditCard, label: 'Credit Reports', path: '/admin/creditsafe' },
              { icon: Send, label: 'Telegram Channel', path: '/admin/telegram' },
            ]
          },
          // Management category
          {
            label: 'Management',
            icon: Users,
            items: [
              { icon: Users, label: 'Users', path: '/admin/users' },
              { icon: Package, label: 'Listings', path: '/admin/listings' },
              { icon: FileText, label: 'Reports', path: '/admin/reports' },
              { icon: Settings, label: 'Settings', path: '/admin/settings' },
            ]
          },
        ]
      default:
        return []
    }
  }

  const menuItems = getMenuItems()

  const isActivePath = (path: string) => {
    return location.pathname === path
  }

  // Check if any item in a category is active
  const isCategoryActive = (category: MenuCategory) => {
    return category.items.some(item => isActivePath(item.path))
  }

  // Check if item is a category (has items array)
  const isCategory = (item: MenuItem | MenuCategory): item is MenuCategory => {
    return 'items' in item
  }

  // Render a single menu item
  const renderMenuItem = (item: MenuItem, indented: boolean = false) => {
    const isActive = isActivePath(item.path)
    const Icon = item.icon

    return (
      <Link
        key={item.path}
        to={item.path}
        onClick={() => setSidebarOpen(false)}
        className={clsx(
          'flex items-center space-x-3 px-3 py-2 rounded-xl transition-all duration-200',
          indented && !isCollapsed && 'ml-4',
          isActive
            ? 'bg-black text-white'
            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
        )}
      >
        <Icon className={clsx('h-4 w-4 flex-shrink-0', isActive ? 'text-white' : 'text-gray-500')} />
        {!isCollapsed && (
          <span className={clsx('font-medium text-inherit', indented ? 'text-sm' : '')}>{item.label}</span>
        )}
      </Link>
    )
  }

  // Render a category with collapsible items
  const renderCategory = (category: MenuCategory) => {
    const isExpanded = expandedCategories.has(category.label)
    const hasActiveItem = isCategoryActive(category)
    const Icon = category.icon

    return (
      <div key={category.label} className="space-y-1">
        <button
          onClick={() => toggleCategory(category.label)}
          className={clsx(
            'w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all duration-200',
            hasActiveItem
              ? 'bg-gray-100 text-gray-900'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          )}
        >
          <div className="flex items-center space-x-3">
            <Icon className={clsx('h-4 w-4 flex-shrink-0', hasActiveItem ? 'text-gray-900' : 'text-gray-500')} />
            {!isCollapsed && (
              <span className="font-medium text-sm">{category.label}</span>
            )}
          </div>
          {!isCollapsed && (
            <ChevronDown
              className={clsx(
                'h-4 w-4 text-gray-400 transition-transform duration-200',
                isExpanded && 'rotate-180'
              )}
            />
          )}
        </button>

        <AnimatePresence initial={false}>
          {isExpanded && !isCollapsed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="space-y-0.5 pt-1">
                {category.items.map(item => renderMenuItem(item, true))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Show tooltip-like dropdown when collapsed */}
        {isCollapsed && (
          <div className="relative group">
            <div className="absolute left-full top-0 ml-2 hidden group-hover:block z-50">
              <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-2 min-w-[160px]">
                <div className="text-xs font-semibold text-gray-500 px-3 py-1 mb-1">
                  {category.label}
                </div>
                {category.items.map(item => {
                  const isActive = isActivePath(item.path)
                  const ItemIcon = item.icon
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={clsx(
                        'flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-colors',
                        isActive
                          ? 'bg-black text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      )}
                    >
                      <ItemIcon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed left-0 top-0 h-screen bg-white border-r border-gray-100 transition-all duration-300 z-50 flex flex-col',
          'hidden lg:flex',
          isCollapsed ? 'lg:w-20' : 'lg:w-64',
          sidebarOpen && '!flex w-64'
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100 flex-shrink-0">
          <Link to="/" className="flex items-center text-gray-900">
            {isCollapsed ? (
              <DomileaIcon size={32} />
            ) : (
              <DomileaLogoFull height={26} />
            )}
          </Link>
          {/* Desktop collapse button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:block p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronLeft className="h-5 w-5 text-gray-500" />
            )}
          </button>
          {/* Mobile close button */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* User Profile Card */}
        {!isCollapsed && (
          <div className="px-4 py-4 flex-shrink-0">
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-secondary-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-secondary-600 font-semibold text-sm">
                    {user?.name.charAt(0)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                </div>
              </div>
              <TrustBadge
                score={user?.trustScore || 0}
                level={getTrustLevel(user?.trustScore || 0)}
                verified={user?.verified}
                size="sm"
              />
            </div>
          </div>
        )}

        {/* Navigation - scrollable */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            if (isCategory(item)) {
              return renderCategory(item)
            } else {
              return renderMenuItem(item)
            }
          })}
        </nav>

        {/* Bottom section */}
        <div className="px-3 py-4 border-t border-gray-100 space-y-1 flex-shrink-0">
          <Link
            to="/profile"
            onClick={() => setSidebarOpen(false)}
            className={clsx(
              'flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all duration-200',
              isActivePath('/profile')
                ? 'bg-black text-white'
                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
            )}
          >
            <Settings className={clsx('h-5 w-5 flex-shrink-0', isActivePath('/profile') ? 'text-white' : 'text-gray-600')} />
            {!isCollapsed && <span className="font-medium text-inherit">Settings</span>}
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
          >
            <LogOut className="h-5 w-5 flex-shrink-0 text-gray-600" />
            {!isCollapsed && <span className="font-medium">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main content area */}
      <div className={clsx('transition-all duration-300', isCollapsed ? 'lg:pl-20' : 'lg:pl-64')}>
        {/* Top header */}
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-30">
          <div className="flex items-center space-x-3 sm:space-x-4 flex-1">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <Menu className="h-5 w-5 text-gray-600" />
            </button>

            {/* Mobile logo */}
            <div className="lg:hidden flex items-center text-gray-900">
              <DomileaLogoFull height={24} />
            </div>

            {/* Search - hidden on mobile */}
            <div className="relative max-w-md w-full hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-secondary-500/20 focus:border-secondary-500 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Mobile search button */}
            <button className="sm:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors">
              <Search className="h-5 w-5 text-gray-600" />
            </button>

            <button className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors">
              <Bell className="h-5 w-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <div className="h-8 w-px bg-gray-200 hidden sm:block" />
            <Link to="/profile" className="flex items-center space-x-3">
              <div className="w-9 h-9 bg-secondary-100 rounded-full flex items-center justify-center">
                <span className="text-secondary-600 font-semibold text-sm">{user?.name.charAt(0)}</span>
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
