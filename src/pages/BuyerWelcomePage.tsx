import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import BuyerWelcomeAnimation from '../components/BuyerWelcomeAnimation'

const BuyerWelcomePage = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [showAnimation, setShowAnimation] = useState(false)

  useEffect(() => {
    if (!user) return

    const key = `mcx_buyer_welcome_seen_${user.id}`
    if (localStorage.getItem(key) === 'true') {
      navigate('/buyer/dashboard', { replace: true })
    } else {
      setShowAnimation(true)
    }
  }, [user, navigate])

  if (!showAnimation || !user) return null

  return <BuyerWelcomeAnimation userId={user.id} />
}

export default BuyerWelcomePage
