import React, { useState } from "react";
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
  Drawer,
  Slider,
  Switch,
  Button,
  Checkbox,
  FormControlLabel,
  Collapse,
  List,
  ListItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import SearchIcon from "@mui/icons-material/Search";
import LogoutIcon from "@mui/icons-material/Logout";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import fr from "date-fns/locale/fr";
import "@fontsource/poppins";
import "../App.css";

const ACCENT = "#CF6B4D";
const BG = "#F9FAFB";
const HEADER_BG = "#1D1E22";
const TEXT_COLOR = "#F9FAFB";
const categoriesList = [
  "Plomberie",
  "Menagère",
  "Garde d'enfants",
  "Bricolage",
  "Cours Particuliers",
  "Jardinage",
];

const ServiceFilterDrawer = ({
  open,
  onClose,
  distance,
  setDistance,
  showNotReserved,
  setShowNotReserved,
  showOnlyFavorites,
  setShowOnlyFavorites,
  categoriesSelected,
  setCategoriesSelected,
  selectedDate,
  setSelectedDate,
}) => {
  const [tab, setTab] = useState("services");
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);

  const handleToggleCategory = (category) => {
    setCategoriesSelected((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          background: "#fff",
          borderTopRightRadius: 25,
          borderBottomRightRadius: 25,
          maxWidth: 340,
          width: "85vw",
          p: 0,
        },
      }}
    >
      <Box sx={{ px: 3, py: 3, minHeight: "100vh", fontFamily: "Poppins, sans-serif" }}>
        {/* Tab selector */}
        <Box
          sx={{
            display: "flex",
            background: "#f4f4f4",
            borderRadius: 20,
            overflow: "hidden",
            mb: 3,
            fontSize: 17,
            fontWeight: 500,
          }}
        >
          <Box
            onClick={() => setTab("services")}
            sx={{
              flex: 1,
              px: 1.5,
              py: 1,
              background: tab === "services" ? ACCENT : "transparent",
              color: tab === "services" ? "#fff" : "#A9A9A9",
              textAlign: "center",
              transition: "background 0.15s",
              cursor: "pointer",
              fontWeight: 600,
              borderTopLeftRadius: 15,
              borderBottomLeftRadius: 15,
            }}
          >
            Services
          </Box>
          <Box
            onClick={() => setTab("products")}
            sx={{
              flex: 1,
              px: 1.5,
              py: 1,
              background: tab === "products" ? ACCENT : "transparent",
              color: tab === "products" ? "#fff" : "#A9A9A9",
              textAlign: "center",
              transition: "background 0.15s",
              cursor: "pointer",
              fontWeight: 600,
              borderTopRightRadius: 15,
              borderBottomRightRadius: 15,
            }}
          >
            Products
          </Box>
        </Box>
        {/* Distance slider */}
        <Box sx={{ mt: 1, mb: 0.5, color: "#222", fontWeight: 500, fontSize: 15 }}>
          Paris - <b>{distance}km</b>
        </Box>
        <Slider
          min={1}
          max={100}
          value={distance}
          onChange={(_, val) => setDistance(val)}
          sx={{
            color: ACCENT,
            height: 3,
            mb: 1,
            "& .MuiSlider-thumb": {
              width: 18,
              height: 18,
              background: "#fff",
              border: "3px solid #CF6B4D",
              boxShadow: "0px 2px 12px #CF6B4D22",
            },
            "& .MuiSlider-track": { border: "none" },
            "& .MuiSlider-rail": {
              opacity: 1,
              background: "#eeeeee",
            },
          }}
        />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 12,
            mb: 2,
            color: "#7A7A7A",
          }}
        >
          <span>1km</span>
          <span>100km</span>
        </Box>

        {/* Categories */}
        <Box
          onClick={() => setCategoriesOpen((v) => !v)}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            py: 1,
            borderBottom: categoriesOpen ? "none" : "1px solid #eee",
            cursor: "pointer",
          }}
        >
          <Typography fontSize={15}>Categories</Typography>
          <Typography sx={{ fontSize: 24, lineHeight: "16px", color: "#A9A9A9" }}>
            {categoriesOpen ? "˄" : ">"}
          </Typography>
        </Box>
        <Collapse in={categoriesOpen}>
          <List dense>
            {categoriesList.map((category) => (
              <ListItem key={category} disableGutters sx={{ pl: 0 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={categoriesSelected.includes(category)}
                      onChange={() => handleToggleCategory(category)}
                      sx={{ color: ACCENT, "&.Mui-checked": { color: ACCENT } }}
                    />
                  }
                  label={category}
                />
              </ListItem>
            ))}
          </List>
        </Collapse>

        {/* Date */}
        <Box
          onClick={() => setDateOpen(true)}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            py: 1,
            borderBottom: "1px solid #eee",
            cursor: "pointer",
          }}
        >
          <Typography fontSize={15} sx={{ display: "flex", alignItems: "center" }}>
            <CalendarMonthIcon sx={{ color: "#A9A9A9", mr: 1 }} fontSize="small" />
            Date
          </Typography>
          <Typography sx={{ color: "#888", fontSize: 16 }}>
            {selectedDate ? selectedDate.toLocaleDateString("fr-FR") : "Choisir"} &gt;
          </Typography>
        </Box>
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
          <DatePicker
            open={dateOpen}
            onClose={() => setDateOpen(false)}
            value={selectedDate}
            onChange={setSelectedDate}
            renderInput={() => null}
            PopperProps={{
              style: { zIndex: 1500 },
              disablePortal: true,
            }}
          />
        </LocalizationProvider>

        {/* Switch: Not reserved troks */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            py: 1.4,
            borderBottom: "1px solid #eee",
          }}
        >
          <Typography fontSize={15}>Not reserved troks</Typography>
          <Switch
            checked={showNotReserved}
            onChange={() => setShowNotReserved((v) => !v)}
            sx={{
              "& .MuiSwitch-switchBase.Mui-checked": { color: ACCENT },
              "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { backgroundColor: ACCENT },
            }}
          />
        </Box>
        {/* Radio: Only favorite brokers */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            py: 1.4,
            borderBottom: "1px solid #eee",
            mb: 4,
          }}
        >
          <Typography fontSize={15}>Only favorite trokers</Typography>
          {/* Custom radio imitation */}
          <span
            onClick={() => setShowOnlyFavorites((v) => !v)}
            style={{
              width: 22,
              height: 22,
              display: "inline-block",
              borderRadius: "50%",
              border: `2px solid #bbb`,
              background: showOnlyFavorites ? ACCENT : "#fff",
              boxShadow: showOnlyFavorites ? `0 0 1px 4px #CF6B4D44` : "none",
              cursor: "pointer",
            }}
          />
        </Box>
        {/* Filter Button */}
        <Button
          variant="contained"
          sx={{
            width: "100%",
            mt: 2,
            pt: 1.2,
            pb: 1.2,
            fontWeight: 600,
            background: ACCENT,
            borderRadius: 999,
            fontSize: 16,
            boxShadow: "none",
            letterSpacing: "0.5px",
            textTransform: "none",
            "&:hover": { background: "#B75B3F" },
          }}
          onClick={onClose}
        >
          Filter
        </Button>
      </Box>
    </Drawer>
  );
};

