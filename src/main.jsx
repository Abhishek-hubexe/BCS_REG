import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Global Fetch Interceptor for Authentication
const originalFetch = window.fetch;
window.fetch = async (...args) => {
  let [resource, config] = args;
  
  if (typeof resource === 'string' && resource.startsWith('/api')) {
    config = config || {};
    // Ensure cookies are sent with all API requests
    config.credentials = 'include';

    try {
      const headers = new Headers(config.headers || {});
      const token = localStorage.getItem('cs_token');
      const userStr = localStorage.getItem('cs_user') || localStorage.getItem('bcs_user');
      const user = userStr ? JSON.parse(userStr) : null;

      if (token && !headers.has('Authorization')) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      if (user?.id && !headers.has('x-user-id')) {
        headers.set('x-user-id', String(user.id));
      }
      if (user?.role && !headers.has('x-user-role')) {
        headers.set('x-user-role', user.role);
      }

      config.headers = headers;
    } catch (e) {
      // ignore parsing error
    }
  }
  return originalFetch(resource, config);
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
