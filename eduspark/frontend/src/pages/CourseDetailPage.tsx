import React from 'react';
import { Box, Container, Typography } from '@mui/material';

const CourseDetailPage: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Course Details
      </Typography>
      <Typography variant="body1">
        Course detail page coming soon...
      </Typography>
    </Container>
  );
};

export default CourseDetailPage;