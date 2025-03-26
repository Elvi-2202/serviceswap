// src/pages/SignIn.jsx
import React from "react";
import { Button, TextField, Typography } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import GoogleIcon from "@mui/icons-material/Google";

const SignIn = () => {
  return (
    <div className="auth-page">
      <div className="auth-container">
        <Typography variant="h4" className="auth-title">
          S’inscrire à ServicesWrap
        </Typography>
        <form className="auth-form">
          <TextField
            label="Nom d'utilisateur"
            variant="outlined"
            fullWidth
            helperText="Ceci sera visible des autres membres. Il ne peut être composé que de lettres, chiffres, et les signes + et -."
          />
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            helperText="Doit être une adresse e-mail valide."
          />
          <TextField
            label="Mot de passe"
            type="password"
            variant="outlined"
            fullWidth
          />
          <TextField
            label="Confirmer mot de passe"
            type="password"
            variant="outlined"
            fullWidth
          />
          <Button variant="contained" className="auth-button">
            S’inscrire
          </Button>
        </form>
        <Typography variant="body2" align="center" color="textSecondary">
          En cliquant sur "S’inscrire", vous acceptez nos{" "}
          <a href="/terms" className="auth-link">
            Conditions d’utilisation
          </a>{" "}
          et notre{" "}
          <a href="/privacy" className="auth-link">
            Politique de confidentialité
          </a>
          .
        </Typography>
        <div className="auth-divider">Ou</div>
        <Button variant="contained" className="auth-social-button">
          <FacebookIcon />
          S’inscrire avec Facebook
        </Button>
        <Button variant="contained" className="auth-social-button google">
          <GoogleIcon />
          S’inscrire avec Google
        </Button>
      </div>
    </div>
  );
};

export default SignIn;