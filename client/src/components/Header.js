import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Group, Box, Text, Paper } from '@mantine/core';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Paper className="app-header" shadow="sm">
      <Group justify="space-between">
        <Text
          size="xl"
          fw={700}
          variant="gradient"
          gradient={{ from: 'green', to: 'teal', deg: 90 }}
        >
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            HRDC
          </Link>
        </Text>
        <Box>
          {isAuthenticated ? (
            <Group>
              <Text size="sm">Welcome, {user?.username || 'User'}</Text>
              <Button variant="subtle" color="red" onClick={handleLogout}>
                Logout
              </Button>
            </Group>
          ) : (
            <Group>
              <Button variant="subtle" component={Link} to="/login">
                Login
              </Button>
              <Button variant="filled" component={Link} to="/register">
                Register
              </Button>
            </Group>
          )}
        </Box>
      </Group>
    </Paper>
  );
};

export default Header;