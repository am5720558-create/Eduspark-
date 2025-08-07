import React, { useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Chip,
  Rating,
} from '@mui/material';
import {
  PlayArrow,
  Schedule,
  People,
  Star,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { fetchFeaturedCourses } from '../store/slices/courseSlice';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { featuredCourses, isLoading } = useSelector((state: RootState) => state.courses);

  useEffect(() => {
    dispatch(fetchFeaturedCourses());
  }, [dispatch]);

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 12,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Learn Without Limits
          </Typography>
          <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
            Discover thousands of courses from expert instructors and advance your career
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              color="secondary"
              onClick={() => navigate('/courses')}
              sx={{ px: 4, py: 1.5 }}
            >
              Explore Courses
            </Button>
            <Button
              variant="outlined"
              size="large"
              color="inherit"
              onClick={() => navigate('/register')}
              sx={{ px: 4, py: 1.5 }}
            >
              Start Learning
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box sx={{ py: 8, backgroundColor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} textAlign="center">
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="h3" color="primary" fontWeight="bold">
                10K+
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Students
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="h3" color="primary" fontWeight="bold">
                500+
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Courses
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="h3" color="primary" fontWeight="bold">
                100+
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Instructors
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="h3" color="primary" fontWeight="bold">
                95%
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Success Rate
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Featured Courses */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            component="h2"
            textAlign="center"
            gutterBottom
            sx={{ mb: 6, fontWeight: 'bold' }}
          >
            Featured Courses
          </Typography>
          
          {isLoading ? (
            <Box textAlign="center">
              <Typography>Loading courses...</Typography>
            </Box>
          ) : (
            <Grid container spacing={4}>
              {featuredCourses.map((course) => (
                <Grid item xs={12} sm={6} md={4} key={course._id}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 4,
                      },
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="200"
                      image={course.thumbnail || '/api/placeholder/400/200'}
                      alt={course.title}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Chip
                          label={course.category}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                        <Chip
                          label={course.level}
                          size="small"
                          color="secondary"
                          variant="outlined"
                        />
                      </Box>
                      
                      <Typography variant="h6" component="h3" gutterBottom>
                        {course.title}
                      </Typography>
                      
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 2, height: 40, overflow: 'hidden' }}
                      >
                        {course.shortDescription}
                      </Typography>

                      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                        by {course.instructor.name}
                      </Typography>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Rating
                            value={course.rating.average}
                            precision={0.1}
                            readOnly
                            size="small"
                          />
                          <Typography variant="body2" sx={{ ml: 0.5 }}>
                            ({course.rating.count})
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Schedule fontSize="small" sx={{ mr: 0.5 }} />
                          <Typography variant="body2">
                            {formatDuration(course.duration)}
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="h6" color="primary" fontWeight="bold">
                          {course.price === 0 ? 'Free' : `$${course.price}`}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          <People fontSize="small" sx={{ mr: 0.5 }} />
                          {course.enrolledStudents.length} students
                        </Typography>
                      </Box>
                    </CardContent>
                    
                    <CardActions sx={{ p: 2, pt: 0 }}>
                      <Button
                        variant="contained"
                        fullWidth
                        startIcon={<PlayArrow />}
                        onClick={() => navigate(`/courses/${course._id}`)}
                      >
                        View Course
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          <Box textAlign="center" sx={{ mt: 6 }}>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/courses')}
            >
              View All Courses
            </Button>
          </Box>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          color: 'white',
          py: 8,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
            Ready to Start Learning?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Join thousands of students and unlock your potential today
          </Typography>
          <Button
            variant="contained"
            size="large"
            color="secondary"
            onClick={() => navigate('/register')}
            sx={{ px: 6, py: 2 }}
          >
            Get Started Now
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;