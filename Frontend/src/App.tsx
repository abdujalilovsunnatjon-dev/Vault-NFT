import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { AnimatePresence } from "framer-motion"
import { TelegramProvider } from "./contexts/TelegramContext"
import Layout from "./components/Layout"
import Store from "./pages/store"
import MyGifts from "./pages/MyGifts"
import Season from "./pages/Season"
import Profile from "./pages/Profile"
import Wallet from "./pages/Wallet"
import SettingsModal from "./components/SettingsModal"
import { useState, useEffect } from "react"
import { initTelegram } from "./lib/telegram"
import { useTelegram } from './contexts/TelegramContext'

const App = () => {
  const { isTelegram, isLoading } = useTelegram()

  if (isLoading) return null

  if (!isTelegram) {
    return (
      <div className="text-white p-4">
        Open this app from Telegram
      </div>
    )
  }

  return <YourRoutes />
}


function App() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  useEffect(() => {
    initTelegram()
      .then(res => {
        console.log("TG USER FINAL:", res.user)
      })
      .catch(err => {
        console.log("TG INIT ERROR:", err.message)
      })
  }, [])

  return (
    <TelegramProvider>
      <Router>
        <div className="min-h-screen bg-background text-white">
          <Layout onSettingsOpen={() => setIsSettingsOpen(true)} />

          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Store />} />
              <Route path="/gifts" element={<MyGifts />} />
              <Route path="/season" element={<Season />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/wallet" element={<Wallet />} />
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
