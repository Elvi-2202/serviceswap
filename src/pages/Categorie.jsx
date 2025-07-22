import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const URL_GET_CATEGORIES = 'http://localhost:8000/api/categorie';
const URL_CREATE_CATEGORY = 'http://localhost:8000/api/categorie/new';
const URL_EDIT_CATEGORY_BASE = 'http://localhost:8000/api/categorie'; // + /{id}/edit
const URL_DELETE_CATEGORY_BASE = 'http://localhost:8000/api/categorie'; // + /{id}

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState('');
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState('');

  const [deleteId, setDeleteId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    fetch(URL_GET_CATEGORIES)
      .then(res => res.json())
      .then(data => {
        setCategories(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleCreate = () => {
    if (!name.trim()) return alert('Le nom est requis');

    fetch(URL_CREATE_CATEGORY, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name.trim() }),
    })
      .then(res => {
        if (!res.ok) throw new Error('Erreur création');
        return res.json();
      })
      .then(newCat => {
        setCategories(prev => [...prev, newCat]);
        setName('');
      })
      .catch(err => alert(err.message));
  };

  const startEdit = (cat) => {
    setEditId(cat.id);
    setEditName(cat.name);
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditName('');
  };

  const handleEditSave = () => {
    if (!editName.trim()) return alert('Le nom est requis');

    fetch(`${URL_EDIT_CATEGORY_BASE}/${editId}/edit`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: editName.trim() }),
    })
      .then(res => {
        if (!res.ok) throw new Error('Erreur mise à jour');
        return res.json();
      })
      .then(updatedCat => {
        setCategories(prev =>
          prev.map(c => (c.id === editId ? updatedCat : c))
        );
        cancelEdit();
      })
      .catch(err => alert(err.message));
  };

  const openDeleteDialog = (id) => {
    setDeleteId(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    fetch(`${URL_DELETE_CATEGORY_BASE}/${deleteId}`, { method: 'DELETE' })
      .then(res => {
        if (!res.ok) throw new Error('Erreur suppression');
        return res.json();
      })
      .then(() => {
        setCategories(prev => prev.filter(c => c.id !== deleteId));
        setDeleteDialogOpen(false);
        setDeleteId(null);
      })
      .catch(err => alert(err.message));
  };

  if (loading) return <Typography>Chargement...</Typography>;

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
            onChange={e => setName(e.target.value)}
            fullWidth
          />
          <Button variant="contained" onClick={handleCreate}>
            Ajouter
          </Button>
        </Box>
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" mb={2}>
          Liste des catégories
        </Typography>
        <List>
          {categories.map(cat => (
            <ListItem key={cat.id}
              secondaryAction={
                <>
                  <IconButton edge="end" onClick={() => startEdit(cat)} aria-label="edit">
                    <EditIcon />
                  </IconButton>
                  <IconButton edge="end" color="error" onClick={() => openDeleteDialog(cat.id)} aria-label="delete">
                    <DeleteIcon />
                  </IconButton>
                </>
              }
            >
              {editId === cat.id ? (
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', width: '100%' }}>
                  <TextField
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    size="small"
                    fullWidth
                  />
                  <Button variant="contained" color="success" onClick={handleEditSave}>
                    Sauvegarder
                  </Button>
                  <Button variant="outlined" color="inherit" onClick={cancelEdit}>
                    Annuler
                  </Button>
                </Box>
              ) : (
                <ListItemText primary={cat.name} />
              )}
            </ListItem>
          ))}
          {categories.length === 0 && <Typography>Aucune catégorie disponible.</Typography>}
        </List>
      </Paper>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          Êtes-vous sûr de vouloir supprimer cette catégorie ? Cette action est irréversible.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Annuler</Button>
          <Button color="error" variant="contained" onClick={handleDelete}>
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CategoriesPage;
