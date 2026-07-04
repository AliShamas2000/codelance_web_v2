import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { initIconFontLoading } from './utils/initIconFontLoading'
import './styles/fonts.css'
import './index.css'

initIconFontLoading()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

