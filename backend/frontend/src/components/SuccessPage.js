import React from 'react';
import { Paper, Text, Button, Box, Title, Group, Container, ThemeIcon, Divider, Grid } from '@mantine/core';

// Get role-specific styling
const getRoleStyles = (role) => {
  switch(role) {
    case 'admin':
      return {
        color: 'var(--hrdc-dark-blue)',
        bgColor: 'var(--hrdc-blue-light)',
        icon: '👑',
        gradient: 'linear-gradient(135deg, var(--hrdc-dark-blue), var(--hrdc-blue-light))',
        features: [
          { title: 'User Management', desc: 'Manage system access and permissions' },
          { title: 'Reports & Analytics', desc: 'Access comprehensive system reports' },
          { title: 'System Configuration', desc: 'Configure and customize settings' }
        ]
      };
    case 'staff':
      return {
        color: 'var(--hrdc-teal)',
        bgColor: 'var(--hrdc-teal-light)',
        icon: '👔',
        gradient: 'linear-gradient(135deg, var(--hrdc-teal), var(--hrdc-teal-light))',
        features: [
          { title: 'Client Records', desc: 'Access and manage client information' },
          { title: 'Appointment Scheduling', desc: 'Schedule and track appointments' },
          { title: 'Resource Management', desc: 'Manage available resources' }
        ]
      };
    case 'volunteer':
      return {
        color: 'var(--hrdc-gold)',
        bgColor: 'var(--hrdc-gold-light)',
        icon: '🌟',
        gradient: 'linear-gradient(135deg, var(--hrdc-gold), var(--hrdc-gold-light))',
        features: [
          { title: 'Event Calendar', desc: 'View upcoming volunteer opportunities' },
          { title: 'Time Tracking', desc: 'Log and track volunteer hours' },
          { title: 'Resource Access', desc: 'Access volunteer resources and guides' }
        ]
      };
    default:
      return {
        color: 'var(--hrdc-teal)',
        bgColor: 'var(--hrdc-teal-light)',
        icon: '👤',
        gradient: 'linear-gradient(135deg, var(--hrdc-teal), var(--hrdc-teal-light))',
        features: []
      };
  }
};

