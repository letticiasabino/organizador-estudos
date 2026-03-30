// ============================================
// main.tsx — Ponto de entrada da aplicação React
// ============================================

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Encontra o elemento #root do index.html e monta a aplicação
const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Elemento #root não encontrado no HTML. Verifique o index.html.')
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
