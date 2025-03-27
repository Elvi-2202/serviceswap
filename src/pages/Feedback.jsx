import React, { useState } from "react";
import { Container, Typography, Box, Rating, Grid, Checkbox, TextField, Button, Paper } from "@mui/material";
import "../App.css";

const criteria = ["Efficiency", "Quality", "Professionalism", "Collaborative", "Satisfaction"];

const Feedback = () => {
  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState("");
  const [selectedValues, setSelectedValues] = useState({});

  const handleCheckboxChange = (criterion, value) => {
    setSelectedValues((prev) => ({ ...prev, [criterion]: value }));
  };

  const handleSubmit = () => {
    console.log({ rating, selectedValues, comments });
    alert("Feedback submitted successfully!");
  };

  return (
    <Container maxWidth="xs" className="feedback-container">
      <Typography variant="h5" className="feedback-title" gutterBottom>Feedback</Typography>
      <Paper elevation={3} className="feedback-paper">
        <Typography variant="h6">Rate your experience</Typography>
        <Rating value={rating} onChange={(event, newValue) => setRating(newValue)} size="large" />
        <Box mt={2}>
          <Grid container spacing={1} alignItems="center">
            <Grid item xs={6}><Typography variant="body2">Evaluation Criteria</Typography></Grid>
            <Grid item xs={2}><Typography variant="body2">Mediocre</Typography></Grid>
            <Grid item xs={2}><Typography variant="body2">Acceptable</Typography></Grid>
            <Grid item xs={2}><Typography variant="body2">Good</Typography></Grid>
          </Grid>
          {criteria.map((criterion) => (
            <Grid container spacing={1} alignItems="center" key={criterion}>
              <Grid item xs={6}><Typography variant="body2">{criterion}</Typography></Grid>
              {["Mediocre", "Acceptable", "Good"].map((value) => (
                <Grid item xs={2} key={value}>
                  <Checkbox
                    checked={selectedValues[criterion] === value}
                    onChange={() => handleCheckboxChange(criterion, value)}
                  />
                </Grid>
              ))}
            </Grid>
          ))}
        </Box>
        <Typography variant="body2" mt={2}>Comments</Typography>
        <TextField
          fullWidth
          multiline
          rows={3}
          variant="outlined"
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          className="feedback-textfield"
        />
        <Button
          variant="contained"
          className="feedback-submit"
          fullWidth
          onClick={handleSubmit}
        >SUBMIT</Button>
      </Paper>
    </Container>
  );
};

export default Feedback;
