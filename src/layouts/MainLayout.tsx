import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      {/* Add padding-top to account for fixed navbar */}
      <main className="pt-16">
        <Outlet />
      </main>
    </div>
  )
}

export default MainLayout
