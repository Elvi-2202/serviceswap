// src/components/CategoriesPage.js

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Paper,
  Snackbar,
  Alert,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

// Centralisation des URLs API
const API_URLS = {
  getCategories: 'http://localhost:8000/api/categorie',
  createCategory: 'http://localhost:8000/api/categorie/new',
  editCategory: (id) => `http://localhost:8000/api/categorie/${id}/edit`,
  deleteCategory: (id) => `http://localhost:8000/api/categorie/${id}`,
};

// Fonction d'aide pour gérer les requêtes fetch de manière DRY (Don't Repeat Yourself)
const apiFetch = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });
  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(errorData || 'Une erreur est survenue.');
  }
  return response.json();
};

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [name, setName] = useState('');
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState('');

  const [deleteId, setDeleteId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  // Correction de l'erreur : La fonction de fetch est maintenant à l'intérieur de l'effet.
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const data = await apiFetch(API_URLS.getCategories);
        setCategories(data);
      } catch (e) {
        handleSnackbarOpen(e.message, 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleCreate = async () => {
    if (!name.trim()) {
      handleSnackbarOpen('Le nom de la catégorie est requis.', 'warning');
      return;
    }

    setIsCreating(true);
    try {
      const newCat = await apiFetch(API_URLS.createCategory, {
        method: 'POST',
        body: JSON.stringify({ name: name.trim() }),
      });
      setCategories((prev) => [...prev, newCat]);
      setName('');
      handleSnackbarOpen('Catégorie ajoutée avec succès !', 'success');
    } catch (e) {
      handleSnackbarOpen(e.message, 'error');
    } finally {
      setIsCreating(false);
    }
  };

  const startEdit = (cat) => {
    setEditId(cat.id);
    setEditName(cat.name);
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditName('');
  };

  const handleEditSave = async () => {
    if (!editName.trim()) {
      handleSnackbarOpen('Le nom est requis.', 'warning');
      return;
    }

    setIsUpdating(true);
    try {
      const updatedCat = await apiFetch(API_URLS.editCategory(editId), {
        method: 'PUT',
        body: JSON.stringify({ name: editName.trim() }),
      });
      setCategories((prev) =>
        prev.map((c) => (c.id === editId ? updatedCat : c))
      );
      cancelEdit();
      handleSnackbarOpen('Catégorie mise à jour avec succès !', 'success');
    } catch (e) {
      handleSnackbarOpen(e.message, 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  const openDeleteDialog = (id) => {
    setDeleteId(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await apiFetch(API_URLS.deleteCategory(deleteId), {
        method: 'DELETE',
      });
      setCategories((prev) => prev.filter((c) => c.id !== deleteId));
      handleSnackbarOpen('Catégorie supprimée avec succès !', 'success');
    } catch (e) {
      handleSnackbarOpen(e.message, 'error');
    } finally {
      setDeleteDialogOpen(false);
      setDeleteId(null);
      setIsDeleting(false);
    }
  };

  const handleSnackbarOpen = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  if (loading)
    return (
      <Box sx={{ textAlign: 'center', pt: 4 }}>
        <CircularProgress />
      </Box>
    );

  return (
    <Box sx={{ maxWidth: 600, margin: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Gestion des catégories
      </Typography>

      <Paper sx={{ p: 2, mb: 4 }}>
        <Typography variant="h6">Ajouter une catégorie</Typography>
        <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
          <TextField
            label="Nom"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            disabled={isCreating}
          />
          <Button
            variant="contained"
            onClick={handleCreate}
            disabled={isCreating}
            sx={{ minWidth: '120px' }}
          >
            {isCreating ? <CircularProgress size={24} /> : 'Ajouter'}
          </Button>
        </Box>
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" mb={2}>
          Liste des catégories
        </Typography>
        <List>
          {categories.length === 0 && (
            <Typography sx={{ color: 'text.secondary' }}>
              Aucune catégorie disponible.
            </Typography>
          )}
          {categories.map((cat) => (
            <ListItem
              key={cat.id}
              secondaryAction={
                editId !== cat.id && (
                  <>
                    <IconButton
                      edge="end"
                      onClick={() => startEdit(cat)}
                      aria-label="edit"
                      disabled={isUpdating || isDeleting}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      edge="end"
                      color="error"
                      onClick={() => openDeleteDialog(cat.id)}
                      aria-label="delete"
                      disabled={isUpdating || isDeleting}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </>
                )
              }
            >
              {editId === cat.id ? (
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', width: '100%' }}>
                  <TextField
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    size="small"
                    fullWidth
                    disabled={isUpdating}
                  />
                  <Button
                    variant="contained"
                    color="success"
                    onClick={handleEditSave}
                    size="small"
                    disabled={isUpdating}
                  >
                    <SaveIcon />
                  </Button>
                  <Button
                    variant="outlined"
                    color="inherit"
                    onClick={cancelEdit}
                    size="small"
                    disabled={isUpdating}
                  >
                    <CancelIcon />
                  </Button>
                </Box>
              ) : (
                <ListItemText primary={cat.name} />
              )}
            </ListItem>
          ))}
        </List>
      </Paper>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          Êtes-vous sûr de vouloir supprimer cette catégorie ? Cette action est irréversible.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} disabled={isDeleting}>Annuler</Button>
          <Button color="error" variant="contained" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? <CircularProgress size={24} /> : 'Supprimer'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CategoriesPage;