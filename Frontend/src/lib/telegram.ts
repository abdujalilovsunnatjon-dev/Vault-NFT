// Frontend/src/lib/telegram.ts
import { retrieveLaunchParams } from '@telegram-apps/sdk'
import { api } from './api'

export const isTMA = (): boolean =>
  typeof window !== 'undefined' && !!(window as any).Telegram?.WebApp

export const initTelegram = async (): Promise<{
  user: any
  initData: any
}> => {
  if (!isTMA()) {
    // Fallback for non-TMA environment (dev)
    console.warn('Not in Telegram Mini App')
    return { user: null, initData: null }
  }

  // Use the raw initData string from the WebApp object for validation
  const rawInitData = (window as any).Telegram?.WebApp?.initData;
  const { initData } = retrieveLaunchParams(); // Parsed object for UI use

  try {
    if (rawInitData) {
      await api.post('/auth/telegram', { initData: rawInitData });
    }
  } catch (err) {
    console.error('Failed to authenticate with backend:', err)
  }

  // Initialize UI
  const tg = (window as any).Telegram?.WebApp
  try {
    tg?.expand?.()
    tg?.enableClosingConfirmation?.()
    if (tg?.setHeaderColor) tg.setHeaderColor('#0A0A0A')
    if (tg?.setBackgroundColor) tg.setBackgroundColor('#0A0A0A')
  } catch (e) {
    console.warn('UI init failed', e)
  }

  return { 
    user: initData?.user, 
    initData: rawInitData 
  }
}
