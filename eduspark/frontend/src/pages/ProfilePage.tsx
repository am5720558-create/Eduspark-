import React from 'react';
import { Box, Container, Typography } from '@mui/material';

const ProfilePage: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Profile
      </Typography>
      <Typography variant="body1">
        Profile page coming soon...
      </Typography>
    </Container>
  );
};

export default ProfilePage;