import React from "react";
import { Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
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

const Welcome = () => {
  const isSmall = useMediaQuery("(max-width:600px)");

  return (
    <Box sx={{ 
      bgcolor: BG, 
      minHeight: "100vh", 
      fontFamily: "Poppins, sans-serif",
      display: "flex",
      flexDirection: "column"
    }}>
      {/* Navbar */}
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
          <Box>
            <Button
              component={Link}
              to="/login"
              variant="contained"
              sx={{ 
                bgcolor: ACCENT, 
                color: TEXT_COLOR, 
                textTransform: "none",
                "&:hover": {
                  bgcolor: "#b85a3f"
                }
              }}
            >
              Inscription
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Contenu principal */}
      <Container 
        maxWidth="md" 
        sx={{ 
          py: 6, 
          textAlign: "center",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Titre HELLO */}
          <Typography
            variant={isSmall ? "h2" : "h1"}
            sx={{ 
              mb: 4, 
              fontWeight: 800, 
              color: HEADER_BG,
              fontSize: isSmall ? "3rem" : "4rem",
              letterSpacing: "0.1em"
            }}
          >
            HELLO
          </Typography>

          {/* Texte de l'image */}
          <Box sx={{ 
            maxWidth: "600px",
            textAlign: "center"
          }}>
            <Typography variant="h5" sx={{ 
              fontWeight: 600, 
              mb: 3,
              color: ACCENT,
              fontSize: isSmall ? "1.5rem" : "1.75rem"
            }}>
              Unlock the power of mutual exchange!
            </Typography>
            
            <Typography variant="body1" sx={{ 
              mb: 2,
              fontSize: isSmall ? "1rem" : "1.1rem",
              lineHeight: 1.6
            }}>
              Unleash the potential of mutual exchange and
            </Typography>
            
            <Typography variant="body1" sx={{ 
              mb: 2,
              fontSize: isSmall ? "1rem" : "1.1rem",
              lineHeight: 1.6
            }}>
              unlock a world where the value of each person's
            </Typography>
            
            <Typography variant="body1" sx={{ 
              mb: 2,
              fontSize: isSmall ? "1rem" : "1.1rem",
              lineHeight: 1.6
            }}>
              skills knows no bounds, paving the way for
            </Typography>
            
            <Typography variant="body1" sx={{ 
              fontSize: isSmall ? "1rem" : "1.1rem",
              lineHeight: 1.6
            }}>
              limitless opportunities
            </Typography>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Welcome;