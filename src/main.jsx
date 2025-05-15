
    import React from 'react';
    import ReactDOM from 'react-dom/client';
    import App from '@/App.jsx';
    import '@/index.css';

    const preferredTheme = localStorage.getItem('no-palco-theme') || 'dark';
    if (preferredTheme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }


    ReactDOM.createRoot(document.getElementById('root')).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  