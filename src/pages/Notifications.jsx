import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Divider,
  Paper,
  Badge,
  IconButton
} from '@mui/material';
import {
  ArrowBack,
  Notifications as NotificationsIcon,
  CheckCircle,
  Delete
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import "../App.css";

const NotificationsPage = () => {
  // Données de démonstration
  const notifications = [
    {
      id: 1,
      title: "Nouveau message",
      content: "Vous avez reçu un message de Jean D.",
      time: "Il y a 10 minutes",
      read: false,
      icon: "message"
    },
    {
      id: 2,
      title: "Échange confirmé",
      content: "Votre échange avec Marie L. a été confirmé",
      time: "Il y a 2 heures",
      read: true,
      icon: "exchange"
    },
    {
      id: 3,
      title: "Avis reçu",
      content: "Paul a laissé un avis sur votre dernier service",
      time: "Hier",
      read: true,
      icon: "review"
    },
    {
      id: 4,
      title: "Rappel",
      content: "N'oubliez pas votre échange demain à 14h",
      time: "Il y a 1 jour",
      read: false,
      icon: "reminder"
    }
  ];

  const getIcon = (iconType) => {
    switch(iconType) {
      case "message":
        return <NotificationsIcon color="primary" />;
      case "exchange":
        return <CheckCircle color="success" />;
      case "review":
        return <RateReview color="warning" />;
      case "reminder":
        return <EventNote color="info" />;
      default:
        return <NotificationsIcon />;
    }
  };

  return (
    <Box className="notifications-container">
      {/* Header */}
      <Paper className="notifications-header" elevation={1}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton component={Link} to="/profile">
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" className="notifications-title">
            Mes Notifications
          </Typography>
        </Box>
      </Paper>

      {/* Liste des notifications */}
      <List className="notifications-list">
        {notifications.map((notification) => (
          <React.Fragment key={notification.id}>
            <ListItem 
              className={`notification-item ${!notification.read ? 'unread' : ''}`}
              secondaryAction={
                <IconButton edge="end" aria-label="delete">
                  <Delete />
                </IconButton>
              }
            >
              <ListItemAvatar>
                <Avatar className="notification-icon">
                  {getIcon(notification.icon)}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography variant="subtitle1" className="notification-title">
                    {notification.title}
                    {!notification.read && (
                      <Badge color="error" variant="dot" sx={{ ml: 1 }} />
                    )}
                  </Typography>
                }
                secondary={
                  <>
                    <Typography variant="body2" className="notification-content">
                      {notification.content}
                    </Typography>
                    <Typography variant="caption" className="notification-time">
                      {notification.time}
                    </Typography>
                  </>
                }
              />
            </ListItem>
            <Divider variant="inset" component="li" />
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
};

export default NotificationsPage;