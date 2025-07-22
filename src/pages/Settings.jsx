import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
  Switch,
  Button,
  Collapse,
  IconButton,
  Paper,
  useMediaQuery,
} from '@mui/material';
import {
  ExpandMore,
  ExpandLess,
  Notifications,
  Settings as SettingsIcon,
  VolumeUp,
} from '@mui/icons-material';

const Settings = () => {
  const [openPrivacy, setOpenPrivacy] = useState(true);
  const [openDeactivation, setOpenDeactivation] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const isSmall = useMediaQuery('(max-width:600px)');

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      {/* Titre principal */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 1 }}>
        <SettingsIcon fontSize="large" color="primary" />
        <Typography variant={isSmall ? 'h5' : 'h4'} fontWeight={600}>
          Paramètres de l'application
        </Typography>
      </Box>

      {/* Section Son */}
      <Paper
        elevation={3}
        sx={{ mb: 3, borderRadius: 2, p: { xs: 1, sm: 2 } }}
      >
        <ListItem sx={{ px: 0 }}>
          <VolumeUp sx={{ color: 'primary.main', mr: 2 }} />
          <ListItemText primary="Son de l'application" />
          <Switch
            checked={soundEnabled}
            onChange={() => setSoundEnabled(!soundEnabled)}
            color="primary"
          />
        </ListItem>
      </Paper>

      {/* Section Notifications */}
      <Paper
        elevation={3}
        sx={{ mb: 3, borderRadius: 2, p: { xs: 1, sm: 2 } }}
      >
        <ListItem
          button
          onClick={() => setNotificationsEnabled(!notificationsEnabled)}
        >
          <Notifications sx={{ color: 'primary.main', mr: 2 }} />
          <ListItemText
            primary="Notifications (messages, confirmations, rappels)"
          />
          <Switch
            checked={notificationsEnabled}
            onClick={(e) => e.stopPropagation()}
            onChange={() => setNotificationsEnabled(!notificationsEnabled)}
            color="primary"
          />
        </ListItem>
      </Paper>

      {/* Section Confidentialité */}
      <Paper elevation={3} sx={{ mb: 3, borderRadius: 2 }}>
        <ListItem button onClick={() => setOpenPrivacy(!openPrivacy)}>
          <ListItemText primary="Paramètres de confidentialité" />
          {openPrivacy ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={openPrivacy}>
          <List dense>
            {[
              "Stocker et/ou accéder à des informations sur un appareil",
              "Développer et améliorer les services",
              "Mesurer la performance des contenus",
              "Utiliser des données de géolocalisation précises",
              "Activité pour les rapports des annonces"
            ].map((text) => (
              <ListItem key={text} sx={{ pl: 3 }}>
                <ListItemText primary={text} />
                <Switch edge="end" color="primary" />
              </ListItem>
            ))}
          </List>
        </Collapse>
      </Paper>

      {/* Section Désactivation */}
      <Paper elevation={3} sx={{ mb: 4, borderRadius: 2 }}>
        <ListItem button onClick={() => setOpenDeactivation(!openDeactivation)}>
          <ListItemText primary="Désactivation et suppression" />
          {openDeactivation ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={openDeactivation}>
          <Box sx={{ px: 3, py: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Désactiver le compte
            </Typography>
            <List dense>
              {[
                "Masquer vos services et votre profil",
                "Supprimer vos données et votre compte"
              ].map((text) => (
                <ListItem key={text}>
                  <ListItemText primary={text} />
                  <IconButton edge="end">
                    <ExpandMore />
                  </IconButton>
                </ListItem>
              ))}
            </List>
          </Box>
        </Collapse>
      </Paper>

      {/* Bouton Déconnexion */}
      <Button
        fullWidth
        variant="contained"
        sx={{
          bgcolor: "#CF6B4D",
          '&:hover': {
            bgcolor: "#b75a3d"
          },
          fontWeight: 600,
          textTransform: "none",
        }}
      >
        Se déconnecter
      </Button>
    </Container>
  );
};

export default Settings;
