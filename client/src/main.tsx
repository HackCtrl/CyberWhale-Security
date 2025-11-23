
import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import App from './App.tsx'
import './index.css'

// Global error handlers to capture runtime errors and unhandled promise rejections
// This prevents the Vite overlay from being the only visible symptom and makes
// debugging easier by logging details to the browser console.
window.addEventListener('error', (event: ErrorEvent) => {
  try {
    // eslint-disable-next-line no-console
    console.error('Global error caught:', event.error ?? event.message, event);
  } catch (e) {
    // ignore
  }
});

window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
  try {
    // eslint-disable-next-line no-console
    console.error('Unhandled promise rejection:', event.reason, event);
  } catch (e) {
    // ignore
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
