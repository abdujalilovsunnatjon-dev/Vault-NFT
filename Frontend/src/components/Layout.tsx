import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Store,
  Gift,
  Trophy,
  User,
  Wallet
} from 'lucide-react'
import BottomNav from './BottomNav'
import { useTelegram } from '../contexts/TelegramContext'

const Layout = ({ onSettingsOpen }: { onSettingsOpen: () => void }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useTelegram()

  const navItems = [
    { path: '/', icon: Store, label: 'Store' },
    { path: '/gifts', icon: Gift, label: 'Gifts' },
    { path: '/season', icon: Trophy, label: 'Season' },
    { path: '/profile', icon: User, label: 'Profile' },
  ]

  return (
    <div className="tg-app max-w-md mx-auto min-h-screen pb-16">
      {/* Main Content */}
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.2 }}
        className="px-4 pt-4"
      >
        <Outlet context={{ onSettingsOpen }} />
      </motion.div>

      {/* Bottom Navigation */}
      <BottomNav items={navItems} />
    </div>
  )
}

export default Layout