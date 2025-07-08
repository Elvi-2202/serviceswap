import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  AppBar,
  Toolbar,
  Typography,
  Tabs,
  Tab,
  Paper,
  TextField,
  Button,
  useMediaQuery,
  Alert, // Import Alert component
} from "@mui/material";
import { AnimatePresence, motion } from "framer-motion"; // eslint-disable-line no-unused-vars
import "../App.css";

const ACCENT = "#CF6B4D";
const BG = "#F9FAFB";
const FORM_BG = "#FFFFFF";
const PRIMARY_BTN = "#1D4ED8";
const SECONDARY_BTN = "#4B5563";

const formVariants = {
  initial: { opacity: 0, x: 30 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -30 },
};

const Login = () => {
  const isSmall = useMediaQuery("(max-width:600px)");
  const [tab, setTab] = useState(0);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState({ type: "", text: "" }); // State for messages

  const navigate = useNavigate();

  const handleTab = (_, newVal) => {
    setTab(newVal);
    setMessage({ type: "", text: "" }); // Clear messages when changing tabs
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" }); // Clear previous messages
    try {
      const response = await fetch("http://localhost:8000/api/login_check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: loginData.email,
          password: loginData.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setMessage({ type: "error", text: errorData.message || "Erreur de connexion" });
        return;
      }

      const data = await response.json();
      console.log("Token reçu :", data);

      localStorage.setItem("token", data.token);
      setMessage({ type: "success", text: "Connexion réussie !" });
      navigate("/home");
    } catch (error) {
      console.error("Erreur serveur :", error);
      setMessage({ type: "error", text: "Erreur réseau ou serveur. Veuillez vérifier la console pour plus de détails." });
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" }); // Clear previous messages
    try {
      const response = await fetch("http://localhost:8000/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signupData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setMessage({ type: "error", text: errorData.message || "Erreur lors de l'inscription" });
        return;
      }

      const data = await response.json();
      localStorage.setItem("token", data.token); // Assuming signup also returns a token
      setMessage({ type: "success", text: "Inscription réussie ! Vous pouvez maintenant vous connecter." });
      navigate("/home");
    } catch (error) {
      console.error("Erreur serveur :", error);
      setMessage({ type: "error", text: "Erreur réseau ou serveur. Veuillez vérifier la console pour plus de détails." });
    }
  };

  return (
    <Box sx={{ bgcolor: BG, minHeight: "100vh" }}>
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar sx={{ justifyContent: "center" }}>
          <Link to="/" style={{ textDecoration: "none" }}>
            <Typography
              variant={isSmall ? "h6" : "h5"}
              sx={{ color: ACCENT, fontWeight: 600 }}
            >
              ServiceSwap
            </Typography>
          </Link>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xs" sx={{ mt: 8 }}>
        <Paper elevation={2} sx={{ p: 4, borderRadius: 2, bgcolor: FORM_BG }}>
          <Tabs
            value={tab}
            onChange={handleTab}
            centered
            sx={{
              mb: 3,
              "& .MuiTabs-indicator": { bgcolor: ACCENT },
              "& .MuiTab-root": { color: SECONDARY_BTN, textTransform: "none" },
              "& .Mui-selected": { color: ACCENT },
            }}
          >
            <Tab label="Connexion" />
            <Tab label="Inscription" />
          </Tabs>

          {/* Display messages using Alert component */}
          {message.text && (
            <Alert severity={message.type} sx={{ mb: 2, borderRadius: 1 }}>
              {message.text}
            </Alert>
          )}

          <AnimatePresence mode="wait">
            {tab === 0 && (
              <motion.div
                key="login"
                variants={formVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <TextField
                  label="Email"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={loginData.email}
                  onChange={(e) =>
                    setLoginData({ ...loginData, email: e.target.value })
                  }
                />
                <TextField
                  label="Mot de passe"
                  type="password"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={loginData.password}
                  onChange={(e) =>
                    setLoginData({ ...loginData, password: e.target.value })
                  }
                />
                <Button
                  variant="contained"
                  fullWidth
                  sx={{
                    mt: 2,
                    py: 1.5,
                    bgcolor: PRIMARY_BTN,
                    textTransform: "none",
                  }}
                  onClick={handleLogin}
                >
                  Se connecter
                </Button>
              </motion.div>
            )}
            {tab === 1 && (
              <motion.div
                key="signup"
                variants={formVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <TextField
                  label="Nom"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={signupData.name}
                  onChange={(e) =>
                    setSignupData({ ...signupData, name: e.target.value })
                  }
                />
                <TextField
                  label="Email"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={signupData.email}
                  onChange={(e) =>
                    setSignupData({ ...signupData, email: e.target.value })
                  }
                />
                <TextField
                  label="Mot de passe"
                  type="password"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={signupData.password}
                  onChange={(e) =>
                    setSignupData({ ...signupData, password: e.target.value })
                  }
                />
                <Button
                  variant="contained"
                  fullWidth
                  sx={{
                    mt: 2,
                    py: 1.5,
                    bgcolor: SECONDARY_BTN,
                    textTransform: "none",
                  }}
                  onClick={handleSignup}
                >
                  S'inscrire
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
