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
  Avatar
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
  EventNote
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import "../App.css";

const ProfilePage = () => {
  return (
    <Box className="profile-container">
      {/* Header Section */}
      <Paper className="profile-header" elevation={3}>
        <Avatar 
          className="profile-avatar"
          sx={{ 
            bgcolor: 'secondary.main',
            fontSize: '2.5rem'
          }}
        >
          E
        </Avatar>
        <Typography variant="h4" className="profile-name">Elvira_K</Typography>
        <Typography variant="subtitle1">Membre depuis juin 2023</Typography>
        
        <Box className="profile-stats">
          <Button 
            className="stat-button"
            variant="outlined" 
            startIcon={<EventNote />}
            component={Link}
            to="/services"
          >
            Mes Services
          </Button>
          <Button 
            className="stat-button"
            variant="outlined" 
            startIcon={<EventNote />}
            component={Link}
            to="/troc"
          >
            Mes Troc
          </Button>
        </Box>
      </Paper>

      {/* News Section */}
      <Paper className="section-card" elevation={2}>
        <Typography variant="h6" className="section-title">Actualités</Typography>
        <Typography className="news-text">
          Comment est financé le projet trok ?
        </Typography>
      </Paper>

      {/* Menu Section */}
      <Paper className="section-card" elevation={2}>
        <Typography variant="h6" className="section-title">Menu</Typography>
        <List>
          <ListItem button component={Link} to="/edit-profile" className="menu-item">
            <ListItemIcon className="menu-icon"><AccountCircle /></ListItemIcon>
            <ListItemText primary="Mon compte" />
          </ListItem>
          <Divider />
          <ListItem button component={Link} to="/avis" className="menu-item">
            <ListItemIcon className="menu-icon"><RateReview /></ListItemIcon>
            <ListItemText primary="Mes avis" />
          </ListItem>
          <Divider />
          <ListItem button component={Link} to="/favoris" className="menu-item">
            <ListItemIcon className="menu-icon"><Favorite /></ListItemIcon>
            <ListItemText primary="Mes annonces favorites" />
          </ListItem>
          <Divider />
          <ListItem button component={Link} to="/inviter" className="menu-item">
            <ListItemIcon className="menu-icon"><Group /></ListItemIcon>
            <ListItemText primary="Invitez des amis" />
          </ListItem>
        </List>
      </Paper>

      {/* Help Section */}
      <Paper className="section-card" elevation={2}>
        <Typography variant="h6" className="section-title">Aide</Typography>
        <List>
          <ListItem button className="menu-item">
            <ListItemIcon className="menu-icon"><Help /></ListItemIcon>
            <ListItemText primary="Assistance" />
          </ListItem>
          <Divider />
          <ListItem button className="menu-item">
            <ListItemIcon className="menu-icon"><Description /></ListItemIcon>
            <ListItemText primary="Conditions générales" />
          </ListItem>
          <Divider />
          <ListItem button component={Link} to="/settings" className="menu-item">
            <ListItemIcon className="menu-icon"><SettingsIcon /></ListItemIcon>
            <ListItemText primary="Paramètre de l'application" />
          </ListItem>
        </List>
      </Paper>

      {/* Notifications Section */}
      <Paper className="section-card" elevation={2}>
        <Typography variant="h6" className="section-title">Notifications</Typography>
        <List>
          <ListItem button component={Link} to="/notifications" className="menu-item">
            <ListItemIcon className="menu-icon"><NotificationsIcon /></ListItemIcon>
            <ListItemText primary="Voir mes notifications" />
          </ListItem>
        </List>
      </Paper>
    </Box>
  );
};

export default ProfilePage;