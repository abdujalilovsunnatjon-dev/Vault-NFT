import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// #region agent log
const logToFile = (data: any) => {
  fetch('http://127.0.0.1:7242/ingest/d2ea9d85-ff80-45de-af7b-6b940316e209', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sessionId: 'debug-session',
      runId: 'run1',
      hypothesisId: 'A',
      location: 'main.tsx:init',
      message: 'Checking CSS and styles',
      data,
      timestamp: Date.now()
    })
  }).catch(() => {})
}

// Check if CSS is loaded and Tailwind classes are available
setTimeout(() => {
  const rootEl = document.getElementById('root')
  const bodyEl = document.body
  const testEl = document.createElement('div')
  testEl.className = 'bg-background text-white'
  document.body.appendChild(testEl)
  const computed = window.getComputedStyle(testEl)
  const bgColor = computed.backgroundColor
  const textColor = computed.color
  document.body.removeChild(testEl)
  
  logToFile({
    rootExists: !!rootEl,
    bodyExists: !!bodyEl,
    stylesheetCount: document.styleSheets.length,
    bgColor,
    textColor,
    hasTailwindBg: bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent',
    indexCssImported: true
  })
  
  // Check computed styles on body
  const bodyStyles = window.getComputedStyle(document.body)
  logToFile({
    bodyBgColor: bodyStyles.backgroundColor,
    bodyColor: bodyStyles.color,
    bodyFontFamily: bodyStyles.fontFamily
  })
}, 100)
// #endregion

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)