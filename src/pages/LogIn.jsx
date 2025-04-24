import React, { useState } from "react";
import { Link } from "react-router-dom";
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
} from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
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

  const handleTab = (_, newVal) => setTab(newVal);

  return (
    <Box sx={{ bgcolor: BG, minHeight: "100vh" }}>
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar sx={{ justifyContent: "center" }}>
          <Link to="/" style={{ textDecoration: "none" }}>
            <Typography
              variant={isSmall ? "h6" : "h5"}
              sx={{ color: ACCENT, fontWeight: 600 }}
            >
              TROC
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

          <AnimatePresence exitBeforeEnter>
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
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                />
                <TextField
                  label="Mot de passe"
                  type="password"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                />
                <Button
                  variant="contained"
                  fullWidth
                  sx={{ mt: 2, py: 1.5, bgcolor: PRIMARY_BTN, textTransform: "none" }}
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
                  onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                />
                <TextField
                  label="Email"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={signupData.email}
                  onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                />
                <TextField
                  label="Mot de passe"
                  type="password"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={signupData.password}
                  onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                />
                <Button
                  variant="contained"
                  fullWidth
                  sx={{ mt: 2, py: 1.5, bgcolor: SECONDARY_BTN, textTransform: "none" }}
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