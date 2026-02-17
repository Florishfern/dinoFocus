import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App' // เช็คว่า import ถูกที่ไหม
import './index.css' // ต้องมีบรรทัดนี้ครับ!

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)