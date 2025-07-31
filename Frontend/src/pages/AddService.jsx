import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  MenuItem,
  Grid,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import "../App.css";

const AddServicePage = () => {
  const navigate = useNavigate();
  const [serviceData, setServiceData] = useState({
    titre: '',
    description: '',
    statut: '',
    category: ''
  });
  const [categories, setCategories] = useState([]);

  const API_BASE_URL = 'http://localhost:8000/api/services';


  useEffect(() => {
    // Hardcode ou fetch categories
    setCategories(['Ménage', 'Jardinage', 'Bricolage', 'Cours particuliers', 'Garde d\'enfants', 'Plomberie']);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setServiceData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch(API_BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(serviceData),
    })
      .then(res => {
        if (res.ok) {
          navigate('/services');
        } else {
          throw new Error('Erreur création service');
        }
      })
      .catch(err => console.error(err));
  };

  return (
    <Box sx={{ p: 2, maxWidth: 800, margin: '0 auto' }}>
      <Typography variant="h4" sx={{ mb: 3 }}>Ajouter un service</Typography>

      <Paper sx={{ p: 3 }} component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              label="Titre"
              name="titre"
              value={serviceData.titre}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Description"
              name="description"
              value={serviceData.description}
              onChange={handleChange}
              multiline
              rows={4}
              fullWidth
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>Statut</InputLabel>
              <Select
                name="statut"
                value={serviceData.statut}
                onChange={handleChange}
                label="Statut"
              >
                <MenuItem value="Offered service">Offered service</MenuItem>
                <MenuItem value="Wanted service">Wanted service</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>Catégorie</InputLabel>
              <Select
                name="category"
                value={serviceData.category}
                onChange={handleChange}
                label="Catégorie"
              >
                {categories.map((cat, idx) => (
                  <MenuItem key={idx} value={idx + 1}>{cat}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sx={{ textAlign: 'right' }}>
            <Button
              variant="contained"
              sx={{ backgroundColor: '#CF6B4D', '&:hover': { backgroundColor: '#b75a3d' } }}
              type="submit"
            >
              Ajouter
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default AddServicePage;
