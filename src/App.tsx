import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import MainLayout from './layouts/MainLayout'
import DashboardLayout from './layouts/DashboardLayout'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import AdminRegisterPage from './pages/AdminRegisterPage'
import SellerVerificationPage from './pages/SellerVerificationPage'
import MarketplacePage from './pages/MarketplacePage'
import MCDetailPage from './pages/MCDetailPage'
import ServicesPage from './pages/services/ServicesPage'
import FuelProgramPage from './pages/services/FuelProgramPage'
import SafetyServicesPage from './pages/services/SafetyServicesPage'
import RecruitingServicesPage from './pages/services/RecruitingServicesPage'
import DispatchServicesPage from './pages/services/DispatchServicesPage'
import AdminServicesPage from './pages/services/AdminServicesPage'
import SellerDashboard from './pages/SellerDashboard'
import CreateListingPage from './pages/CreateListingPage'
import SellerListingsPage from './pages/SellerListingsPage'
import SellerOffersPage from './pages/SellerOffersPage'
import SellerEarningsPage from './pages/SellerEarningsPage'
import SellerDocumentsPage from './pages/SellerDocumentsPage'
import BuyerDashboard from './pages/BuyerDashboard'
import BuyerOffersPage from './pages/BuyerOffersPage'
import BuyerPurchasesPage from './pages/BuyerPurchasesPage'
import BuyerMessagesPage from './pages/BuyerMessagesPage'
import BuyerSubscriptionPage from './pages/BuyerSubscriptionPage'
import AdminDashboard from './pages/AdminDashboard'
import AdminReviewPage from './pages/AdminReviewPage'
import AdminAIDueDiligence from './pages/AdminAIDueDiligence'
import AdminCreditsafePage from './pages/AdminCreditsafePage'
import AdminInvoiceGenerator from './pages/AdminInvoiceGenerator'
import AdminPaymentTracking from './pages/AdminPaymentTracking'
import AdminAllListingsPage from './pages/AdminAllListingsPage'
import AdminListingDetailPage from './pages/AdminListingDetailPage'
import AdminPendingReviewPage from './pages/AdminPendingReviewPage'
import AdminPremiumRequestsPage from './pages/AdminPremiumRequestsPage'
import AdminSettingsPage from './pages/AdminSettingsPage'
import AdminTransactionsPage from './pages/AdminTransactionsPage'
import AdminMessagesPage from './pages/AdminMessagesPage'
import AdminOffersPage from './pages/AdminOffersPage'
import AdminActiveClosingsPage from './pages/AdminActiveClosingsPage'
import AdminUsersPage from './pages/AdminUsersPage'
import ProfilePage from './pages/ProfilePage'
import ProtectedRoute from './components/ProtectedRoute'
import BuyerUnlockedMCsPage from './pages/BuyerUnlockedMCsPage'
import BuyerDepositPage from './pages/BuyerDepositPage'
import BuyerTransactionsPage from './pages/BuyerTransactionsPage'
import SellerTransactionsPage from './pages/SellerTransactionsPage'
import TransactionRoomPage from './pages/TransactionRoomPage'

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster position="top-right" />
        <Routes>
          {/* Public Routes with MainLayout */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="admin-register" element={<AdminRegisterPage />} />
            <Route path="seller-verification" element={<SellerVerificationPage />} />
            <Route path="marketplace" element={<MarketplacePage />} />
            <Route path="mc/:id" element={<MCDetailPage />} />
            {/* Services Routes */}
            <Route path="services" element={<ServicesPage />} />
            <Route path="services/fuel-program" element={<FuelProgramPage />} />
            <Route path="services/safety" element={<SafetyServicesPage />} />
            <Route path="services/recruiting" element={<RecruitingServicesPage />} />
            <Route path="services/dispatch" element={<DispatchServicesPage />} />
            <Route path="services/admin" element={<AdminServicesPage />} />
          </Route>

          {/* Seller Dashboard Routes */}
          <Route
            path="seller"
            element={
              <ProtectedRoute allowedRoles={['seller']}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<SellerDashboard />} />
            <Route path="create-listing" element={<CreateListingPage />} />
            <Route path="listings" element={<SellerListingsPage />} />
            <Route path="offers" element={<SellerOffersPage />} />
            <Route path="earnings" element={<SellerEarningsPage />} />
            <Route path="documents" element={<SellerDocumentsPage />} />
            <Route path="transactions" element={<SellerTransactionsPage />} />
          </Route>

          {/* Buyer Dashboard Routes */}
          <Route
            path="buyer"
            element={
              <ProtectedRoute allowedRoles={['buyer']}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<BuyerDashboard />} />
            <Route path="offers" element={<BuyerOffersPage />} />
            <Route path="purchases" element={<BuyerPurchasesPage />} />
            <Route path="messages" element={<BuyerMessagesPage />} />
            <Route path="subscription" element={<BuyerSubscriptionPage />} />
            <Route path="unlocked" element={<BuyerUnlockedMCsPage />} />
            <Route path="deposit/:offerId" element={<BuyerDepositPage />} />
            <Route path="transactions" element={<BuyerTransactionsPage />} />
          </Route>

          {/* Admin Dashboard Routes */}
          <Route
            path="admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="messages" element={<AdminMessagesPage />} />
            <Route path="review/:id" element={<AdminReviewPage />} />
            <Route path="ai-due-diligence" element={<AdminAIDueDiligence />} />
            <Route path="creditsafe" element={<AdminCreditsafePage />} />
            <Route path="invoices" element={<AdminInvoiceGenerator />} />
            <Route path="payments" element={<AdminPaymentTracking />} />
            <Route path="pending" element={<AdminPendingReviewPage />} />
            <Route path="premium-requests" element={<AdminPremiumRequestsPage />} />
            <Route path="reported" element={<div className="p-8"><h1 className="text-2xl font-bold">Reported Items</h1></div>} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
            <Route path="transactions" element={<AdminTransactionsPage />} />
            <Route path="active-closings" element={<AdminActiveClosingsPage />} />
            <Route path="listings" element={<AdminAllListingsPage />} />
            <Route path="listing/:id" element={<AdminListingDetailPage />} />
            <Route path="offers" element={<AdminOffersPage />} />
            <Route path="reports" element={<div className="p-8"><h1 className="text-2xl font-bold">Reports</h1></div>} />
          </Route>

          {/* Transaction Room - Shared by all roles */}
          <Route
            path="transaction/:transactionId"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <TransactionRoomPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Profile and Settings (with Dashboard Layout) */}
          <Route
            path="profile"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <ProfilePage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="settings"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <div className="p-8">
                    <h1 className="text-2xl font-bold">Settings</h1>
                  </div>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
