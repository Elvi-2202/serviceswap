import React from 'react';
import {
  Container,
  Typography,
  Box,
  Avatar,
  Divider,
  Chip,
  Paper,
  useMediaQuery
} from '@mui/material';
import StarBorderIcon from '@mui/icons-material/StarBorder';

const UserProfile = () => {
  const isSmall = useMediaQuery('(max-width:600px)');

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      {/* ✅ En-tête profil */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mb: 4,
          textAlign: 'center',
        }}
      >
        <Avatar
          sx={{
            bgcolor: 'primary.main',
            width: 80,
            height: 80,
            fontSize: 28,
            fontWeight: 'bold',
            mb: 2,
          }}
        >
          EK
        </Avatar>
        <Typography variant="h5" fontWeight={600}>
          Elvira_K
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Membre depuis 12/02/2024
        </Typography>
      </Box>

      {/* ✅ Statistiques */}
      <Paper
        elevation={3}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 2,
          textAlign: 'center'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-evenly',
            mb: 2,
            flexDirection: isSmall ? 'column' : 'row',
            alignItems: 'center',
            gap: isSmall ? 2 : 0,
          }}
        >
          <Box>
            <Typography variant="h6">0</Typography>
            <Typography variant="body2">Service</Typography>
          </Box>
          <Box>
            <Typography variant="h6">0</Typography>
            <Typography variant="body2">Trok</Typography>
          </Box>
        </Box>

        <Typography variant="body2" sx={{ mb: 1 }}>
          Cette troceuse n&apos;a pas encore d&apos;avis
        </Typography>

        <Chip
          label="0 rendez-vous manqué"
          size="small"
          color="warning"
          variant="outlined"
        />
      </Paper>

      {/* ✅ Niveau */}
      <Paper
        elevation={3}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 2,
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{
            display: 'flex',
            alignItems: 'center',
            fontWeight: 600,
            mb: 2,
          }}
        >
          <StarBorderIcon sx={{ mr: 1, color: 'gold' }} />
          Niveau 1 (Budget Movies)
        </Typography>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-evenly',
            mt: 1,
            flexDirection: isSmall ? 'column' : 'row',
            alignItems: 'center',
            gap: isSmall ? 2 : 0,
          }}
        >
          <Box>
            <Typography variant="h6">0</Typography>
            <Typography variant="body2">Service</Typography>
          </Box>
          <Box>
            <Typography variant="h6">0</Typography>
            <Typography variant="body2">Trok</Typography>
          </Box>
        </Box>
      </Paper>

      <Divider sx={{ my: 4 }} />

      {/* ✅ Annonces */}
      <Typography
        variant="body1"
        align="center"
        color="text.secondary"
        sx={{ fontStyle: 'italic' }}
      >
        Cette troceuse n&apos;a pas d&apos;annonces pour l&apos;instant.
      </Typography>
    </Container>
  );
};

export default UserProfile;
