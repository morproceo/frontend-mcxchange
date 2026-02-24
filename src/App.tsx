import { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import MainLayout from './layouts/MainLayout'
import DashboardLayout from './layouts/DashboardLayout'
import AIChatWidget from './components/AIChatWidget'
import ProtectedRoute from './components/ProtectedRoute'
import AuthRequiredRoute from './components/AuthRequiredRoute'
import VerificationRequiredRoute from './components/VerificationRequiredRoute'

// Eagerly loaded - landing page (first paint)
import HomePage from './pages/HomePage'

// Lazy-loaded pages - split by route group
const LoginPage = lazy(() => import('./pages/LoginPage'))
const RegisterPage = lazy(() => import('./pages/RegisterPage'))
const AdminRegisterPage = lazy(() => import('./pages/AdminRegisterPage'))
const SellerVerificationPage = lazy(() => import('./pages/SellerVerificationPage'))
const VerifyEmailPage = lazy(() => import('./pages/VerifyEmailPage'))
const MarketplacePage = lazy(() => import('./pages/MarketplacePage'))
const MCDetailPage = lazy(() => import('./pages/MCDetailPage'))
const ConsultationSuccessPage = lazy(() => import('./pages/ConsultationSuccessPage'))
const TermsPage = lazy(() => import('./pages/TermsPage'))
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'))
const DriversLandingPage = lazy(() => import('./pages/DriversLandingPage'))

// Services pages
const ServicesPage = lazy(() => import('./pages/services/ServicesPage'))
const FuelProgramPage = lazy(() => import('./pages/services/FuelProgramPage'))
const SafetyServicesPage = lazy(() => import('./pages/services/SafetyServicesPage'))
const RecruitingServicesPage = lazy(() => import('./pages/services/RecruitingServicesPage'))
const DispatchServicesPage = lazy(() => import('./pages/services/DispatchServicesPage'))
const AdminServicesPage = lazy(() => import('./pages/services/AdminServicesPage'))

// Seller pages
const SellerWelcomePage = lazy(() => import('./pages/SellerWelcomePage'))
const SellerDashboard = lazy(() => import('./pages/SellerDashboard'))
const CreateListingPage = lazy(() => import('./pages/CreateListingPage'))
const SellerListingsPage = lazy(() => import('./pages/SellerListingsPage'))
const SellerOffersPage = lazy(() => import('./pages/SellerOffersPage'))
const SellerEarningsPage = lazy(() => import('./pages/SellerEarningsPage'))
const SellerDocumentsPage = lazy(() => import('./pages/SellerDocumentsPage'))
const SellerTransactionsPage = lazy(() => import('./pages/SellerTransactionsPage'))

// Buyer pages
const BuyerDashboard = lazy(() => import('./pages/BuyerDashboard'))
const BuyerOffersPage = lazy(() => import('./pages/BuyerOffersPage'))
const BuyerPurchasesPage = lazy(() => import('./pages/BuyerPurchasesPage'))
const BuyerMessagesPage = lazy(() => import('./pages/BuyerMessagesPage'))
const BuyerSubscriptionPage = lazy(() => import('./pages/BuyerSubscriptionPage'))
const BuyerUnlockedMCsPage = lazy(() => import('./pages/BuyerUnlockedMCsPage'))
const BuyerCreditsafePage = lazy(() => import('./pages/BuyerCreditsafePage'))
const VipMarketplacePage = lazy(() => import('./pages/VipMarketplacePage'))
const BuyerDepositPage = lazy(() => import('./pages/BuyerDepositPage'))
const BuyerTransactionsPage = lazy(() => import('./pages/BuyerTransactionsPage'))

// Admin pages
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'))
const AdminReviewPage = lazy(() => import('./pages/AdminReviewPage'))
const AdminAIDueDiligence = lazy(() => import('./pages/AdminAIDueDiligence'))
const AdminCreditsafePage = lazy(() => import('./pages/AdminCreditsafePage'))
const AdminInvoiceGenerator = lazy(() => import('./pages/AdminInvoiceGenerator'))
const AdminPaymentTracking = lazy(() => import('./pages/AdminPaymentTracking'))
const AdminAllListingsPage = lazy(() => import('./pages/AdminAllListingsPage'))
const AdminListingDetailPage = lazy(() => import('./pages/AdminListingDetailPage'))
const AdminPendingReviewPage = lazy(() => import('./pages/AdminPendingReviewPage'))
const AdminPremiumRequestsPage = lazy(() => import('./pages/AdminPremiumRequestsPage'))
const AdminConsultationsPage = lazy(() => import('./pages/AdminConsultationsPage'))
const AdminTelegramPage = lazy(() => import('./pages/AdminTelegramPage'))
const AdminFacebookPage = lazy(() => import('./pages/AdminFacebookPage'))
const AdminSettingsPage = lazy(() => import('./pages/AdminSettingsPage'))
const AdminTransactionsPage = lazy(() => import('./pages/AdminTransactionsPage'))
const AdminMessagesPage = lazy(() => import('./pages/AdminMessagesPage'))
const AdminOffersPage = lazy(() => import('./pages/AdminOffersPage'))
const AdminActiveClosingsPage = lazy(() => import('./pages/AdminActiveClosingsPage'))
const AdminUsersPage = lazy(() => import('./pages/AdminUsersPage'))
const AdminDisputesPage = lazy(() => import('./pages/AdminDisputesPage'))
const AdminActivityLogPage = lazy(() => import('./pages/AdminActivityLogPage'))

// Shared pages
const ProfilePage = lazy(() => import('./pages/ProfilePage'))
const SettingsPage = lazy(() => import('./pages/SettingsPage'))
const TransactionRoomPage = lazy(() => import('./pages/TransactionRoomPage'))
const DisputePage = lazy(() => import('./pages/DisputePage'))

// Loading fallback for lazy-loaded pages
function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    </div>
  )
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster position="top-right" />
        <AIChatWidget />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public Routes with MainLayout */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<HomePage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
              <Route path="terms" element={<TermsPage />} />
              <Route path="privacy" element={<PrivacyPage />} />
              <Route path="admin-register" element={<AdminRegisterPage />} />
              <Route path="seller-verification" element={<SellerVerificationPage />} />
              <Route path="verify-email" element={<VerifyEmailPage />} />
              <Route path="marketplace" element={<MarketplacePage />} />
              <Route path="mc/:id" element={<VerificationRequiredRoute><MCDetailPage /></VerificationRequiredRoute>} />
              <Route path="consultation/success" element={<ConsultationSuccessPage />} />
              {/* Services Routes */}
              <Route path="services" element={<ServicesPage />} />
              <Route path="services/fuel-program" element={<FuelProgramPage />} />
              <Route path="services/safety" element={<SafetyServicesPage />} />
              <Route path="services/recruiting" element={<RecruitingServicesPage />} />
              <Route path="services/dispatch" element={<DispatchServicesPage />} />
              <Route path="services/admin" element={<AdminServicesPage />} />
              <Route path="drivers" element={<DriversLandingPage />} />
            </Route>

            {/* Seller Welcome (standalone, no DashboardLayout) */}
            <Route
              path="seller/welcome"
              element={
                <ProtectedRoute allowedRoles={['seller']}>
                  <SellerWelcomePage />
                </ProtectedRoute>
              }
            />

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
              <Route path="creditsafe" element={<BuyerCreditsafePage />} />
              <Route path="vip-marketplace" element={<VipMarketplacePage />} />
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
              <Route path="telegram" element={<AdminTelegramPage />} />
              <Route path="facebook" element={<AdminFacebookPage />} />
              <Route path="invoices" element={<AdminInvoiceGenerator />} />
              <Route path="payments" element={<AdminPaymentTracking />} />
              <Route path="pending" element={<AdminPendingReviewPage />} />
              <Route path="premium-requests" element={<AdminPremiumRequestsPage />} />
              <Route path="consultations" element={<AdminConsultationsPage />} />
              <Route path="reported" element={<div className="p-8"><h1 className="text-2xl font-bold">Reported Items</h1></div>} />
              <Route path="users" element={<AdminUsersPage />} />
              <Route path="activity-log" element={<AdminActivityLogPage />} />
              <Route path="disputes" element={<AdminDisputesPage />} />
              <Route path="settings" element={<AdminSettingsPage />} />
              <Route path="transactions" element={<AdminTransactionsPage />} />
              <Route path="active-closings" element={<AdminActiveClosingsPage />} />
              <Route path="listings" element={<AdminAllListingsPage />} />
              <Route path="listing/:id" element={<AdminListingDetailPage />} />
              <Route path="offers" element={<AdminOffersPage />} />
              <Route path="reports" element={<div className="p-8"><h1 className="text-2xl font-bold">Reports</h1></div>} />
            </Route>

            {/* Public Dispute Page - No auth required */}
            <Route path="dispute/:disputeId" element={<DisputePage />} />

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
                    <SettingsPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </Router>
  )
}

export default App
