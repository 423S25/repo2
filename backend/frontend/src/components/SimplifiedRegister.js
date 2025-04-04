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

function SimplifiedRegister({ switchToLogin, selectedRole }) {
  const [isLoading, setIsLoading] = useState(false);
  const roleStyles = getRoleStyles(selectedRole);

  const form = useForm({
    initialValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validate: {
      username: (value) => (value.length < 3 ? 'Username must have at least 3 characters' : null),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) => (value.length < 6 ? 'Password must have at least 6 characters' : null),
      confirmPassword: (value, values) =>
        value !== values.password ? 'Passwords did not match' : null,
    },
  });

  const handleSubmit = async (values) => {
    setIsLoading(true);
    try {
      await axios.post(`${API_URL}/register`, {
        username: values.username,
        email: values.email,
        password: values.password,
        role: selectedRole, // Use the role selected on the welcome screen
      });
      
      notifications.show({
        title: 'Success',
        message: 'Account created successfully! You can now login.',
        color: 'green',
      });
      
      // Redirect to login after successful registration
      switchToLogin();
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
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
            Create a new account as
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
            label="Username"
            placeholder="Choose a username"
            {...form.getInputProps('username')}
            mb={15}
            size="md"
          />
          
          <TextInput
            required
            label="Email"
            placeholder="your@email.com"
            {...form.getInputProps('email')}
            mb={15}
            size="md"
          />
          
          <PasswordInput
            required
            label="Password"
            placeholder="Create a strong password"
            {...form.getInputProps('password')}
            mb={15}
            size="md"
          />
          
          <PasswordInput
            required
            label="Confirm Password"
            placeholder="Confirm your password"
            {...form.getInputProps('confirmPassword')}
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
            Create Account
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
              Already have an account?{' '}
              <Anchor component="button" type="button" className="hrdc-link" onClick={switchToLogin}>
                Login
              </Anchor>
            </Text>
          </Group>
        </form>
      </Paper>
    </Box>
  );
}

export default SimplifiedRegister;