import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import SellerWelcomeAnimation from '../components/SellerWelcomeAnimation'

const SellerWelcomePage = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [showAnimation, setShowAnimation] = useState(false)

  useEffect(() => {
    if (!user) return

    const key = `mcx_seller_welcome_seen_${user.id}`
    if (localStorage.getItem(key) === 'true') {
      navigate('/seller/dashboard', { replace: true })
    } else {
      setShowAnimation(true)
    }
  }, [user, navigate])

  if (!showAnimation || !user) return null

  return <SellerWelcomeAnimation userId={user.id} />
}

export default SellerWelcomePage
