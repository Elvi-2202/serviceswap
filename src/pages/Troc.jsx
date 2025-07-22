import React from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Avatar,
  Chip,
  IconButton,
  useMediaQuery,
} from '@mui/material';
import { CheckCircle, Cancel, RateReview } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const TrocPage = () => {
  const isSmall = useMediaQuery('(max-width:600px)');

  const myTrades = [
    {
      id: 1,
      serviceGiven: 'Ménage 2h',
      serviceReceived: 'Cours de piano',
      partner: 'Jean D.',
      date: '15/06/2023',
      status: 'completed',
    },
    {
      id: 2,
      serviceGiven: "Garde d'enfants",
      serviceReceived: 'Réparation vélo',
      partner: 'Marie L.',
      date: '22/06/2023',
      status: 'pending',
    },
  ];

  return (
    <Box sx={{ p: { xs: 2, sm: 4 }, bgcolor: '#F9FAFB', minHeight: '100vh' }}>
      {/* 🧭 En-tête */}
      <Typography
        variant={isSmall ? 'h5' : 'h4'}
        sx={{ mb: 3, fontWeight: 600, textAlign: 'center', color: '#333' }}
      >
        Mes Troc
      </Typography>

      {/* 🗃️ Liste des trocs */}
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 } }}>
        <List>
          {myTrades.map((trade) => (
            <React.Fragment key={trade.id}>
              <ListItem
                alignItems="flex-start"
                sx={{
                  display: 'flex',
                  flexDirection: isSmall ? 'column' : 'row',
                  alignItems: isSmall ? 'flex-start' : 'center',
                  gap: isSmall ? 1 : 2,
                }}
              >
                {/* 👥 Avatar */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: isSmall ? 1 : 0 }}>
                  <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
                    {trade.partner.charAt(0)}
                  </Avatar>
                </Box>

                {/* 📜 Texte */}
                <ListItemText
                  primary={
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: isSmall ? 'column' : 'row',
                        alignItems: isSmall ? 'flex-start' : 'center',
                        gap: 1,
                      }}
                    >
                      <Typography>
                        J&apos;ai donné "{trade.serviceGiven}" contre "{trade.serviceReceived}"
                      </Typography>
                      <Chip
                        label={trade.status === 'completed' ? 'Terminé' : 'En attente'}
                        color={trade.status === 'completed' ? 'success' : 'warning'}
                        size="small"
                      />
                    </Box>
                  }
                  secondary={`Avec ${trade.partner} — ${trade.date}`}
                  secondaryTypographyProps={{
                    mt: 0.5,
                    color: 'text.secondary',
                    fontSize: isSmall ? 13 : 14,
                  }}
                  sx={{ flex: 1 }}
                />

                {/* ✅ / ❌ / ✍️ Actions */}
                <Box
                  sx={{
                    display: 'flex',
                    gap: 1,
                    mt: isSmall ? 1.5 : 0,
                    alignSelf: isSmall ? 'flex-end' : 'center',
                  }}
                >
                  {trade.status === 'completed' ? (
                    <IconButton edge="end" aria-label="rate">
                      <RateReview />
                    </IconButton>
                  ) : (
                    <>
                      <IconButton edge="end" aria-label="accept">
                        <CheckCircle color="success" />
                      </IconButton>
                      <IconButton edge="end" aria-label="reject">
                        <Cancel color="error" />
                      </IconButton>
                    </>
                  )}
                </Box>
              </ListItem>
              <Divider component="li" />
            </React.Fragment>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default TrocPage;
