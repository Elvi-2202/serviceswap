import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  useMediaQuery,
} from '@mui/material';
import { Add, Delete, Edit } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';

const ServicesPage = () => {
  const isSmall = useMediaQuery('(max-width:600px)');
  const navigate = useNavigate();

  const [myServices, setMyServices] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);

  // URL API backend Symfony
  const API_BASE_URL = 'http://localhost:8000/api/services';

  // Récupération token JWT si tu utilises JWT (adapter si non)
  const token = localStorage.getItem('jwt_token');

  useEffect(() => {
    // Chargement des services avec header Authorization (si besoin)
    fetch(API_BASE_URL, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    })
      .then((res) => {
        if (!res.ok) throw new Error('Erreur chargement services');
        return res.json();
      })
      .then((data) => setMyServices(data))
      .catch((err) => {
        console.error(err);
        setMyServices([]); // en cas d'erreur
      });
  }, [token]);

  const handleDeleteClick = (service) => {
    setServiceToDelete(service);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!serviceToDelete) return;

    fetch(`${API_BASE_URL}/${serviceToDelete.id}`, {
      method: 'DELETE',
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    })
      .then((res) => {
        if (!res.ok) throw new Error('Erreur suppression service');
        // Mise à jour locale
        setMyServices((prev) => prev.filter((s) => s.id !== serviceToDelete.id));
        setDeleteDialogOpen(false);
        setServiceToDelete(null);
      })
      .catch((err) => {
        console.error(err);
        setDeleteDialogOpen(false);
      });
  };

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 4 },
        minHeight: '100vh',
        bgcolor: '#F9FAFB',
      }}
    >
      {/* En-tête */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: isSmall ? 'column' : 'row',
          justifyContent: 'space-between',
          alignItems: isSmall ? 'flex-start' : 'center',
          gap: 2,
          mb: 3,
        }}
      >
        <Typography variant={isSmall ? 'h5' : 'h4'} fontWeight={600}>
          Mes Services
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          component={Link}
          to="/add-service"
          fullWidth={isSmall}
          sx={{
            backgroundColor: '#CF6B4D',
            '&:hover': { backgroundColor: '#b75a3d' },
            textTransform: 'none',
            fontWeight: 500,
          }}
        >
          Ajouter un service
        </Button>
      </Box>

      {/* Liste des services */}
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2 }}>
        {myServices.length === 0 ? (
          <Typography textAlign="center" color="text.secondary">
            Aucun service disponible.
          </Typography>
        ) : (
          <List>
            {myServices.map((service) => (
              <React.Fragment key={service.id}>
                <ListItem
                  alignItems="flex-start"
                  secondaryAction={
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton
                        edge="end"
                        aria-label="edit"
                        onClick={() => navigate(`/edit-service/${service.id}`)}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleDeleteClick(service)}
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  }
                  sx={{
                    flexDirection: isSmall ? 'column' : 'row',
                    alignItems: isSmall ? 'flex-start' : 'center',
                    gap: 1,
                  }}
                >
                  <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                    {service.titre?.charAt(0) || '?'}
                  </Avatar>
                  <ListItemText
                    primary={
                      <Typography fontWeight={600}>{service.titre}</Typography>
                    }
                    secondary={
                      <Typography variant="body2" color="text.secondary">
                        {service.description} — {service.category?.name || ''}
                      </Typography>
                    }
                  />
                </ListItem>
                <Divider component="li" />
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>

      {/* Dialogue confirmation suppression */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir supprimer le service "
            {serviceToDelete?.titre}" ? Cette action est irréversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Annuler</Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleConfirmDelete}
            autoFocus
            sx={{ bgcolor: '#CF6B4D', '&:hover': { bgcolor: '#b75a3d' } }}
          >
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ServicesPage;
