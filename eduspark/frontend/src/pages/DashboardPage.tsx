import React from 'react';
import { Box, Container, Typography } from '@mui/material';

const DashboardPage: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="body1">
        Dashboard page coming soon...
      </Typography>
    </Container>
  );
};

export default DashboardPage;