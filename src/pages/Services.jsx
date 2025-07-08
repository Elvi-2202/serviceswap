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
  IconButton
} from '@mui/material';
import { Add, Delete, Edit } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const ServicesPage = () => {
  // Données de démonstration
  const myServices = [
    { id: 1, title: "Ménage 2h", description: "Service de ménage complet", category: "Ménage" },
    { id: 2, title: "Garde d'enfants", description: "Garde ponctuelle", category: "Babysitting" },
    { id: 3, title: "Cours de maths", description: "Niveau collège/lycée", category: "Enseignement" }
  ];

  return (
    <Box sx={{ p: 2 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Mes Services</Typography>
        <Button 
          variant="contained" 
          color="primary"
          startIcon={<Add />}
          component={Link}
          to="/add-service"
        >
          Ajouter un service
        </Button>
      </Box>

      {/* Liste des services */}
      <Paper sx={{ p: 2 }}>
        <List>
          {myServices.map((service) => (
            <React.Fragment key={service.id}>
              <ListItem
                secondaryAction={
                  <Box>
                    <IconButton edge="end" aria-label="edit">
                      <Edit />
                    </IconButton>
                    <IconButton edge="end" aria-label="delete">
                      <Delete />
                    </IconButton>
                  </Box>
                }
              >
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  {service.title.charAt(0)}
                </Avatar>
                <ListItemText
                  primary={service.title}
                  secondary={`${service.description} - ${service.category}`}
                />
              </ListItem>
              <Divider component="li" />
            </React.Fragment>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default ServicesPage;