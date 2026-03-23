import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import App from './App';

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <QueryClientProvider client={queryClient}>
    <Toaster
      position="bottom-right"
      toastOptions={{
        success: {
          style: {
            background: '#6366f1',
            color: 'white',
            fontWeight: 600,
            borderRadius: '10px',
          },
        },
        error: {
          style: {
            background: '#ef4444',
            color: 'white',
            fontWeight: 600,
            borderRadius: '10px',
          },
        },
      }}
    />
    <App />
  </QueryClientProvider>
);