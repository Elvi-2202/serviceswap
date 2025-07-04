import React from "react";
import { Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  TextField,
  Card,
  CardContent,
  Avatar,
  Grid,
  Box,
  useMediaQuery,
} from "@mui/material";
import { motion } from "framer-motion"; // eslint-disable-line no-unused-vars
import "@fontsource/poppins";
import "../App.css";

const ACCENT = "#CF6B4D";
const BG = "#F9FAFB";
const HEADER_BG = "#1D1E22";
const TEXT_COLOR = "#F9FAFB";

const services = [
  { name: "Paul", rating: 4, color: "#5DA271", service1: "2h de ménage", service2: "Réparation sèche cheveux" },
  { name: "Laurie", rating: 5, color: "#F79CA8", service1: "Coupe de cheveux h/f", service2: "2h garde de chat à domicile" },
  { name: "Kevin", rating: 5, color: "#9DAAF2", service1: "Petit frigo en bon état", service2: "2h de aide pour déménagement" },
];

const Home = () => {
  const isSmall = useMediaQuery("(max-width:600px)");

  return (
    <Box sx={{ bgcolor: BG, minHeight: "100vh", fontFamily: "Poppins, sans-serif" }}>
      <AppBar position="static" sx={{ bgcolor: HEADER_BG, px: 2 }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography
            variant={isSmall ? "h6" : "h5"}
            sx={{ color: ACCENT, fontWeight: 700, textDecoration: "none" }}
            component={Link}
            to="/"
          >
            ServiceSwap
          </Typography>
          
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ py: 6 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Typography
            variant={isSmall ? "h4" : "h1"}
            sx={{ mb: 4, fontWeight: 600, color: HEADER_BG }}
          >
            <span style={{ 
              color: "gray", 
              fontSize: isSmall ? 30 : 40,  
              textAlign: "center", 
              display: "flex", 
              justifyContent: "center" 
            }}>
              Échanges Disponibles
            </span>
          </Typography>

          <Grid container spacing={isSmall ? 2 : 4}>
            {services.map((user, idx) => (
              <Grid item xs={12} sm={6} md={4} key={idx}>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Card elevation={3} sx={{ borderRadius: 2 }}>
                    <CardContent>
                      <Grid container alignItems="center" spacing={2}>
                        <Grid item>
                          <Avatar
                            sx={{ 
                              bgcolor: user.color, 
                              width: isSmall ? 40 : 56, 
                              height: isSmall ? 40 : 56 
                            }}
                          >
                            {user.name.charAt(0)}
                          </Avatar>
                        </Grid>
                        <Grid item>
                          <Typography sx={{ fontWeight: 600, fontSize: isSmall ? 16 : 18 }}>
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