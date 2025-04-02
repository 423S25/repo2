
import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { 
  TextInput, 
  PasswordInput, 
  Button, 
  Text, 
  Stack, 
  Group, 
  Title, 
  Divider, 
  Box,
  Alert
} from '@mantine/core';
import { useForm, UseFormReturnType } from '@mantine/form';
import { useAuth } from '../contexts/AuthContext';

// Define the form values type
interface LoginFormValues {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [registrationMessage, setRegistrationMessage] = useState<string>('');

  // Define the form with types
  const form: UseFormReturnType<LoginFormValues> = useForm({
    initialValues: {
      email: location.state?.email || '',
      password: '',
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) => (value.length >= 1 ? null : 'Password is required'),
    },
  });

  useEffect(() => {
    if (location.state?.message) {
      setRegistrationMessage(location.state.message);
      // Clear the state after reading it
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  // Handle form submission
  const handleSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    try {
      const success = await login(values.email, values.password);
      if (success) {
        navigate('/dashboard');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-screen flex justify-center">
    <div className="auth-container">
      <Box className="auth-card">
        <Title order={2} ta="center" mb="md" 
        >
          Welcome to HRDC
        </Title>
        <Text c="dimmed" size="sm" ta="center" mb="xl">
          Enter your credentials to access your account
        </Text>

        {registrationMessage && (
          <Alert 
            color="green" 
            title="Registration Successful" 
            mb="lg"
            withCloseButton
            onClose={() => setRegistrationMessage('')}
          >
            {registrationMessage}
          </Alert>
        )}

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
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

            <Button 
              type="submit" 
              fullWidth 
              mt="xl" 
              loading={isLoading}
              gradient={{ from: 'green', to: 'teal', deg: 90 }}
              variant="gradient"
            >
              Sign in
            </Button>
          </Stack>
        </form>

        <Divider label="Don't have an account?" labelPosition="center" my="lg" />

        <Group justify="center">
          <Button component={Link} to="/register" variant="subtle">
            Create account
          </Button>
        </Group>
      </Box>
    </div>
  </div>
  );
};

export default Login;
