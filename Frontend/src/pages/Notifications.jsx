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
  IconButton,
  useMediaQuery
} from '@mui/material';
import {
  ArrowBack,
  Notifications as NotificationsIcon,
  CheckCircle,
  Delete,
  RateReview,
  EventNote
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

const NotificationsPage = () => {
  const isSmall = useMediaQuery('(max-width:600px)');

  const notifications = [
    {
      id: 1,
      title: 'Nouveau message',
      content: 'Vous avez reçu un message de Jean D.',
      time: 'Il y a 10 minutes',
      read: false,
      icon: 'message',
    },
    {
      id: 2,
      title: 'Échange confirmé',
      content: 'Votre échange avec Marie L. a été confirmé',
      time: 'Il y a 2 heures',
      read: true,
      icon: 'exchange',
    },
    {
      id: 3,
      title: 'Avis reçu',
      content: 'Paul a laissé un avis sur votre dernier service',
      time: 'Hier',
      read: true,
      icon: 'review',
    },
    {
      id: 4,
      title: 'Rappel',
      content: 'N\'oubliez pas votre échange demain à 14h',
      time: 'Il y a 1 jour',
      read: false,
      icon: 'reminder',
    },
  ];

  const getIcon = (type) => {
    switch (type) {
      case 'message':
        return <NotificationsIcon color="primary" />;
      case 'exchange':
        return <CheckCircle color="success" />;
      case 'review':
        return <RateReview color="warning" />;
      case 'reminder':
        return <EventNote color="info" />;
      default:
        return <NotificationsIcon />;
    }
  };

  return (
    <Box sx={{ bgcolor: '#F9FAFB', minHeight: '100vh', p: { xs: 1, sm: 3 } }}>
      {/* ✅ Barre d’en-tête */}
      <Paper elevation={1} sx={{ p: 2, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
        <IconButton component={Link} to="/profile" edge="start">
          <ArrowBack />
        </IconButton>
        <Typography variant={isSmall ? 'h6' : 'h5'} fontWeight={600}>
          Mes Notifications
        </Typography>
      </Paper>

      {/* ✅ Liste des notifications */}
      <Paper elevation={2} sx={{ borderRadius: 2 }}>
        <List>
          {notifications.map((notif) => (
            <React.Fragment key={notif.id}>
              <ListItem
                alignItems="flex-start"
                sx={{
                  px: 2,
                  py: 1.5,
                  bgcolor: notif.read ? 'transparent' : '#FFF5F5',
                  flexDirection: isSmall ? 'column' : 'row',
                  gap: isSmall ? 1 : 0,
                }}
                secondaryAction={
                  <IconButton edge="end" aria-label="delete">
                    <Delete />
                  </IconButton>
                }
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: '#E0E0E0' }}>
                    {getIcon(notif.icon)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography
                      variant="subtitle1"
                      fontWeight={500}
                      sx={{ display: 'flex', alignItems: 'center' }}
                    >
                      {notif.title}
                      {!notif.read && (
                        <Badge
                          color="error"
                          variant="dot"
                          sx={{ ml: 1 }}
                        />
                      )}
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 0.5 }}
                      >
                        {notif.content}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {notif.time}
                      </Typography>
                    </>
                  }
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

export default NotificationsPage;
