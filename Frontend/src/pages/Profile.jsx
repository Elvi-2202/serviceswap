import React from 'react';
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
          E
        </Avatar>
        <Typography variant="h5" sx={{ mt: 1, fontWeight: 'bold', color: '#333' }}>
          Elvira_K
        </Typography>
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
          <ListItem button component={Link} to="/edit-profile">
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
