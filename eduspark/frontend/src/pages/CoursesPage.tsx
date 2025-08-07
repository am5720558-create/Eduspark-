import React from 'react';
import { Box, Container, Typography } from '@mui/material';

const CoursesPage: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        All Courses
      </Typography>
      <Typography variant="body1">
        Courses page coming soon...
      </Typography>
    </Container>
  );
};

export default CoursesPage;