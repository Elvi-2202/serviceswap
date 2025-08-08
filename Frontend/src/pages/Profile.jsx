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
  CircularProgress,
  Alert,
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
  
  // États pour gérer les données de l'utilisateur
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Simuler une récupération de données depuis une API
  const fetchUserProfile = async () => {
    // Récupérer le token de l'utilisateur
    const token = localStorage.getItem('token');

    // Simuler un appel API
    // En réalité, vous feriez : fetch('http://votre-api.com/api/user/profile', { headers: { Authorization: `Bearer ${token}` } })
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simule un délai de 1 seconde
    
    // Simuler des données utilisateur
    const mockUserData = {
      name: 'Elvira_K',
      memberSince: 'juin 2023',
    };
    
    // Simuler un cas d'erreur
    if (!token) {
      setError('Utilisateur non authentifié. Veuillez vous connecter.');
      setLoading(false);
      return;
    }

    try {
      // Remplacez cette partie par votre appel API réel
      // const response = await fetch('http://votre-api.com/api/user/profile', {
      //   headers: { Authorization: `Bearer ${token}` }
      // });
      // const userData = await response.json();
      
      setUser(mockUserData); // Utilisez userData à la place de mockUserData
      setLoading(false);

    } catch (e) { // La variable 'e' est maintenant utilisée
      setError(e.message || 'Erreur lors du chargement des informations de l\'utilisateur.');
      setLoading(false);
    }
  };

  // useEffect pour charger les données une fois au montage du composant
  useEffect(() => {
    fetchUserProfile();
  }, []); // Le tableau de dépendances est vide pour exécuter l'effet une seule fois

  // Affichage de l'état de chargement
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Affichage de l'état d'erreur
  if (error) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Alert severity="error">{error}</Alert>
        <Button 
          variant="contained" 
          component={Link} 
          to="/login" 
          sx={{ mt: 2, bgcolor: '#CF6B4D', '&:hover': { bgcolor: '#B75B3F' } }}
        >
          Se connecter
        </Button>
      </Box>
    );
  }

  // Si user est null (dans le cas où on ne gère pas l'erreur mais que les données sont manquantes)
  if (!user) {
    return <Alert severity="warning">Aucune donnée utilisateur à afficher.</Alert>;
  }

  // Affichage du profil une fois les données chargées
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
          {user.name.charAt(0)}
        </Avatar>
        <Typography variant="h5" sx={{ mt: 1, fontWeight: 'bold', color: '#333' }}>
          {user.name}
        </Typography>
        <Typography variant="subtitle2" color="text.secondary">
          Membre depuis {user.memberSince}
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