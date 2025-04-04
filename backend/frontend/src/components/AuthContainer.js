import { useState, useEffect } from 'react';
import { Container, Paper, Tabs } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import Login from './Login';
import Register from './Register';
import SuccessPage from './SuccessPage';

function AuthContainer() {
  const [activeTab, setActiveTab] = useState('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [showSuccessPage, setShowSuccessPage] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const handleLoginSuccess = (data) => {
    setUser(data.user);
    setIsAuthenticated(true);
    setShowSuccessPage(true);
    
    // After 3 seconds, switch to the regular profile view
    setTimeout(() => {
      setShowSuccessPage(false);
    }, 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    setShowSuccessPage(false);
  };

  // Show success page or profile if authenticated, otherwise show login/register tabs
  if (isAuthenticated) {
    return (
      <Container size="sm">
        <Notifications position="top-right" />
        {showSuccessPage ? (
          <SuccessPage user={user} onLogout={handleLogout} />
        ) : (
          <SuccessPage user={user} onLogout={handleLogout} />
        )}
      </Container>
    );
  }

  return (
    <Container size="sm">
      <Notifications position="top-right" />
      <Paper shadow="md" p={30} mt={30} radius="md">
        <Tabs 
          value={activeTab} 
          onTabChange={setActiveTab}
          styles={{
            tabLabel: { fontWeight: 500 },
            tab: { 
              color: 'var(--hrdc-teal)', 
              '&[data-active]': {
                borderColor: 'var(--hrdc-gold)'
              }
            }
          }}
        >
          <Tabs.List grow>
            <Tabs.Tab value="login">Login</Tabs.Tab>
            <Tabs.Tab value="register">Register</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="login" pt="xs">
            <Login 
              onLoginSuccess={handleLoginSuccess} 
              switchToRegister={() => setActiveTab('register')} 
            />
          </Tabs.Panel>

          <Tabs.Panel value="register" pt="xs">
            <Register 
              switchToLogin={() => setActiveTab('login')} 
            />
          </Tabs.Panel>
        </Tabs>
      </Paper>
    </Container>
  );
}

export default AuthContainer;