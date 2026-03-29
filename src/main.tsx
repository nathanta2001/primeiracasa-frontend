import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ConfigProvider } from "antd";
import { registerSW } from 'virtual:pwa-register';

registerSW({ immediate: true });

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <ConfigProvider 
      theme={{
        token: {
          colorPrimary: '#7C3AED', 
          borderRadius: 12,
        },
      }}
    >
      <App />
    </ConfigProvider>
  </StrictMode>,
);


