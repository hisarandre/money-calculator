import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/styles/index.css'
import App from '@/App.tsx'
import { Provider } from 'react-redux';
import Store from '@/store/Store';
import { Toaster } from "@/components/ui/toaster"

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={Store}>
        <App />
        <Toaster />
    </Provider>
  </StrictMode>,
)
