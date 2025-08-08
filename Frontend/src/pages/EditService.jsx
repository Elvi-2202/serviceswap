import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  MenuItem,
  Grid,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { Link, useParams, useNavigate } from 'react-router-dom';
import "../App.css";

const EditServicePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [serviceData, setServiceData] = useState({
    titre: '',
    description: '',
    statut: '',
    category: ''
  });
  const [categories, setCategories] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // URL API backend Symfony
  const API_BASE_URL = 'http://localhost:8000/api/services';

  // Récupération token JWT dans localStorage si tu utilises JWT
  const token = localStorage.getItem('token');

  // --- GET service by id ---
  useEffect(() => {
    fetch(`${API_BASE_URL}/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    })
      .then(res => {
        if (!res.ok) throw new Error('Erreur chargement service');
        return res.json();
      })
      .then(data => {
        setServiceData({
          titre: data.titre || '',
          description: data.description || '',
          statut: data.statut || '',
          category: data.category?.id || ''
        });
      })
      .catch(err => console.error('Erreur chargement service:', err));
  }, [id, token]);

  // --- Récupérer les catégories soit via API (ici hardcodé) ---
  useEffect(() => {
    // Si tu as un API categories, utilise fetch ; sinon hardcode comme ici
    setCategories(['Ménage', 'Jardinage', 'Bricolage', 'Cours particuliers', 'Garde d\'enfants']);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setServiceData(prev => ({ ...prev, [name]: value }));
  };

  // --- PUT update service ---
  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      titre: serviceData.titre,
      description: serviceData.description,
      statut: serviceData.statut,
      category: serviceData.category
    };

    fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(payload)
    })
      .then(res => {
        if (res.ok) {
          navigate('/services');
        } else {
          throw new Error('Erreur mise à jour service');
        }
      })
      .catch(err => console.error(err));
  };

  // --- DELETE service ---
  const handleDelete = () => {
    fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    })
      .then(res => {
        if (res.ok) {
          navigate('/services');
        } else {
          throw new Error('Erreur suppression service');
        }
      })
      .catch(err => console.error(err));
  };

  return (
    <Box sx={{ p: 2, maxWidth: 800, margin: '0 auto' }}>
      {/* Header avec bouton retour */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton component={Link} to="/services" sx={{ mr: 2 }}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h4">Edit Service</Typography>
      </Box>

      <Paper sx={{ p: 3 }} component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Titre */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>Titre</Typography>
            <TextField
              fullWidth
              name="titre"
              value={serviceData.titre}
              onChange={handleChange}
              required
            />
          </Grid>

          {/* Description */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>Description</Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              name="description"
              value={serviceData.description}
              onChange={handleChange}
              required
            />
          </Grid>

          {/* Statut */}
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" gutterBottom>Statut</Typography>
            <FormControl fullWidth>
              <InputLabel>Select statut</InputLabel>
              <Select
                name="statut"
                value={serviceData.statut}
                onChange={handleChange}
                label="Select statut"
                required
              >
                <MenuItem value="Offered service">Offered service</MenuItem>
                <MenuItem value="Wanted service">Wanted service</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Catégorie */}
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" gutterBottom>Catégorie</Typography>
            <FormControl fullWidth>
              <InputLabel>Select category</InputLabel>
              <Select
                name="category"
                value={serviceData.category}
                onChange={handleChange}
                label="Select category"
                required
              >
                {categories.map((cat, idx) => (
                  <MenuItem key={idx} value={idx + 1}>{cat}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Boutons */}
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="contained"
              sx={{ backgroundColor: '#CF6B4D', '&:hover': { backgroundColor: '#b75a3d' } }}
              type="submit"
            >
              Enregistrer
            </Button>

            <Button
              variant="outlined"
              color="error"
              onClick={() => setDeleteDialogOpen(true)}
            >
              Supprimer
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Confirmation suppression */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir supprimer ce service ? Cette action est irréversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Annuler</Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDelete}
            autoFocus
          >
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EditServicePage;
