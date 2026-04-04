import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const BuyerWelcomePage = () => {
  const navigate = useNavigate()

  useEffect(() => {
    // Guide is now embedded in the dashboard — redirect there directly
    navigate('/buyer/dashboard', { replace: true })
  }, [navigate])

  return null
}

export default BuyerWelcomePage
