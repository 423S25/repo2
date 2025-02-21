import './App.css'
import { StrictMode } from 'react';
import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import Home from './pages/home'
/*
  Main entrypoint to the application that currently just serves the homepage
*/
function App(){
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
