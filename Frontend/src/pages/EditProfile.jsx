import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  IconButton,
  useMediaQuery,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { Link, useParams, useNavigate } from 'react-router-dom';

const EditServicePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isSmall = useMediaQuery('(max-width:600px)');

  const [serviceData, setServiceData] = useState({
    titre: '',
    description: '',
    statut: '',
    category: '',
  });
  const [categories, setCategories] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const API_BASE_URL = 'http://localhost:8000/api/services';

  // Récupérer le service à éditer
  useEffect(() => {
    fetch(`${API_BASE_URL}/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setServiceData({
          titre: data.titre || '',
          description: data.description || '',
          statut: data.statut || '',
          category: data.category?.id || '',
        });
      })
      .catch((err) => console.error('Erreur chargement service:', err));
  }, [id]);

  useEffect(() => {
    // Hardcode categories - adapte si tu as une API categories
    setCategories(['Ménage', 'Jardinage', 'Bricolage', 'Cours particuliers', "Garde d'enfants"]);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setServiceData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      titre: serviceData.titre,
      description: serviceData.description,
      statut: serviceData.statut,
      category: serviceData.category,
    };

    fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (res.ok) {
          navigate('/services');
        } else {
          throw new Error('Erreur mise à jour service');
        }
      })
      .catch((err) => console.error(err));
  };

  const handleDelete = () => {
    fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
    })
      .then((res) => {
        if (res.ok) {
          navigate('/services');
        } else {
          throw new Error('Erreur suppression service');
        }
      })
      .catch((err) => console.error(err));
  };

  return (
    <Box sx={{ p: 2, maxWidth: 800, mx: 'auto' }}>
      {/* Header avec bouton retour */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton component={Link} to="/services" sx={{ mr: 2 }}>
          <ArrowBack />
        </IconButton>
        <Typography variant={isSmall ? 'h5' : 'h4'} fontWeight={600}>
          Modifier le service
        </Typography>
      </Box>

      <Paper component="form" onSubmit={handleSubmit} sx={{ p: { xs: 2, sm: 3 } }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Titre
            </Typography>
            <TextField
              fullWidth
              name="titre"
              value={serviceData.titre}
              onChange={handleChange}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Description
            </Typography>
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

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" gutterBottom>
              Statut
            </Typography>
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
            <Typography variant="subtitle1" gutterBottom>
              Catégorie
            </Typography>
            <FormControl fullWidth required>
              <InputLabel>Catégorie</InputLabel>
              <Select
                name="category"
                value={serviceData.category}
                onChange={handleChange}
                label="Catégorie"
              >
                {categories.map((cat, idx) => (
                  <MenuItem key={idx} value={idx + 1}>
                    {cat}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid
            item
            xs={12}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              flexDirection: isSmall ? 'column' : 'row',
              gap: 2,
            }}
          >
            <Button
              variant="contained"
              type="submit"
              sx={{
                backgroundColor: '#CF6B4D',
                '&:hover': { backgroundColor: '#b75a3d' },
                textTransform: 'none',
                fontWeight: 600,
                flexGrow: 1,
              }}
            >
              Enregistrer
            </Button>

            <Button
              variant="outlined"
              color="error"
              onClick={() => setDeleteDialogOpen(true)}
              sx={{ flexGrow: 1 }}
            >
              Supprimer
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Confirmation suppression */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir supprimer ce service ? Cette action est irréversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Annuler</Button>
          <Button variant="contained" color="error" onClick={handleDelete} autoFocus>
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EditServicePage;
