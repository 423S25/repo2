import { useState, useEffect } from 'react';
import { Container, Paper, Group, Text } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import WelcomePage from './WelcomePage';
import SimplifiedLogin from './SimplifiedLogin';
import SimplifiedRegister from './SimplifiedRegister';
import SuccessPage from './SuccessPage';

function AppContainer() {
  const [selectedRole, setSelectedRole] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
  };

  const handleLoginSuccess = (data) => {
    setUser(data.user);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    setSelectedRole(null);
    setShowRegister(false);
  };

  const switchToRegister = () => {
    setShowRegister(true);
  };

  const switchToLogin = () => {
    setShowRegister(false);
  };

  // Reset flow back to role selection
  const handleBackToWelcome = () => {
    setSelectedRole(null);
    setShowRegister(false);
  };

  // Show the success page if authenticated
  if (isAuthenticated) {
    return (
      <Container size="lg">
        <Notifications position="top-right" />
        <SuccessPage user={user} onLogout={handleLogout} />
      </Container>
    );
  }

  return (
    <Container size="lg">
      <Notifications position="top-right" />
      
      {selectedRole === null ? (
        // Initial welcome screen with role selection
        <WelcomePage onRoleSelect={handleRoleSelect} />
      ) : (
        // Login/Register screens
        <>
          {showRegister ? (
            <SimplifiedRegister 
              switchToLogin={switchToLogin} 
              selectedRole={selectedRole} 
            />
          ) : (
            <SimplifiedLogin 
              onLoginSuccess={handleLoginSuccess} 
              switchToRegister={switchToRegister} 
              selectedRole={selectedRole} 
            />
          )}
          
          <Group position="center" mt={20}>
            <Text 
              color="dimmed" 
              size="sm" 
              sx={{ cursor: 'pointer', textDecoration: 'underline' }}
              onClick={handleBackToWelcome}
            >
              ← Back to role selection
            </Text>
          </Group>
        </>
      )}
    </Container>
  );
}

export default AppContainer;