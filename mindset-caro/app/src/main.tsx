import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.tsx';
import './index.css';

// On mindsetcaro.com the app lives at "/". On apexmusiclatino.com and Vercel previews it is
// served from /mindset-caro/ (or the /influencer/mindsetcaro/ rewrite), so route under that.
const path = window.location.pathname;
const basename = path.startsWith('/influencer/mindsetcaro')
  ? '/influencer/mindsetcaro'
  : path.startsWith('/mindset-caro')
    ? '/mindset-caro'
    : '';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter basename={basename}>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>,
);
