import React from 'react';
import { 
  Container,
  Typography,
  Box,
  Avatar,
  Divider,
  Chip,
  Paper
} from '@mui/material';
import StarBorderIcon from '@mui/icons-material/StarBorder';

const UserProfile = () => {
  return (
    <Container maxWidth="sm" className="profile-container">
      {/* En-tête du profil */}
      <Box className="profile-header">
        <Avatar className="profile-avatar">
          EK
        </Avatar>
        
        <Typography variant="h5" className="profile-username">
          Elvira_K
        </Typography>
        
        <Typography variant="body2" className="profile-membership">
          Membre depuis 12/02/2024
        </Typography>
      </Box>

      {/* Statistiques */}
      <Paper className="stats-card">
        <Box className="stats-row">
          <Box className="stat-item">
            <Typography variant="h6">0</Typography>
            <Typography variant="body2">service</Typography>
          </Box>
          <Box className="stat-item">
            <Typography variant="h6">0</Typography>
            <Typography variant="body2">trok</Typography>
          </Box>
        </Box>

        <Typography variant="body2" className="no-reviews">
          Cette troceuse n'a pas encore d'avis
        </Typography>

        <Chip
          label="0 rendez-vous manqué"
          size="small"
          className="missed-appointments"
        />
      </Paper>

      {/* Niveau */}
      <Paper className="level-card">
        <Typography variant="subtitle1" className="level-title">
          <StarBorderIcon className="star-icon" />
          Niveau 1 (Budget Movies)
        </Typography>
        
        <Box className="stats-row">
          <Box className="stat-item">
            <Typography variant="h6">0</Typography>
            <Typography variant="body2">Service</Typography>
          </Box>
          <Box className="stat-item">
            <Typography variant="h6">0</Typography>
            <Typography variant="body2">Trok</Typography>
          </Box>
        </Box>
      </Paper>

      <Divider className="profile-divider" />

      {/* Annonces */}
      <Typography variant="body1" className="no-ads">
        Cette troceuse n'a pas d'annonces pour l'instant.
      </Typography>
    </Container>
  );
};

export default UserProfile;