const Home = () => {
  const isSmall = useMediaQuery("(max-width:600px)");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [distance, setDistance] = useState(10);
  const [showNotReserved, setShowNotReserved] = useState(true);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [categoriesSelected, setCategoriesSelected] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

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
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={() => setDrawerOpen(true)}
              sx={{ mr: 1 }}
            >
              <MenuIcon sx={{ color: ACCENT, width: 30, height: 30 }} />
            </IconButton>
            <Typography
              variant={isSmall ? "h6" : "h5"}
              sx={{ color: ACCENT, fontWeight: 700, textDecoration: "none", letterSpacing: 1.2 }}
              component={Link}
              to="/"
            >
              ServiceSwap
            </Typography>
          </Box>

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

      {/* DRAWER FILTRE */}
      <ServiceFilterDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        distance={distance}
        setDistance={setDistance}
        showNotReserved={showNotReserved}
        setShowNotReserved={setShowNotReserved}
        showOnlyFavorites={showOnlyFavorites}
        setShowOnlyFavorites={setShowOnlyFavorites}
        categoriesSelected={categoriesSelected}
        setCategoriesSelected={setCategoriesSelected}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />

      {/* CONTENU PRINCIPAL */}
      <Container maxWidth="lg" sx={{ py: { xs: 4, sm: 6 } }}>
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
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Home;
