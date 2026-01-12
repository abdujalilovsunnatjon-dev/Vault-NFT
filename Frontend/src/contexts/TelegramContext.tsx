import React, { createContext, useContext, useEffect, useState } from 'react'
import { initTelegram, isTMA } from '../lib/telegram'

/**
 * Минимальный / безопасный тип для initData.
 * SDK возвращает объект с разными полями; нам нужно только user.
 */
type InitDataParsed = {
  user?: {
    id?: number
    first_name?: string
    last_name?: string
    username?: string
    photo_url?: string
  }
  // возможны другие поля — допускаем любое
  [key: string]: any
}

interface TelegramUser {
  id: number
  firstName: string
  lastName?: string
  username?: string
  photoUrl?: string
}

interface TelegramContextType {
  isTelegram: boolean
  user: TelegramUser | null
  initData: InitDataParsed | null
  isLoading: boolean
}

const TelegramContext = createContext<TelegramContextType>({
  isTelegram: false,
  user: null,
  initData: null,
  isLoading: true,
})

export const useTelegram = () => useContext(TelegramContext)

export const TelegramProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<TelegramContextType>({
    isTelegram: false,
    user: null,
    initData: null,
    isLoading: true,
  })

  useEffect(() => {
    const init = async () => {
      try {
        if (isTMA()) {
          // initTelegram возвращает объект { user, initData }
          const { user, initData } = await initTelegram()
          setState({
            isTelegram: true,
            user,
            initData,
            isLoading: false,
          })
        } else {
          // Mock data for development (initData — объект или null, но не строка)
          setState({
            isTelegram: false,
            user: {
              id: 123456789,
              firstName: 'John',
              lastName: 'Doe',
              username: 'johndoe',
              photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
            },
            initData: null,
            isLoading: false,
          })
        }
      } catch (error) {
        console.error('Failed to initialize Telegram:', error)
        setState(prev => ({ ...prev, isLoading: false }))
      }
    }

    init()
  }, [])

  return <TelegramContext.Provider value={state}>{children}</TelegramContext.Provider>
}
