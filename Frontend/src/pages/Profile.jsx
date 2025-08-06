import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Button,
  Paper,
  Avatar,
  useMediaQuery,
} from '@mui/material';
import {
  AccountCircle,
  RateReview,
  Favorite,
  Group,
  Help,
  Description,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  EventNote,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

// Style commun pour les sections
const sectionStyle = {
  borderRadius: 2,
  p: { xs: 1.5, sm: 2 },
  mb: { xs: 2, sm: 3 },
  width: { xs: '100%', sm: '85%', md: '70%' },
  mx: 'auto',
};

const ProfilePage = () => {
  const isMobile = useMediaQuery('(max-width:600px)');
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // URL de ton API utilisateur (adapte si besoin)
  const API_USER_URL = 'http://localhost:8000/api/user/me'; // Exemple si tu as une route user connecté

  // Récupération token JWT localStorage (adapter si autre stockage)
  const token = localStorage.getItem('jwt_token');

  useEffect(() => {
    // Appel à l'API pour récupérer les données utilisateur
    fetch(API_USER_URL, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : '',
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Erreur de récupération utilisateur');
        return res.json();
      })
      .then((data) => {
        setUserData({
          pseudo: data.pseudo || 'Utilisateur',
          description: data.description || '',
          // Adaptation selon ton API: ici on mappe les champs aux noms affichés
          localisation: data.localisation || '',
          email: data.email || '',
          // Ajoute ici autres champs si disponibles, par ex.
          // dateNaissance, genre, langue, etc.
          // Si non fournis par API, tu peux garder les valeurs par défaut
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [API_USER_URL, token]);

  if (loading) {
    return <Typography>Chargement du profil...</Typography>;
  }

  // Si les données ne sont pas encore chargées ou erreur
  if (!userData) {
    return <Typography>Impossible de charger les informations utilisateur.</Typography>;
  }

  return (
    <Box sx={{ backgroundColor: '#F9FAFB', minHeight: '100vh', p: { xs: 1, sm: 2 } }}>
      {/* ✅ Header */}
      <Paper
        elevation={3}
        sx={{
          ...sectionStyle,
          textAlign: 'center',
          py: { xs: 3, sm: 4 },
        }}
      >
        <Avatar
          sx={{
            width: { xs: 60, sm: 80 },
            height: { xs: 60, sm: 80 },
            margin: '0 auto',
            bgcolor: '#CF6B4D',
            fontSize: { xs: '1.7rem', sm: '2rem' },
          }}
        >
          {userData.pseudo.charAt(0).toUpperCase()}
        </Avatar>
        <Typography variant="h5" sx={{ mt: 1, fontWeight: 'bold', color: '#333' }}>
          {userData.pseudo}
        </Typography>
        {/* Tu peux mettre date d'inscription si tu la récupères */}
        <Typography variant="subtitle2" color="text.secondary">
          Membre depuis juin 2023
        </Typography>

        {/* ✅ Boutons : Mes Services / Mes Troc */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mt: 3,
            gap: 2,
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'stretch', sm: 'center' },
          }}
        >
          <Button
            variant="outlined"
            startIcon={<EventNote />}
            component={Link}
            to="/services"
            sx={{ textTransform: 'none' }}
            fullWidth={isMobile}
          >
            Mes Services
          </Button>
          <Button
            variant="outlined"
            startIcon={<EventNote />}
            component={Link}
            to="/troc"
            sx={{ textTransform: 'none' }}
            fullWidth={isMobile}
          >
            Mes Troc
          </Button>
        </Box>
      </Paper>

      {/* ✅ Actualités */}
      <Paper elevation={2} sx={sectionStyle}>
        <Typography variant="h6" gutterBottom>
          Actualités
        </Typography>
        <Typography color="text.secondary">
          Comment est financé le projet trok ?
        </Typography>
      </Paper>

      {/* ✅ Menu principal */}
      <Paper elevation={2} sx={sectionStyle}>
        <Typography variant="h6" gutterBottom>
          Menu
        </Typography>
        <List>
          <ListItem button component={Link} to="/user-profile">
            <ListItemIcon>
              <AccountCircle />
            </ListItemIcon>
            <ListItemText primary="Mon compte" />
          </ListItem>
          <Divider />
          <ListItem button component={Link} to="/avis">
            <ListItemIcon>
              <RateReview />
            </ListItemIcon>
            <ListItemText primary="Mes avis" />
          </ListItem>
          <Divider />
          <ListItem button component={Link} to="/favoris">
            <ListItemIcon>
              <Favorite />
            </ListItemIcon>
            <ListItemText primary="Mes annonces favorites" />
          </ListItem>
          <Divider />
          <ListItem button component={Link} to="/inviter">
            <ListItemIcon>
              <Group />
            </ListItemIcon>
            <ListItemText primary="Invitez des amis" />
          </ListItem>
        </List>
      </Paper>

      {/* ✅ Aide */}
      <Paper elevation={2} sx={sectionStyle}>
        <Typography variant="h6" gutterBottom>
          Aide
        </Typography>
        <List>
          <ListItem button>
            <ListItemIcon>
              <Help />
            </ListItemIcon>
            <ListItemText primary="Assistance" />
          </ListItem>
          <Divider />
          <ListItem button>
            <ListItemIcon>
              <Description />
            </ListItemIcon>
            <ListItemText primary="Conditions générales" />
          </ListItem>
          <Divider />
          <ListItem button component={Link} to="/settings">
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Paramètre de l'application" />
          </ListItem>
        </List>
      </Paper>

      {/* ✅ Notifications */}
      <Paper elevation={2} sx={sectionStyle}>
        <Typography variant="h6" gutterBottom>
          Notifications
        </Typography>
        <List>
          <ListItem button component={Link} to="/notifications">
            <ListItemIcon>
              <NotificationsIcon />
            </ListItemIcon>
            <ListItemText primary="Voir mes notifications" />
          </ListItem>
        </List>
      </Paper>

      {/* ✅ Illustration cactus */}
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <img
          src="https://cdn-icons-png.flaticon.com/512/619/619034.png"
          alt="Cactus"
          style={{
            width: isMobile ? 75 : 100,
            height: isMobile ? 75 : 100,
            opacity: 0.6,
          }}
        />
        <Typography sx={{ mt: 2, color: '#7c6e65', fontSize: { xs: 14, sm: 16 } }}>
          Cette troceuse n'a pas encore d'annonces.
        </Typography>
      </Box>
    </Box>
  );
};

export default ProfilePage;
