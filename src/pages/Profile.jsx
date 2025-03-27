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
  Paper
} from '@mui/material';
import {
  AccountCircle,
  RateReview,
  Favorite,
  Group,
  Help,
  Description,
  Settings as SettingsIcon,
  Notifications,
  EventNote
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

const ProfilePage = () => {
  return (
    <Box className="profile-container">
      {/* Header Section */}
      <Paper className="profile-header">
        <Typography variant="h4" className="profile-name">Elvira_K</Typography>
        <Box className="profile-stats">
          <Button startIcon={<EventNote />} className="stat-btn">Service</Button>
          <Button startIcon={<EventNote />} className="stat-btn">Troc</Button>
        </Box>
      </Paper>

      {/* News Section */}
      <Paper className="section-card">
        <Typography variant="h6" className="section-title">Actualités</Typography>
        <Typography className="news-text">
          Comment est financé le projet trok ?
        </Typography>
      </Paper>

      {/* Menu Section */}
      <Paper className="section-card">
        <Typography variant="h6" className="section-title">Menu</Typography>
        <List>
          <ListItem button component={Link} to="/compte" className="menu-item">
            <ListItemIcon><AccountCircle className="menu-icon" /></ListItemIcon>
            <ListItemText primary="Compte" />
          </ListItem>
          <ListItem button component={Link} to="/edit-profile" className="menu-item">
            <ListItemIcon><AccountCircle className="menu-icon" /></ListItemIcon>
            <ListItemText primary="Mon compte" />
          </ListItem>
          <ListItem button component={Link} to="/avis" className="menu-item">
            <ListItemIcon><RateReview className="menu-icon" /></ListItemIcon>
            <ListItemText primary="Mes avis" />
          </ListItem>
          <ListItem button component={Link} to="/favoris" className="menu-item">
            <ListItemIcon><Favorite className="menu-icon" /></ListItemIcon>
            <ListItemText primary="Mes annonces favorites" />
          </ListItem>
          <ListItem button component={Link} to="/inviter" className="menu-item">
            <ListItemIcon><Group className="menu-icon" /></ListItemIcon>
            <ListItemText primary="Invitez des amis" />
          </ListItem>
        </List>
      </Paper>

      {/* Help Section */}
      <Paper className="section-card">
        <Typography variant="h6" className="section-title">Aide</Typography>
        <List>
          <ListItem button className="menu-item">
            <ListItemIcon><Help className="menu-icon" /></ListItemIcon>
            <ListItemText primary="Assistance" />
          </ListItem>
          <ListItem button className="menu-item">
            <ListItemIcon><Description className="menu-icon" /></ListItemIcon>
            <ListItemText primary="Conditions générales" />
          </ListItem>
          <ListItem button className="menu-item">
            <ListItemIcon><SettingsIcon className="menu-icon" /></ListItemIcon>
            <ListItemText primary="Paramètre de l'application" />
          </ListItem>
        </List>
      </Paper>

      {/* Notifications Section */}
      <Paper className="section-card">
        <Typography variant="h6" className="section-title">Journal et Notifications</Typography>
        <List>
          <ListItem button component={Link} to="/settings" className="menu-item">
            <ListItemIcon><Notifications className="menu-icon" /></ListItemIcon>
            <ListItemText primary="Paramètres de notifications" />
          </ListItem>
        </List>
      </Paper>
    </Box>
  );
};

export default ProfilePage;