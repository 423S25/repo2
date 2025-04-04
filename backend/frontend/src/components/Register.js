import { useState } from 'react';
import { TextInput, PasswordInput, Button, Box, Text, Anchor, SegmentedControl, Stack } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

function Register({ switchToLogin }) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    initialValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'volunteer',
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
        role: values.role,
      });
      
      notifications.show({
        title: 'Success',
        message: 'Account created successfully! You can now login.',
        color: 'green',
      });
      
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
    <Box sx={{ maxWidth: 400 }} mx="auto" mt={30}>
      <Text size="xl" weight={700} align="center" mb={30}>
        Create an Account
      </Text>
      
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          required
          label="Username"
          placeholder="Your username"
          {...form.getInputProps('username')}
          mb={15}
        />
        
        <TextInput
          required
          label="Email"
          placeholder="your@email.com"
          {...form.getInputProps('email')}
          mb={15}
        />
        
        <PasswordInput
          required
          label="Password"
          placeholder="Your password"
          {...form.getInputProps('password')}
          mb={15}
        />
        
        <PasswordInput
          required
          label="Confirm Password"
          placeholder="Confirm your password"
          {...form.getInputProps('confirmPassword')}
          mb={20}
        />
        
        <Stack spacing={5} mb={25}>
          <Text weight={500} size="sm">I am registering as:</Text>
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
        
        <Button fullWidth type="submit" loading={isLoading}>
          Register
        </Button>
        
        <Text color="dimmed" size="sm" align="center" mt={20}>
          Already have an account?{' '}
          <Anchor component="button" type="button" className="hrdc-link" onClick={switchToLogin}>
            Login
          </Anchor>
        </Text>
      </form>
    </Box>
  );
}

export default Register;