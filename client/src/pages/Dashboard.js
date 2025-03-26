import React from 'react';
import { Title, Text, Box, Center, Paper } from '@mantine/core';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="page-container">
      <Center style={{ height: '80vh' }}>
        <Paper p="xl" shadow="md" radius="md" withBorder style={{ width: '80%', maxWidth: '600px' }}>
          <Box ta="center">
            <Title
              order={1}
              sx={(theme) => ({
                color: theme.colors.green[7],
                marginBottom: '20px',
              })}
            >
              Success!
            </Title>
            <Text size="xl" mb="md">
              You have successfully logged in.
            </Text>
            <Text c="dimmed">
              Welcome, {user?.username || 'User'}
            </Text>
          </Box>
        </Paper>
      </Center>
    </div>
  );
};

export default Dashboard;