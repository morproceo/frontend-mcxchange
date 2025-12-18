import { useState } from 'react'
import { motion } from 'framer-motion'
import { Edit2, Save, X, Star } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import GlassCard from '../components/ui/GlassCard'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import TrustBadge from '../components/ui/TrustBadge'
import { formatDistanceToNow } from 'date-fns'

const ProfilePage = () => {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  })

  const handleSave = () => {
    // In a real app, this would update the backend
    setIsEditing(false)
  }

  const getTrustLevel = (score: number) => {
    if (score >= 80) return 'high'
    if (score >= 50) return 'medium'
    return 'low'
  }

  const mockReviews = [
    {
      id: '1',
      from: 'John Buyer',
      rating: 5,
      comment: 'Excellent seller! Very transparent and professional throughout the process.',
      date: new Date('2024-01-10'),
      dealType: 'MC #123456 Sale'
    },
    {
      id: '2',
      from: 'Sarah Johnson',
      rating: 5,
      comment: 'Smooth transaction, all documents were in order. Highly recommend!',
      date: new Date('2024-01-05'),
      dealType: 'MC #789012 Sale'
    },
    {
      id: '3',
      from: 'Mike Wilson',
      rating: 4,
      comment: 'Good experience overall. Communication could be faster but deal went through well.',
      date: new Date('2023-12-20'),
      dealType: 'MC #345678 Sale'
    }
  ]

  const activityLog = [
    { type: 'listing', message: 'Listed MC #123456', date: '2 days ago' },
    { type: 'offer', message: 'Received offer on MC #789012', date: '5 days ago' },
    { type: 'review', message: 'Received 5-star review', date: '1 week ago' },
    { type: 'verification', message: 'Documents verified', date: '2 weeks ago' }
  ]

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">My Profile</h2>
          <p className="text-gray-500">Manage your account and reputation</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Profile */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Info */}
            <GlassCard hover={false}>
              <div className="flex items-start justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
                {!isEditing ? (
                  <Button size="sm" variant="secondary" onClick={() => setIsEditing(true)}>
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleSave}>
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setIsEditing(false)
                        setFormData({
                          name: user?.name || '',
                          email: user?.email || ''
                        })
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-6 mb-6">
                <div className="w-24 h-24 rounded-full bg-secondary-100 flex items-center justify-center">
                  <span className="text-4xl font-bold text-secondary-600">
                    {user?.name.charAt(0)}
                  </span>
                </div>

                <div className="flex-1">
                  {isEditing ? (
                    <div className="space-y-3">
                      <Input
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                      />
                      <Input
                        type="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                      />
                    </div>
                  ) : (
                    <>
                      <h3 className="text-2xl font-bold text-gray-900 mb-1">{user?.name}</h3>
                      <p className="text-gray-500 mb-3">{user?.email}</p>
                      <div className="flex items-center gap-3">
                        <span className="bg-gray-100 border border-gray-200 px-3 py-1 rounded-full text-sm capitalize text-gray-700">
                          {user?.role}
                        </span>
                        <span className="text-sm text-gray-500">
                          Member since {user?.memberSince.getFullYear()}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <TrustBadge
                  score={user?.trustScore || 0}
                  level={getTrustLevel(user?.trustScore || 0)}
                  verified={user?.verified}
                  size="lg"
                />
              </div>
            </GlassCard>

            {/* Reviews */}
            <GlassCard hover={false}>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Reviews & Ratings</h2>

              <div className="mb-6">
                <div className="flex items-center gap-4">
                  <div className="text-5xl font-bold text-gray-900">4.8</div>
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-5 h-5 ${
                            star <= 4
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-gray-500">Based on {mockReviews.length} reviews</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {mockReviews.map((review) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-gray-50 border border-gray-100 rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="font-semibold text-gray-900">{review.from}</div>
                        <div className="text-xs text-gray-500">{review.dealType}</div>
                      </div>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <Star
                            key={i}
                            className="w-4 h-4 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{review.comment}</p>
                    <p className="text-xs text-gray-400">
                      {formatDistanceToNow(review.date, { addSuffix: true })}
                    </p>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats */}
            <GlassCard hover={false}>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Statistics</h3>

              <div className="space-y-4">
                <div className="bg-gray-50 border border-gray-100 rounded-lg p-3">
                  <div className="text-2xl font-bold text-secondary-600">
                    {user?.completedDeals}
                  </div>
                  <div className="text-sm text-gray-500">Completed Deals</div>
                </div>

                <div className="bg-gray-50 border border-gray-100 rounded-lg p-3">
                  <div className="text-2xl font-bold text-emerald-600">
                    {mockReviews.length}
                  </div>
                  <div className="text-sm text-gray-500">Total Reviews</div>
                </div>

                <div className="bg-gray-50 border border-gray-100 rounded-lg p-3">
                  <div className="text-2xl font-bold text-amber-500">100%</div>
                  <div className="text-sm text-gray-500">Response Rate</div>
                </div>

                <div className="bg-gray-50 border border-gray-100 rounded-lg p-3">
                  <div className="text-2xl font-bold text-purple-600">~2h</div>
                  <div className="text-sm text-gray-500">Avg Response Time</div>
                </div>
              </div>
            </GlassCard>

            {/* Recent Activity */}
            <GlassCard hover={false}>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>

              <div className="space-y-3">
                {activityLog.map((activity, index) => (
                  <div key={index} className="flex gap-3 text-sm">
                    <div className="w-2 h-2 rounded-full bg-secondary-500 mt-1.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-gray-700">{activity.message}</p>
                      <p className="text-xs text-gray-400">{activity.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
