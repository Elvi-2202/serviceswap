// src/pages/Login.jsx
import React from "react";
import { Button, TextField, Typography } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";

const Login = () => {
  return (
    <div className="auth-page">
      <div className="auth-container">
        <Typography variant="h4" className="auth-title">
          Se connecter
        </Typography>
        <form className="auth-form">
          <TextField
            label="Nom d'utilisateur / Email"
            variant="outlined"
            fullWidth
          />
          <TextField
            label="Mot de passe"
            type="password"
            variant="outlined"
            fullWidth
          />
          <Button variant="contained" className="auth-button">
            Se connecter
          </Button>
        </form>
        <div className="auth-divider">Ou</div>
        <Button variant="contained" className="auth-social-button">
          <FacebookIcon />
          Se connecter avec Facebook
        </Button>
        <a href="/forgot-password" className="auth-link">
          Mot de passe oublié ?
        </a>
      </div>
    </div>
  );
};

export default Login;