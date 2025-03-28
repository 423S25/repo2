import './App.css'
import {  ReactNode, StrictMode, useEffect } from 'react';
import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import Home from './pages/home';
import Login from './pages/login';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import {BrowserRouter as Router, Navigate,  Routes, Route } from 'react-router-dom';


interface PrivateRouteProps {
  children: ReactNode;  // Correctly typing children as ReactNode
}
// import APIRequest from './api/request';
const PrivateRoute : React.FC<PrivateRouteProps> = (  { children }  ) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const PublicRoute : React.FC<PrivateRouteProps> = ( { children } ) => {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? children : <Navigate to="/dashboard" />;
};
/*
  Main entrypoint to the application that currently just serves the homepage
  TODO: Add React Router package so we can switch between different pages such as user settings
*/
function App(){
  useEffect(() => {
    // const requster = APIRequest("http://")
    // req
  })
  // Use strict mode to hopefully catch more errors
  return (
    <MantineProvider>
      <ModalsProvider>
      <StrictMode>
      <AuthProvider>
        <Router>
          <Routes>
              <Route
                path="/login" 
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                } 
              />
                    <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <Home/>
            </PrivateRoute>
          } 
        />
              <Route path="/" element={<Navigate to="/login" />} />
              <Route path="/dashboard" element={<Navigate to="/dashboard" />} />
          </Routes>
        </Router>
        </AuthProvider>
      </StrictMode>
      </ModalsProvider>
    </MantineProvider>
  )
}

export default App
