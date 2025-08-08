import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  IconButton,
  Divider,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Notifications as NotificationsIcon,
} from "@mui/icons-material";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    setLoading(true);
    setError("");
    fetch("http://localhost:8000/api/notifications", {
      headers: { Authorization: token ? `Bearer ${token}` : "" },
    })
      .then(async (res) => {
        if (!res.ok) {
          const msg = await res.text();
          throw new Error(msg || "Erreur chargement notifications");
        }
        return res.json();
      })
      .then((data) => {
        setNotifications(data);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message || "Erreur réseau");
        setLoading(false);
      });
  }, [token]);

  const deleteNotification = (id) => {
    fetch(`http://localhost:8000/api/notifications/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erreur suppression notification");
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      })
      .catch((e) => alert(e.message));
  };

  const markAsRead = (id) => {
    fetch(`http://localhost:8000/api/notifications/${id}/read`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ isRead: true }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erreur mise à jour notification");
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
        );
      })
      .catch((e) => alert(e.message));
  };

  if (loading) return <CircularProgress />;

  if (error)
    return (
      <Alert severity="error" sx={{ m: 3 }}>
        {error}
      </Alert>
    );

  return (
    <Box sx={{ p: 2, bgcolor: "#F9FAFB", minHeight: "100vh" }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Mes Notifications
      </Typography>
      <Paper>
        <List>
          {notifications.map((notif) => (
            <React.Fragment key={notif.id}>
              <ListItem
                sx={{
                  bgcolor: notif.isRead ? "transparent" : "#e3f2fd",
                  cursor: "pointer",
                }}
                onClick={() => {
                  if (!notif.isRead) markAsRead(notif.id);
                }}
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => deleteNotification(notif.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemAvatar>
                  <Avatar>
                    <NotificationsIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={notif.title} secondary={notif.content} />
              </ListItem>
              <Divider component="li" />
            </React.Fragment>
          ))}
          {notifications.length === 0 && (
            <Typography sx={{ p: 3, textAlign: "center" }}>
              Aucune notification disponible.
            </Typography>
          )}
        </List>
      </Paper>
    </Box>
  );
};

export default NotificationsPage;
