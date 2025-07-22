import React from "react";
import { Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  TextField,
  Card,
  CardContent,
  Avatar,
  Grid,
  Box,
  useMediaQuery,
  IconButton,
  InputAdornment,
  Tooltip,
  Badge,
} from "@mui/material";
import { motion } from "framer-motion"; // eslint-disable-line no-unused-vars
import SearchIcon from "@mui/icons-material/Search";
import LogoutIcon from "@mui/icons-material/Logout";
import NotificationsIcon from "@mui/icons-material/Notifications";
import "@fontsource/poppins";
import "../App.css";

const ACCENT = "#CF6B4D";
const BG = "#F9FAFB";
const HEADER_BG = "#1D1E22";
const TEXT_COLOR = "#F9FAFB";

const Home = () => {
  const isSmall = useMediaQuery("(max-width:600px)");

  const services = [
    { name: "Paul", rating: 4, color: "#5DA271", service1: "2h de ménage", service2: "Réparation sèche cheveux" },
    { name: "Laurie", rating: 5, color: "#F79CA8", service1: "Coupe de cheveux h/f", service2: "2h garde de chat à domicile" },
    { name: "Kevin", rating: 5, color: "#9DAAF2", service1: "Petit frigo en bon état", service2: "2h de aide pour déménagement" },
  ];

  const handleLogout = () => {
    console.log("Déconnexion");
  };

  return (
    <Box sx={{ bgcolor: BG, minHeight: "100vh", fontFamily: "Poppins, sans-serif" }}>
      {/* HEADER */}
      <AppBar position="static" sx={{ bgcolor: HEADER_BG, px: 2 }}>
        <Toolbar sx={{ justifyContent: "space-between", flexWrap: "wrap" }}>
          <Typography
            variant={isSmall ? "h6" : "h5"}
            sx={{ color: ACCENT, fontWeight: 700, textDecoration: "none" }}
            component={Link}
            to="/"
          >
            ServiceSwap
          </Typography>

          {!isSmall && (
            <TextField
              variant="outlined"
              size="small"
              placeholder="Rechercher..."
              sx={{
                width: "40%",
                bgcolor: "white",
                ml: 2,
                borderRadius: 1,
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { border: "none" },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          )}

          <Box sx={{ display: "flex", alignItems: "center", mt: { xs: 1, sm: 0 }, gap: 1 }}>
            <Tooltip title="Notifications">
              <IconButton sx={{ color: TEXT_COLOR }}>
                <Badge badgeContent={3} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            <Tooltip title="Profil">
              <IconButton component={Link} to="/profile" sx={{ p: 0 }}>
                <Avatar
                  src="https://i.imgur.com/your-avatar-image.jpg"
                  sx={{
                    width: isSmall ? 32 : 40,
                    height: isSmall ? 32 : 40,
                    border: `2px solid ${ACCENT}`,
                  }}
                />
              </IconButton>
            </Tooltip>

            <Tooltip title="Déconnexion">
              <IconButton onClick={handleLogout} sx={{ color: TEXT_COLOR }}>
                <LogoutIcon fontSize={isSmall ? "small" : "medium"} />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      {/* CONTENU PRINCIPAL */}
      <Container maxWidth="lg" sx={{ py: { xs: 4, sm: 6 } }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Typography
            variant={isSmall ? "h5" : "h4"}
            sx={{
              mb: 4,
              fontWeight: 600,
              color: HEADER_BG,
              textAlign: "center",
              fontSize: isSmall ? 22 : 32,
            }}
          >
            Échanges Disponibles
          </Typography>

          <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
            {services.map((user, idx) => (
              <Grid item xs={12} sm={6} md={4} key={idx}>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                >
                  <Card elevation={3} sx={{ borderRadius: 2 }}>
                    <CardContent>
                      <Grid container alignItems="center" spacing={2}>
                        <Grid item>
                          <Avatar
                            sx={{
                              bgcolor: user.color,
                              width: isSmall ? 40 : 56,
                              height: isSmall ? 40 : 56,
                            }}
                          >
                            {user.name.charAt(0)}
                          </Avatar>
                        </Grid>
                        <Grid item>
                          <Typography
                            sx={{ fontWeight: 600, fontSize: isSmall ? 16 : 18 }}
                          >
                            {user.name}
                          </Typography>
                          <Typography variant="body2" sx={{ color: "text.secondary" }}>
                            ⭐ {user.rating}/5
                          </Typography>
                        </Grid>
                      </Grid>
                      <Box mt={2}>
                        <Typography variant="body2">{user.service1}</Typography>
                        <Typography variant="body2">{user.service2}</Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Home;
