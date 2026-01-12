import { retrieveLaunchParams } from '@telegram-apps/sdk'
import { api } from './api' // Убедись, что файл src/lib/api.ts экспортирует `api`

type InitDataParsed = {
  user?: {
    id?: number
    first_name?: string
    last_name?: string
    username?: string
    photo_url?: string
  }
  [k: string]: any
}

export const isTMA = (): boolean =>
  typeof window !== 'undefined' && !!(window as any).Telegram?.WebApp

export const initTelegram = async (): Promise<{
  user: {
    id: number
    firstName: string
    lastName?: string
    username?: string
    photoUrl?: string
  }
  initData: InitDataParsed | null
}> => {
  if (!isTMA()) {
    throw new Error('Not in Telegram Mini App')
  }

  // получаем initData из SDK
  const { initData } = retrieveLaunchParams()
  const userRaw = initData?.user

  // отправляем initData на бекенд (если нужно)
  try {
    if (initData) {
      // не блокируем UI — ждём, но в try/catch
      await api.post('/auth/telegram', { initData })
    } else {
      console.warn('No initData received from Telegram')
    }
  } catch (err) {
    console.error('Failed to POST initData to backend:', err)
    // не кидаем ошибку дальше — сайт должен работать даже без бекенда
  }

  // Initialize Telegram WebApp UI safely
  const tg = (window as any).Telegram?.WebApp
  try {
    tg?.expand?.()
    tg?.enableClosingConfirmation?.()
    if (tg?.setHeaderColor) tg.setHeaderColor('#0A0A0A')
    if (tg?.setBackgroundColor) tg.setBackgroundColor('#0A0A0A')
  } catch (e) {
    console.warn('Telegram WebApp UI initialization failed', e)
  }

  const user = {
    id: userRaw?.id ?? 0,
    firstName: userRaw?.first_name ?? '',
    lastName: userRaw?.last_name,
    username: userRaw?.username,
    photoUrl: userRaw?.photo_url,
  }

  return { user, initData: initData ?? null }
}
