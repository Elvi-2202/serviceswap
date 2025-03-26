// src/components/Navbar.jsx
import React from "react";
import { AppBar, Toolbar, Typography, Button, InputBase, IconButton } from "@mui/material";
import { Link } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";

const Navbar = () => {
  return (
    <AppBar position="static" style={{ backgroundColor: "#4CAF50" }}> {/* Couleur de fond verte */}
      <Toolbar>
        {/* Titre à gauche */}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          ServicesWrap
        </Typography>

        {/* Barre de recherche centrée */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "rgba(255, 255, 255, 0.15)",
            borderRadius: "4px",
            padding: "0 8px",
            margin: "0 16px",
            flexGrow: 2, // Prend plus d'espace pour centrer la barre de recherche
            maxWidth: "600px", // Limite la largeur de la barre de recherche
          }}
        >
          <InputBase
            placeholder="Rechercher des articles..."
            style={{ color: "white", padding: "8px", flexGrow: 1 }}
          />
          <IconButton
            type="submit"
            aria-label="search"
            style={{ color: "white" }}
          >
            <SearchIcon />
          </IconButton>
        </div>

        {/* Boutons à droite */}
        <div style={{ flexGrow: 1, display: "flex", justifyContent: "flex-end" }}>
          <Button color="inherit" component={Link} to="/signin">
            S’inscrire
          </Button>
          <Button color="inherit" component={Link} to="/login">
            Se connecter
          </Button>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;