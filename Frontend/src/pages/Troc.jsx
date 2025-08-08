import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";

const TrocsPage = () => {
  const [trocs, setTrocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    setLoading(true);
    setError("");
    fetch("http://localhost:8000/api/troc", {
      headers: { Authorization: token ? `Bearer ${token}` : "" },
    })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Erreur chargement trocs");
        }
        return res.json();
      })
      .then((data) => {
        setTrocs(data);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message || "Erreur réseau");
        setLoading(false);
      });
  }, [token]);

  const deleteTroc = (id) => {
    fetch(`http://localhost:8000/api/troc/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erreur suppression troc");
        setTrocs((prev) => prev.filter((t) => t.id !== id));
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
        Mes Trocs
      </Typography>
      <Paper>
        <List>
          {trocs.map((troc) => (
            <React.Fragment key={troc.id}>
              <ListItem
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => deleteTroc(troc.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemText
                  primary={`J'ai donné ${troc.serviceGiven} contre ${troc.serviceReceived}`}
                  secondary={`Avec ${troc.partnerName} — ${new Date(
                    troc.date
                  ).toLocaleDateString()}`}
                />
              </ListItem>
              <Divider component="li" />
            </React.Fragment>
          ))}
          {trocs.length === 0 && (
            <Typography sx={{ p: 3, textAlign: "center" }}>
              Aucun troc disponible.
            </Typography>
          )}
        </List>
      </Paper>
    </Box>
  );
};

export default TrocsPage;
