import { useState } from 'react';
import { TextInput, PasswordInput, Button, Group, Box, Text, Anchor, SegmentedControl, Stack } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

function Login({ onLoginSuccess, switchToRegister }) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    initialValues: {
      username: '',
      password: '',
      role: 'volunteer'
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
      
      // Store user data with the selected role (we'll update on backend later)
      const userData = {
        ...response.data.user,
        selectedRole: values.role // Add the user-selected role for display purposes
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
    <Box sx={{ maxWidth: 400 }} mx="auto" mt={30}>
      <Text size="xl" weight={700} align="center" mb={30} color="var(--hrdc-teal)">
        Welcome Back
      </Text>
      
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          required
          label="Username or Email"
          placeholder="Your username or email"
          {...form.getInputProps('username')}
          mb={15}
        />
        
        <PasswordInput
          required
          label="Password"
          placeholder="Your password"
          {...form.getInputProps('password')}
          mb={20}
        />
        
        <Stack spacing={5} mb={25}>
          <Text weight={500} size="sm">I am logging in as:</Text>
          <SegmentedControl
            fullWidth
            data={[
              { label: 'Admin', value: 'admin' },
              { label: 'Staff', value: 'staff' },
              { label: 'Volunteer', value: 'volunteer' },
            ]}
            {...form.getInputProps('role')}
          />
        </Stack>
        
        <Group position="apart" mb={15}>
          <Anchor component="button" type="button" className="hrdc-link" size="sm">
            Forgot password?
          </Anchor>
        </Group>
        
        <Button fullWidth type="submit" loading={isLoading}>
          Login
        </Button>
        
        <Text color="dimmed" size="sm" align="center" mt={20}>
          Don't have an account?{' '}
          <Anchor component="button" type="button" className="hrdc-link" onClick={switchToRegister}>
            Register
          </Anchor>
        </Text>
      </form>
    </Box>
  );
}

export default Login;