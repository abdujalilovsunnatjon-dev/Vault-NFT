import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { TelegramProvider } from './contexts/TelegramContext'
import Layout from './components/Layout'
import Store from './pages/store'
import MyGifts from './pages/MyGifts'
import Season from './pages/Season'
import Profile from './pages/Profile'
import Wallet from './pages/Wallet'
import SettingsModal from './components/SettingsModal'
import { useState } from 'react'
import { initTelegram } from "@/lib/telegram"

useEffect(() => {
  initTelegram()
    .then(res => {
      console.log("TG USER FINAL:", res.user)
    })
    .catch(err => {
      console.log("TG INIT ERROR:", err.message)
    })
}, [])

function App() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  return (
    <TelegramProvider>
      <Router>
        <div className="min-h-screen bg-background text-white">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Layout onSettingsOpen={() => setIsSettingsOpen(true)} />}>
                <Route index element={<Store />} />
                <Route path="gifts" element={<MyGifts />} />
                <Route path="season" element={<Season />} />
                <Route path="profile" element={<Profile />} />
                <Route path="wallet" element={<Wallet />} />
              </Route>
            </Routes>
          </AnimatePresence>

          <SettingsModal
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
          />
        </div>
      </Router>
    </TelegramProvider>
  )
}

export default App
