import React from 'react';
import ReactDOM from 'react-dom/client';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <MantineProvider
      theme={{
        colorScheme: 'light',
        primaryColor: 'green',
        colors: {
          green: ['#e6f7f0', '#c7ede0', '#a8e3d1', '#88d9c1', '#69cfb2', '#4ac5a3', '#2bbb93', '#00b184', '#00a375', '#00a550'],
          teal: ['#e6f7f5', '#c7ede9', '#a8e3dd', '#88d9d1', '#69cfc5', '#4ac5b9', '#2bbbad', '#00b1a1', '#00a395', '#00bfa5'],
        }
      }}
    >
      <Notifications position="top-right" />
      <AuthProvider>
        <App />
      </AuthProvider>
    </MantineProvider>
  </React.StrictMode>
);