function SuccessPage({ user, onLogout }) {
  // Use the selected role from welcome page if available
  const role = user?.selectedRole || user?.role;
  const roleStyles = getRoleStyles(role);
  
  // Get the current date and time
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const formattedTime = currentDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
  
  // Determine role-specific message
  const getRoleMessage = () => {
    switch (role) {
      case 'admin':
        return 'You have full administrative access to the HRDC system. You can manage users, view reports, and configure system settings.';
      case 'staff':
        return 'You have staff-level access to the HRDC system. You can access client records, schedule appointments, and manage daily operations.';
      case 'volunteer':
        return 'Thank you for volunteering with HRDC! Your contribution helps us create pathways from poverty to sustainability for our community.';
      default:
        return '';
    }
  };
  
  // Get role display text
  const getRoleDisplay = () => {
    switch (role) {
      case 'admin':
        return 'Administrator';
      case 'staff':
        return 'Staff Member';
      case 'volunteer':
        return 'Volunteer';
      default:
        return role;
    }
  };

  return (
    <Container size="lg" sx={{ textAlign: 'center', paddingTop: 20, paddingBottom: 50 }}>
      <Box
        sx={{
          position: 'relative',
          marginBottom: 40,
          '&::before': {
            content: '""',
            position: 'absolute',
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: 'radial-gradient(circle, var(--hrdc-teal-ultra-light) 0%, rgba(228,245,246,0) 70%)',
            top: -20,
            left: -50,
            zIndex: -1
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            width: 180,
            height: 180,
            borderRadius: '50%',
            background: 'radial-gradient(circle, var(--hrdc-gold-ultra-light) 0%, rgba(255,245,224,0) 70%)',
            bottom: -30,
            right: -40,
            zIndex: -1
          }
        }}
      >
        <Title 
          order={1} 
          sx={{ 
            fontSize: '3.5rem', 
            fontWeight: 800, 
            color: 'var(--hrdc-dark-blue)',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)',
            marginBottom: 10,
            background: `linear-gradient(135deg, var(--hrdc-dark-blue), ${roleStyles.color})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            display: 'inline-block'
          }}
        >
          Login Successful!
        </Title>
        
        <Text 
          size="lg"
          sx={{
            color: 'var(--hrdc-teal)',
            fontWeight: 500,
            margin: '0 auto',
            maxWidth: 600,
            fontSize: '1.4rem'
          }}
        >
          Welcome to the Human Resource Development Council
        </Text>
      </Box>
      
      <Paper 
        p={50} 
        radius="lg" 
        shadow="md" 
        withBorder
        sx={{
          overflow: 'hidden',
          position: 'relative',
          marginBottom: 30
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 10,
            background: roleStyles.gradient,
            zIndex: 1
          }}
        />
        
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 20
          }}
        >
          <Box
            sx={{
              width: 130,
              height: 130,
              borderRadius: '50%',
              background: roleStyles.gradient,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '3.5rem',
              boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
              marginBottom: 15,
              border: '6px solid white'
            }}
          >
            {roleStyles.icon}
          </Box>
          
          <Box sx={{ marginBottom: 20 }}>
            <Text 
              size="xl" 
              weight={800}
              sx={{
                fontSize: '2.8rem',
                color: roleStyles.color,
                marginBottom: 15,
                lineHeight: 1.1
              }}
            >
              Hello, {user?.username}!
            </Text>
            
            <span className="success-badge" style={{ fontSize: '1.3rem', padding: '12px 30px' }}>
              {getRoleDisplay()}
            </span>
          </Box>
          
          <Text 
            sx={{
              color: '#666',
              fontSize: '1.1rem',
              marginBottom: 10
            }}
          >
            {formattedDate} • {formattedTime}
          </Text>
          
          <Divider 
            sx={{ width: '70%', margin: '15px 0 30px' }}
          />
          
          <Text 
            size="lg" 
            sx={{ 
              maxWidth: 600, 
              margin: '0 auto 40px',
              lineHeight: 1.7,
              color: '#444',
              fontSize: '1.25rem'
            }}
          >
            {getRoleMessage()}
          </Text>
          
          {/* Feature boxes */}
          <Text
            weight={700}
            sx={{
              fontSize: '1.4rem',
              color: roleStyles.color,
              marginBottom: 25,
              marginTop: 10
            }}
          >
            Available Features
          </Text>
          
          <Grid gutter={30} sx={{ width: '100%', maxWidth: 900 }}>
            {roleStyles.features.map((feature, index) => (
              <Grid.Col key={index} span={12} md={4}>
                <Paper
                  p={20}
                  radius="md"
                  shadow="sm"
                  withBorder
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderTop: `4px solid ${roleStyles.color}`,
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                    }
                  }}
                >
                  <Text weight={700} size="lg" mb={8} color={roleStyles.color}>
                    {feature.title}
                  </Text>
                  <Text size="sm" color="dimmed" align="center">
                    {feature.desc}
                  </Text>
                </Paper>
              </Grid.Col>
            ))}
          </Grid>
          
          <Button 
            onClick={onLogout} 
            variant="filled"
            size="lg"
            sx={{
              background: roleStyles.gradient + ' !important',
              padding: '0 40px',
              height: 50,
              marginTop: 50,
              fontSize: '1.1rem'
            }}
          >
            Logout
          </Button>
        </Box>
      </Paper>
      
      <Box 
        sx={{ 
          padding: '15px 25px', 
          borderRadius: '8px',
          backgroundColor: 'rgba(255, 255, 255, 0.5)',
          maxWidth: '80%',
          margin: '0 auto'
        }}
      >
        <Text color="dimmed" size="sm">
          For technical support, please contact <Text component="span" weight={600} color={roleStyles.color}>support@hrdc.org</Text> or call (555) 123-4567
        </Text>
      </Box>
    </Container>
  );
}

export default SuccessPage;