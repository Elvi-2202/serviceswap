import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  MenuItem,
  Grid,
  FormControl,
  InputLabel,
  Select,
  Paper,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const AddServicePage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    description: "",
    category: "Plomberie",
    serviceType: "",
    service: "",
    date: new Date().toISOString().split("T")[0],
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const categories = [
    "Plomberie",
    "Menagère",
    "Garde d'enfants",
    "Bricolage",
    "Cours Particuliers",
    "Jardinage",
  ];
  const serviceOptions = [
    "Plomberie",
    "Ménage",
    "Garde d'enfants",
    "Bricolage",
    "Cours",
    "Jardinage",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation simple
    if (!formData.description.trim()) {
      setError("La description est obligatoire");
      return;
    }
    if (!formData.serviceType) {
      setError("Veuillez sélectionner un type de service.");
      return;
    }
    if (!formData.service) {
      setError("Veuillez sélectionner un service.");
      return;
    }
    if (!formData.date) {
      setError("Veuillez sélectionner une date.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Vous devez être connecté(e) pour publier un service.");
      return;
    }

    const categoryMap = {
      Plomberie: 1,
      Menagère: 2,
      "Garde d'enfants": 3,
      Bricolage: 4,
      "Cours Particuliers": 5,
      Jardinage: 6,
    };

    const payload = {
      titre: formData.service,
      description: `${formData.description}\nDate : ${formData.date}`,
      statut:
        formData.serviceType === "offered"
          ? "Offered service"
          : "Wanted service",
      category: categoryMap[formData.category] || 1,
    };

    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:8000/api/services", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || data.error || "Erreur lors de la création");
        setIsLoading(false);
        return;
      }

      // succès
      navigate("/services");
    } catch (err) {
      setError("Erreur réseau : " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: "600px",
        margin: "0 auto",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <Typography
        variant="h4"
        sx={{
          marginBottom: "30px",
          color: "#333",
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        Ajouter un service
      </Typography>

      <Paper
        elevation={0}
        sx={{
          padding: "25px",
          borderRadius: "10px",
          backgroundColor: "#f9f9f9",
        }}
      >
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Typography
          variant="h6"
          sx={{
            marginBottom: "10px",
            color: "#333",
            fontWeight: "bold",
          }}
        >
          Description
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={4}
          placeholder="Tapez ici votre description..."
          variant="outlined"
          sx={{
            marginBottom: "25px",
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
              backgroundColor: "white",
            },
          }}
          name="description"
          value={formData.description}
          onChange={handleChange}
        />

        <Typography
          variant="h6"
          sx={{
            marginBottom: "10px",
            color: "#333",
            fontWeight: "bold",
          }}
        >
          Catégorie
        </Typography>
        <FormControl fullWidth sx={{ marginBottom: "25px" }}>
          <InputLabel sx={{ color: "#666" }}>Sélectionnez une catégorie</InputLabel>
          <Select
            name="category"
            value={formData.category}
            onChange={handleChange}
            sx={{
              borderRadius: "8px",
              backgroundColor: "white",
              "& .MuiSelect-select": {
                padding: "12px",
              },
            }}
          >
            {categories.map((category, index) => (
              <MenuItem key={index} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Grid container spacing={2} sx={{ marginBottom: "25px" }}>
          <Grid item xs={12}>
            <Typography
              variant="h6"
              sx={{
                marginBottom: "10px",
                color: "#333",
                fontWeight: "bold",
              }}
            >
              Type de service
            </Typography>
            <FormControl fullWidth>
              <InputLabel>Choisir un type</InputLabel>
              <Select
                name="serviceType"
                value={formData.serviceType}
                onChange={handleChange}
                sx={{
                  borderRadius: "8px",
                  backgroundColor: "white",
                }}
              >
                <MenuItem value="offered">Service offert</MenuItem>
                <MenuItem value="asked">Service demandé</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {formData.serviceType && (
            <Grid item xs={12}>
              <Typography
                variant="h6"
                sx={{
                  marginBottom: "10px",
                  color: "#333",
                  fontWeight: "bold",
                }}
              >
                {formData.serviceType === "offered"
                  ? "Service offert"
                  : "Service demandé"}
              </Typography>
              <FormControl fullWidth>
                <InputLabel>Sélectionner un service</InputLabel>
                <Select
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  sx={{
                    borderRadius: "8px",
                    backgroundColor: "white",
                  }}
                >
                  {serviceOptions.map((option, index) => (
                    <MenuItem key={index} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}
        </Grid>

        <Typography
          variant="h6"
          sx={{
            marginBottom: "10px",
            color: "#333",
            fontWeight: "bold",
          }}
        >
          Date
        </Typography>
        <TextField
          fullWidth
          type="date"
          variant="outlined"
          sx={{
            marginBottom: "30px",
            borderRadius: "8px",
            backgroundColor: "white",
          }}
          name="date"
          value={formData.date}
          onChange={handleChange}
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{ min: new Date().toISOString().split("T")[0] }}
        />

        <Button
          fullWidth
          variant="contained"
          sx={{
            backgroundColor: "#CF6B4D",
            color: "white",
            padding: "12px",
            borderRadius: "8px",
            fontWeight: "bold",
            fontSize: "16px",
            textTransform: "none",
            "&:hover": {
              backgroundColor: "#b85a3f",
            },
          }}
          type="submit"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Publier"}
        </Button>
      </Paper>
    </Box>
  );
};

export default AddServicePage;
