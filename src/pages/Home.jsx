import React from "react";
import { Container, Typography, TextField, Card, CardContent, Avatar, Grid, Box, useMediaQuery } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import "../App.css";

const services = [
  { name: "Paul", rating: 4, color: "#5DA271", service1: "2h de ménage", service2: "Réparation sèche cheveux" },
  { name: "Laurie", rating: 5, color: "#F79CA8", service1: "Coupe de cheveux h/f", service2: "2h garde de chat à domicile" },
  { name: "Kevin", rating: 5, color: "#9DAAF2", service1: "Petit frigo en bon état", service2: "2h de aide pour déménagement" }
];

const Home = () => {
  const isSmallScreen = useMediaQuery("(max-width:600px)");

  return (
    <Container className="home-container">
      <Typography variant="h5" className="home-title">Accueil</Typography>
      <TextField
        variant="outlined"
        placeholder="Recherche"
        fullWidth
        className="search-bar"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <IconButton>
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <Typography variant="h6" className="section-title">Echanges disponibles</Typography>
      {services.map((user, index) => (
        <Card key={index} className="service-card">
          <CardContent>
            <Grid container alignItems="center" spacing={isSmallScreen ? 1 : 2}>
              <Grid item>
                <Avatar sx={{ bgcolor: user.color, width: isSmallScreen ? 30 : 40, height: isSmallScreen ? 30 : 40 }}>{user.name.charAt(0)}</Avatar>
              </Grid>
              <Grid item>
                <Typography className="user-name" style={{ color: user.color, fontSize: isSmallScreen ? "14px" : "16px" }}>{user.name}</Typography>
                <Typography variant="body2" style={{ fontSize: isSmallScreen ? "12px" : "14px" }}>⭐ {user.rating}/5</Typography>
              </Grid>
            </Grid>
            <Box mt={1}>
              <Typography variant="body2" style={{ fontSize: isSmallScreen ? "12px" : "14px" }}>{user.service1}</Typography>
              <Typography variant="body2" style={{ fontSize: isSmallScreen ? "12px" : "14px" }}>{user.service2}</Typography>
            </Box>
          </CardContent>
        </Card>
      ))}
      <Typography className="see-more">Voir Plus ....</Typography>
    </Container>
  );
};

export default Home;