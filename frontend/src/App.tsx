import './App.css'
import { StrictMode } from 'react';
import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import Home from './pages/home'
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
        <Home/>
      </StrictMode>
      </ModalsProvider>
    </MantineProvider>
  )
}

export default App
