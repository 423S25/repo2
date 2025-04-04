import { useEffect, useState } from 'react';
import { Paper, Text, Button, Group, Loader, Box } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

function Profile({ onLogout }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Not authenticated');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${API_URL}/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
      } catch (err) {
        setError('Failed to load profile');
        if (err.response?.status === 401 || err.response?.status === 403) {
          // Token expired or invalid
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          onLogout();
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [onLogout]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    notifications.show({
      title: 'Success',
      message: 'Logged out successfully',
      color: 'blue',
    });
    
    onLogout();
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
        <Loader size="lg" />
      </Box>
    );
  }

  if (error) {
    return (
      <Paper p="md" mt={30}>
        <Text color="red" align="center">
          {error}
        </Text>
        <Button fullWidth onClick={onLogout} mt="md">
          Back to Login
        </Button>
      </Paper>
    );
  }

  return (
    <Paper shadow="xs" p="md" mt={30}>
      <Text size="xl" weight={700} align="center" mb={20}>
        Welcome, {user?.username}!
      </Text>
      
      <Text size="sm" mb={5}>
        <b>Username:</b> {user?.username}
      </Text>
      
      <Text size="sm" mb={20}>
        <b>Email:</b> {user?.email}
      </Text>
      
      <Group position="center">
        <Button color="red" onClick={handleLogout}>
          Logout
        </Button>
      </Group>
    </Paper>
  );
}

export default Profile;