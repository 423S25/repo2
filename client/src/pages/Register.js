import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  TextInput, 
  PasswordInput, 
  Button, 
  Text, 
  Stack, 
  Group, 
  Title, 
  Divider, 
  Box 
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    initialValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validate: {
      username: (value) => (value.length >= 3 ? null : 'Username must be at least 3 characters'),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) => (value.length >= 6 ? null : 'Password must be at least 6 characters'),
      confirmPassword: (value, values) =>
        value === values.password ? null : 'Passwords do not match',
    },
  });

  const handleSubmit = async (values) => {
    setIsLoading(true);
    try {
      const success = await register(values.username, values.email, values.password);
      if (success) {
        // Add a small delay to show the notification before navigating
        setTimeout(() => {
          navigate('/login', { 
            state: { 
              message: 'Registration successful! Please log in with your credentials.',
              email: values.email
            } 
          });
        }, 1000);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <Box className="auth-card">
        <Title order={2} ta="center" mb="md" 
          sx={(theme) => ({
            color: theme.colors.green[7],
          })}
        >
          Join HRDC
        </Title>
        <Text c="dimmed" size="sm" ta="center" mb="xl">
          Enter your details to create a new account
        </Text>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <TextInput
              label="Username"
              placeholder="johndoe"
              required
              {...form.getInputProps('username')}
            />

            <TextInput
              label="Email"
              placeholder="your@email.com"
              required
              {...form.getInputProps('email')}
            />

            <PasswordInput
              label="Password"
              placeholder="Your password"
              required
              {...form.getInputProps('password')}
            />

            <PasswordInput
              label="Confirm Password"
              placeholder="Confirm your password"
              required
              {...form.getInputProps('confirmPassword')}
            />

            <Button 
              type="submit" 
              fullWidth 
              mt="xl" 
              loading={isLoading}
              gradient={{ from: 'green', to: 'teal', deg: 90 }}
              variant="gradient"
            >
              Create account
            </Button>
          </Stack>
        </form>

        <Divider label="Already have an account?" labelPosition="center" my="lg" />

        <Group justify="center">
          <Button component={Link} to="/login" variant="subtle">
            Sign in
          </Button>
        </Group>
      </Box>
    </div>
  );
};

export default Register;