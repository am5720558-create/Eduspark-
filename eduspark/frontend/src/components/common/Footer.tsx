import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Link,
  IconButton,
} from '@mui/material';
import {
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  YouTube,
} from '@mui/icons-material';

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: 'primary.dark',
        color: 'white',
        py: 6,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* About Section */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              EduSpark
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Empowering learners worldwide with high-quality online education.
              Join thousands of students and start your learning journey today.
            </Typography>
            <Box>
              <IconButton color="inherit" size="small">
                <Facebook />
              </IconButton>
              <IconButton color="inherit" size="small">
                <Twitter />
              </IconButton>
              <IconButton color="inherit" size="small">
                <Instagram />
              </IconButton>
              <IconButton color="inherit" size="small">
                <LinkedIn />
              </IconButton>
              <IconButton color="inherit" size="small">
                <YouTube />
              </IconButton>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Link color="inherit" href="/courses" sx={{ mb: 1 }}>
                All Courses
              </Link>
              <Link color="inherit" href="/about" sx={{ mb: 1 }}>
                About Us
              </Link>
              <Link color="inherit" href="/contact" sx={{ mb: 1 }}>
                Contact
              </Link>
              <Link color="inherit" href="/blog" sx={{ mb: 1 }}>
                Blog
              </Link>
              <Link color="inherit" href="/careers" sx={{ mb: 1 }}>
                Careers
              </Link>
            </Box>
          </Grid>

          {/* Categories */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Categories
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Link color="inherit" href="/courses?category=Programming" sx={{ mb: 1 }}>
                Programming
              </Link>
              <Link color="inherit" href="/courses?category=Design" sx={{ mb: 1 }}>
                Design
              </Link>
              <Link color="inherit" href="/courses?category=Business" sx={{ mb: 1 }}>
                Business
              </Link>
              <Link color="inherit" href="/courses?category=Marketing" sx={{ mb: 1 }}>
                Marketing
              </Link>
              <Link color="inherit" href="/courses?category=Data Science" sx={{ mb: 1 }}>
                Data Science
              </Link>
            </Box>
          </Grid>

          {/* Support */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" gutterBottom>
              Support
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Link color="inherit" href="/help" sx={{ mb: 1 }}>
                Help Center
              </Link>
              <Link color="inherit" href="/terms" sx={{ mb: 1 }}>
                Terms of Service
              </Link>
              <Link color="inherit" href="/privacy" sx={{ mb: 1 }}>
                Privacy Policy
              </Link>
              <Link color="inherit" href="/refund" sx={{ mb: 1 }}>
                Refund Policy
              </Link>
              <Link color="inherit" href="/support" sx={{ mb: 1 }}>
                Contact Support
              </Link>
            </Box>
          </Grid>
        </Grid>

        {/* Copyright */}
        <Box
          sx={{
            borderTop: 1,
            borderColor: 'rgba(255, 255, 255, 0.2)',
            pt: 3,
            mt: 4,
            textAlign: 'center',
          }}
        >
          <Typography variant="body2">
            © {new Date().getFullYear()} EduSpark. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;