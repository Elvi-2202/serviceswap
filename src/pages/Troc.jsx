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
  IconButton
} from '@mui/material';
import { CheckCircle, Cancel, RateReview } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const TrocPage = () => {
  // Données de démonstration
  const myTrades = [
    { 
      id: 1, 
      serviceGiven: "Ménage 2h", 
      serviceReceived: "Cours de piano", 
      partner: "Jean D.", 
      date: "15/06/2023",
      status: "completed"
    },
    { 
      id: 2, 
      serviceGiven: "Garde d'enfants", 
      serviceReceived: "Réparation vélo", 
      partner: "Marie L.", 
      date: "22/06/2023",
      status: "pending"
    }
  ];

  return (
    <Box sx={{ p: 2 }}>
      {/* Header */}
      <Typography variant="h4" sx={{ mb: 3 }}>Mes Troc</Typography>

      {/* Liste des trocs */}
      <Paper sx={{ p: 2 }}>
        <List>
          {myTrades.map((trade) => (
            <React.Fragment key={trade.id}>
              <ListItem>
                <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
                  {trade.partner.charAt(0)}
                </Avatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography sx={{ mr: 1 }}>
                        J'ai donné "{trade.serviceGiven}" contre "{trade.serviceReceived}"
                      </Typography>
                      <Chip 
                        label={trade.status === "completed" ? "Terminé" : "En attente"} 
                        color={trade.status === "completed" ? "success" : "warning"}
                        size="small"
                      />
                    </Box>
                  }
                  secondary={`Avec ${trade.partner} - ${trade.date}`}
                />
                {trade.status === "completed" ? (
                  <IconButton edge="end" aria-label="rate">
                    <RateReview />
                  </IconButton>
                ) : (
                  <Box>
                    <IconButton edge="end" aria-label="accept">
                      <CheckCircle color="success" />
                    </IconButton>
                    <IconButton edge="end" aria-label="reject">
                      <Cancel color="error" />
                    </IconButton>
                  </Box>
                )}
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