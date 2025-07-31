import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Rating,
  Grid,
  Checkbox,
  TextField,
  Button,
  Paper,
  useMediaQuery
} from '@mui/material';

const criteria = ["Efficiency", "Quality", "Professionalism", "Collaborative", "Satisfaction"];

const Feedback = () => {
  const isSmall = useMediaQuery('(max-width:600px)');
  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState('');
  const [selectedValues, setSelectedValues] = useState({});

  const handleCheckboxChange = (criterion, value) => {
    setSelectedValues((prev) => ({ ...prev, [criterion]: value }));
  };

  const handleSubmit = () => {
    console.log({ rating, selectedValues, comments });
    alert("Feedback submitted successfully!");
  };

  return (
    <Container maxWidth="sm" sx={{ py: { xs: 3, sm: 6 } }}>
      <Typography
        variant="h5"
        fontWeight="bold"
        align="center"
        sx={{ mb: 3 }}
      >
        Feedback
      </Typography>

      <Paper
        elevation={3}
        sx={{
          p: { xs: 2, sm: 4 },
          borderRadius: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <Typography variant="h6">Rate your experience</Typography>

        <Box>
          <Rating value={rating} size="large" onChange={(_, val) => setRating(val)} />
        </Box>

        {/* Entêtes évaluation */}
        <Box>
          <Grid container spacing={1} alignItems="center" sx={{ mb: 1 }}>
            <Grid item xs={6}>
              <Typography variant="body2" fontWeight={500}>
                Evaluation Criteria
              </Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography variant="body2" align="center">Mediocre</Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography variant="body2" align="center">Acceptable</Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography variant="body2" align="center">Good</Typography>
            </Grid>
          </Grid>

          {criteria.map((criterion) => (
            <Grid container spacing={1} alignItems="center" key={criterion}>
              <Grid item xs={6}>
                <Typography variant="body2">{criterion}</Typography>
              </Grid>

              {['Mediocre', 'Acceptable', 'Good'].map((value) => (
                <Grid item xs={2} key={value} sx={{ textAlign: 'center' }}>
                  <Checkbox
                    checked={selectedValues[criterion] === value}
                    onChange={() => handleCheckboxChange(criterion, value)}
                    size={isSmall ? 'small' : 'medium'}
                  />
                </Grid>
              ))}
            </Grid>
          ))}
        </Box>

        {/* Zone commentaire */}
        <Box>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Comments
          </Typography>
          <TextField
            fullWidth
            multiline
            minRows={3}
            variant="outlined"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
          />
        </Box>

        {/* Bouton Submit */}
        <Button
          fullWidth
          variant="contained"
          size="large"
          sx={{
            backgroundColor: '#CF6B4D',
            textTransform: "none",
            fontWeight: 600,
            '&:hover': {
              backgroundColor: '#b34a34'
            }
          }}
          onClick={handleSubmit}
        >
          SUBMIT
        </Button>
      </Paper>
    </Container>
  );
};

export default Feedback;
