import { useState } from "react";
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
  Alert,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { AnimatePresence, motion } from "framer-motion"; // eslint-disable-line no-unused-vars
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
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
  const [signupData, setSignupData] = useState({
    pseudo: "",
    email: "",
    password: "",
    localisation: "",
    description: "",
  });
  const [message, setMessage] = useState({ type: "", text: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const navigate = useNavigate();

  const handleTab = (_, newVal) => {
    setTab(newVal);
    setMessage({ type: "", text: "" });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8000/api/login_check", {
        method: "POST",
        mode: "cors",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: loginData.email,
          password: loginData.password,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Échec de l'authentification");

      localStorage.setItem("token", data.token);
      setMessage({ type: "success", text: "Connexion réussie !" });
      navigate("/home");
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message || "Erreur lors de la connexion",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8000/api/signup", {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          pseudo: signupData.pseudo,
          email: signupData.email,
          password: signupData.password,
          localisation: signupData.localisation,
          description: signupData.description,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Échec de l'inscription");

      localStorage.setItem("token", data.token);
      setMessage({ type: "success", text: "Inscription réussie !" });
      navigate("/home");
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message || "Erreur lors de l'inscription",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ bgcolor: BG, minHeight: "100vh", px: 2 }}>
      {/* ✅ Entête */}
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar sx={{ justifyContent: "center", py: { xs: 1, sm: 2 } }}>
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

      {/* ✅ Formulaires */}
      <Container maxWidth="xs" sx={{ mt: { xs: 6, sm: 8 }, mb: 6 }}>
        <Paper
          elevation={2}
          sx={{
            p: { xs: 3, sm: 4 },
            borderRadius: 2,
            bgcolor: FORM_BG,
          }}
        >
          <Tabs
            value={tab}
            onChange={handleTab}
            centered
            sx={{
              mb: 3,
              "& .MuiTabs-indicator": { bgcolor: ACCENT },
              "& .MuiTab-root": {
                color: SECONDARY_BTN,
                fontWeight: 500,
                textTransform: "none",
                fontSize: isSmall ? 14 : 16,
              },
              "& .Mui-selected": { color: ACCENT },
            }}
          >
            <Tab label="Connexion" />
            <Tab label="Inscription" />
          </Tabs>

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
                  type={showLoginPassword ? "text" : "password"}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={loginData.password}
                  onChange={(e) =>
                    setLoginData({ ...loginData, password: e.target.value })
                  }
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() =>
                            setShowLoginPassword(!showLoginPassword)
                          }
                          edge="end"
                        >
                          {showLoginPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Button
                  variant="contained"
                  fullWidth
                  disabled={isLoading}
                  sx={{
                    mt: 2,
                    py: 1.3,
                    bgcolor: PRIMARY_BTN,
                    textTransform: "none",
                    fontSize: isSmall ? 14 : 16,
                  }}
                  onClick={handleLogin}
                >
                  {isLoading ? "Connexion..." : "Se connecter"}
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
                  label="Pseudo"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={signupData.pseudo}
                  onChange={(e) =>
                    setSignupData({ ...signupData, pseudo: e.target.value })
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
                  type={showSignupPassword ? "text" : "password"}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={signupData.password}
                  onChange={(e) =>
                    setSignupData({ ...signupData, password: e.target.value })
                  }
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowSignupPassword(!showSignupPassword)}
                          edge="end"
                        >
                          {showSignupPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  label="Localisation"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={signupData.localisation}
                  onChange={(e) =>
                    setSignupData({ ...signupData, localisation: e.target.value })
                  }
                />
                <TextField
                  label="Description"
                  variant="outlined"
                  fullWidth
                  multiline
                  minRows={3}
                  margin="normal"
                  value={signupData.description}
                  onChange={(e) =>
                    setSignupData({ ...signupData, description: e.target.value })
                  }
                />
                <Button
                  variant="contained"
                  fullWidth
                  disabled={isLoading}
                  sx={{
                    mt: 2,
                    py: 1.3,
                    bgcolor: SECONDARY_BTN,
                    textTransform: "none",
                    fontSize: isSmall ? 14 : 16,
                  }}
                  onClick={handleSignup}
                >
                  {isLoading ? "Inscription..." : "S'inscrire"}
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
