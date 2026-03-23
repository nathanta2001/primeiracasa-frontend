import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {ConfigProvider} from "antd";

<ConfigProvider theme={{
  token: {
    colorPrimary: '#7C3AED',
    borderRadius: 12,
  },
}}>
  <App />
</ConfigProvider>

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
