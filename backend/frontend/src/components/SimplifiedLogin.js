import { useState } from 'react';
import { TextInput, PasswordInput, Button, Box, Text, Anchor, Paper, Group, Divider } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Get role-specific styling
const getRoleStyles = (role) => {
  switch(role) {
    case 'admin':
      return {
        color: 'var(--hrdc-dark-blue)',
        bgColor: 'var(--hrdc-blue-light)',
        icon: '👑',
        gradient: 'linear-gradient(135deg, var(--hrdc-dark-blue), var(--hrdc-blue-light))'
      };
    case 'staff':
      return {
        color: 'var(--hrdc-teal)',
        bgColor: 'var(--hrdc-teal-light)',
        icon: '👔',
        gradient: 'linear-gradient(135deg, var(--hrdc-teal), var(--hrdc-teal-light))'
      };
    case 'volunteer':
      return {
        color: 'var(--hrdc-gold)',
        bgColor: 'var(--hrdc-gold-light)',
        icon: '🌟',
        gradient: 'linear-gradient(135deg, var(--hrdc-gold), var(--hrdc-gold-light))'
      };
    default:
      return {
        color: 'var(--hrdc-teal)',
        bgColor: 'var(--hrdc-teal-light)',
        icon: '👤',
        gradient: 'linear-gradient(135deg, var(--hrdc-teal), var(--hrdc-teal-light))'
      };
  }
};

function SimplifiedLogin({ onLoginSuccess, switchToRegister, selectedRole }) {
  const [isLoading, setIsLoading] = useState(false);
  const roleStyles = getRoleStyles(selectedRole);

  const form = useForm({
    initialValues: {
      username: '',
      password: '',
    },
    validate: {
      username: (value) => (value.length < 3 ? 'Username must have at least 3 characters' : null),
      password: (value) => (value.length < 6 ? 'Password must have at least 6 characters' : null),
    },
  });

  const handleSubmit = async (values) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}/login`, {
        username: values.username,
        password: values.password
      });
      
      // Store user data with the selected role
      const userData = {
        ...response.data.user,
        selectedRole: selectedRole // Use the role selected on the welcome screen
      };
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      notifications.show({
        title: 'Success',
        message: 'Login successful!',
        color: 'green',
      });
      
      if (onLoginSuccess) {
        onLoginSuccess({
          ...response.data,
          user: userData
        });
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed. Please try again.';
      notifications.show({
        title: 'Error',
        message,
        color: 'red',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 450 }} mx="auto" mt={30}>
      <Paper p={40} radius="md" shadow="sm" withBorder>
        <Box 
          sx={{ 
            textAlign: 'center',
            marginBottom: 30
          }}
        >
          <Box
            sx={{
              width: 90,
              height: 90,
              borderRadius: '50%',
              background: roleStyles.gradient,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 15px',
              fontSize: '2.5rem',
              boxShadow: '0 8px 20px rgba(0,0,0,0.15)'
            }}
          >
            {roleStyles.icon}
          </Box>
          
          <Text 
            align="center" 
            sx={{ 
              color: roleStyles.color,
              fontSize: '1.1rem',
              fontWeight: 600
            }}
          >
            Login as
          </Text>
          
          <Text 
            size="xl" 
            weight={800} 
            align="center" 
            sx={{ 
              color: roleStyles.color,
              fontSize: '1.8rem',
              margin: '5px 0'
            }}
          >
            {selectedRole === 'admin' && 'Administrator'}
            {selectedRole === 'staff' && 'Staff Member'}
            {selectedRole === 'volunteer' && 'Volunteer'}
          </Text>
        </Box>
        
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            required
            label="Username or Email"
            placeholder="Your username or email"
            {...form.getInputProps('username')}
            mb={20}
            size="md"
          />
          
          <PasswordInput
            required
            label="Password"
            placeholder="Your password"
            {...form.getInputProps('password')}
            mb={30}
            size="md"
          />
          
          <Button 
            fullWidth 
            type="submit" 
            loading={isLoading} 
            mb={25}
            size="lg"
            sx={{
              background: roleStyles.gradient + ' !important',
              height: 50
            }}
          >
            Login
          </Button>
          
          <Divider 
            label="OR" 
            labelPosition="center" 
            my={20}
            sx={{ 
              '& .mantine-Divider-label': { 
                color: '#888',
                fontWeight: 500,
                fontSize: '0.85rem'
              } 
            }}
          />
          
          <Group position="center">
            <Text color="dimmed" size="sm" align="center">
              Don't have an account?{' '}
              <Anchor component="button" type="button" className="hrdc-link" onClick={switchToRegister}>
                Create Account
              </Anchor>
            </Text>
          </Group>
        </form>
      </Paper>
    </Box>
  );
}

export default SimplifiedLogin;