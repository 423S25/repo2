import React from 'react';
import { Box, Button, Stack, Title, Text, Paper, Group, Divider } from '@mantine/core';

function WelcomePage({ onRoleSelect }) {
  return (
    <Box sx={{ textAlign: 'center', maxWidth: 650 }} mx="auto" mt={10}>
      <Title 
        order={1} 
        sx={{ 
          color: 'var(--hrdc-dark-blue)', 
          marginBottom: 15,
          fontSize: '3.2rem',
          fontWeight: 800,
          letterSpacing: '-1px',
          lineHeight: 1.1
        }}
      >
        Welcome to HRDC
      </Title>
      
      <Text 
        size="xl" 
        mb={30} 
        sx={{ 
          color: 'var(--hrdc-teal)',
          maxWidth: '500px',
          margin: '0 auto 30px auto',
          fontSize: '1.4rem',
          fontWeight: 500
        }}
      >
        Please select how you would like to log in
      </Text>
      
      {/* Quote box */}
      <Box 
        sx={{ 
          maxWidth: '88%', 
          margin: '0 auto 40px',
          padding: '20px 30px',
          borderRadius: '15px',
          background: 'rgba(255, 255, 255, 0.5)',
          border: '1px solid rgba(16, 113, 120, 0.1)',
          position: 'relative'
        }}
      >
        <Text 
          size="md" 
          color="dimmed" 
          sx={{
            fontStyle: 'italic',
            lineHeight: 1.6,
            fontSize: '1.05rem',
            position: 'relative',
            zIndex: 1
          }}
        >
          "Every time we've been able to make a difference at HRDC, it's been because we had the right people in the right roles working toward a common goal."
        </Text>
        <Box sx={{ 
          position: 'absolute', 
          top: 10, 
          left: 10, 
          fontSize: '3rem', 
          opacity: 0.1, 
          color: 'var(--hrdc-teal)' 
        }}>
          "
        </Box>
      </Box>
      
      <Paper p={45} radius="lg" shadow="md" withBorder>
        <Stack spacing={30}>
          <Button 
            size="xl" 
            fullWidth 
            onClick={() => onRoleSelect('admin')}
            sx={{
              height: 100,
              backgroundColor: 'var(--hrdc-dark-blue)',
              '&:hover': { backgroundColor: 'var(--hrdc-blue-light)' }
            }}
            leftIcon={
              <Box className="role-icon" sx={{ fontSize: '2.3rem' }}>👑</Box>
            }
          >
            <Text sx={{ fontSize: '1.5rem', fontWeight: 700 }}>Administrator</Text>
          </Button>
          
          <Button 
            size="xl" 
            fullWidth 
            onClick={() => onRoleSelect('staff')}
            sx={{
              height: 100,
              backgroundColor: 'var(--hrdc-teal)',
              '&:hover': { backgroundColor: 'var(--hrdc-teal-light)' }
            }}
            leftIcon={
              <Box className="role-icon" sx={{ fontSize: '2.3rem' }}>👔</Box>
            }
          >
            <Text sx={{ fontSize: '1.5rem', fontWeight: 700 }}>Staff Member</Text>
          </Button>
          
          <Button 
            size="xl" 
            fullWidth 
            onClick={() => onRoleSelect('volunteer')}
            sx={{
              height: 100,
              backgroundColor: 'var(--hrdc-gold)',
              color: 'var(--hrdc-dark-blue)',
              '&:hover': { backgroundColor: 'var(--hrdc-gold-light)' }
            }}
            leftIcon={
              <Box className="role-icon" sx={{ fontSize: '2.3rem' }}>🌟</Box>
            }
          >
            <Text sx={{ fontSize: '1.5rem', fontWeight: 700 }}>Volunteer</Text>
          </Button>
        </Stack>
      </Paper>
      
      <Box mt={40} mb={20}>
        <Divider 
          label="OUR MISSION" 
          labelPosition="center" 
          sx={{ 
            '& .mantine-Divider-label': { 
              color: 'var(--hrdc-dark-blue)',
              fontWeight: 700,
              fontSize: '1rem',
              letterSpacing: '1px'
            },
            marginBottom: 20
          }}
        />
        
        <Text 
          size="md" 
          sx={{
            maxWidth: '80%',
            margin: '0 auto',
            fontSize: '1.1rem',
            lineHeight: 1.6,
            color: '#555'
          }}
        >
          Human Resource Development Council provides assistance to those in need and helps create pathways from poverty to sustainability through community collaboration.
        </Text>
      </Box>
    </Box>
  );
}

export default WelcomePage;