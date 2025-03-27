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
  Paper
} from '@mui/material';
import {
  ExpandMore,
  ExpandLess,
  Notifications,
  Settings as SettingsIcon,
  VolumeUp
} from '@mui/icons-material';
import "../App.css";

const Settings = () => {
  const [openPrivacy, setOpenPrivacy] = useState(true);
  const [openDeactivation, setOpenDeactivation] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  return (
    <Container maxWidth="sm" className="settings-container">
      {/* Titre principal */}
      <Typography variant="h4" className="main-title">
        <SettingsIcon className="title-icon" />
        Paramètres de l'application
      </Typography>

      {/* Section Son */}
      <Paper className="settings-block">
        <ListItem>
          <VolumeUp className="section-icon" />
          <ListItemText primary="Son de l'application" />
          <Switch 
            checked={soundEnabled}
            onChange={() => setSoundEnabled(!soundEnabled)}
            color="primary"
          />
        </ListItem>
      </Paper>

      {/* Section Notifications */}
      <Paper className="settings-block">
        <ListItem 
          button 
          onClick={() => setNotificationsEnabled(!notificationsEnabled)}
          className="notification-item"
        >
          <Notifications className="section-icon" />
          <ListItemText 
            primary="Notifications (messages, confirmations, rappels)" 
            className="section-title"
          />
          <Switch 
            checked={notificationsEnabled}
            onChange={(e) => {
              e.stopPropagation();
              setNotificationsEnabled(!notificationsEnabled);
            }}
            color="primary"
          />
        </ListItem>
      </Paper>

      {/* Section Confidentialité */}
      <Paper className="settings-block collapsible">
        <ListItem 
          button 
          onClick={() => setOpenPrivacy(!openPrivacy)}
          className="collapsible-header"
        >
          <ListItemText 
            primary="Paramètres de confidentialité" 
            className="section-title"
          />
          {openPrivacy ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        
        <Collapse in={openPrivacy}>
          <List dense className="nested-list">
            {[
              "Stocker et/ou accéder à des informations sur un appareil",
              "Développer et améliorer les services",
              "Mesurer la performance des contenus",
              "Utiliser des données de géolocalisation précises",
              "Activité pour les rapports des annonces"
            ].map((text) => (
              <ListItem key={text} className="nested-item">
                <ListItemText primary={text} />
                <Switch edge="end" color="primary" />
              </ListItem>
            ))}
          </List>
        </Collapse>
      </Paper>

      {/* Section Désactivation */}
      <Paper className="settings-block collapsible">
        <ListItem 
          button 
          onClick={() => setOpenDeactivation(!openDeactivation)}
          className="collapsible-header"
        >
          <ListItemText 
            primary="Désactivation et suppression" 
            className="section-title"
          />
          {openDeactivation ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        
        <Collapse in={openDeactivation}>
          <Box className="nested-container">
            <Typography variant="subtitle2" className="subsection-title">
              Désactiver le compte
            </Typography>
            <List dense className="nested-list">
              {[
                "Masquer vos services et votre profil",
                "Supprimer vos données et votre compte"
              ].map((text) => (
                <ListItem key={text} className="nested-item">
                  <ListItemText primary={text} />
                  <IconButton edge="end" className="expand-icon">
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
        className="logout-button"
      >
        Se déconnecter
      </Button>
    </Container>
  );
};

export default Settings;