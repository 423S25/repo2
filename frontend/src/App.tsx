import './App.css'
import { StrictMode } from 'react';
import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import Home from './pages/home'
import Register from './pages/register'

/*
  Main entrypoint to the application that currently just serves the homepage
  TODO: Add React Router package so we can switch between different pages such as user settings
*/
function App(){
  // Use strict mode to hopefully catch more errors
  return (
    <MantineProvider>
      <ModalsProvider>
      <StrictMode>
        <Register/>
      </StrictMode>
      </ModalsProvider>
    </MantineProvider>
  )
}

export default App
