import { useEffect, useState } from "react"
import { Routes, Route } from "react-router-dom"

import Profile from "./pages/Profile"
import Wallet from "./pages/Wallet"
import Store from "./pages/store"
import Season from "./pages/Season"

import BottomNav from "./components/BottomNav"
import SettingsModal from "./components/SettingsModal"

import { initTelegram } from "./lib/telegram"
import { useTelegram } from "./contexts/TelegramContext"

export default function App() {
  const { isTelegram, isLoading } = useTelegram()
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  useEffect(() => {
    initTelegram()
  }, [])

  if (isLoading) return null

  if (!isTelegram) {
    return (
      <div className="text-white p-4">
        Open this app from Telegram
      </div>
    )
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<Store />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/season" element={<Season />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>

      <BottomNav />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </>
  )
}
