import React, { useState } from 'react';
import { 
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Avatar,
  IconButton,
  InputAdornment,
  MenuItem,
  Divider
} from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import EditIcon from '@mui/icons-material/Edit';
import PhotoCamera from '@mui/icons-material/PhotoCamera';

const EditProfile = () => {
  // Données utilisateur (à remplacer par les données réelles après connexion)
  const [user, setUser] = useState({
    profilePhoto: '',
    lastName: 'KUISSU',
    firstName: 'Elvira',
    username: 'Elvira_K',
    bio: '',
    birthDate: '',
    gender: '',
    country: '',
    language: '',
    email: '',
    password: '',
    idPhoto: ''
  });

  const genders = [
    { value: 'male', label: 'Masculin' },
    { value: 'female', label: 'Féminin' },
    { value: 'other', label: 'Autre' }
  ];

  const handleChange = (prop) => (event) => {
    setUser({ ...user, [prop]: event.target.value });
  };

  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser({ ...user, profilePhoto: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Profile updated:', user);
    // Ici vous ajouterez la logique pour sauvegarder les modifications
  };

  return (
    <Container maxWidth="sm" sx={{ py: 3, backgroundColor: '#f8e8e4', minHeight: '100vh' }}>
      {/* En-tête avec bouton retour */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton href="/profil" sx={{ color: '#CF6B4D' }}>
          <ArrowBackIosNewIcon />
        </IconButton>
        <Typography variant="h5" sx={{ flexGrow: 1, textAlign: 'center', color: '#CF6B4D', fontWeight: 'bold' }}>
          Modifier mon compte
        </Typography>
        <Box sx={{ width: 40 }} /> {/* Pour centrer le titre */}
      </Box>

      {/* Photo de profil */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
        <Avatar
          src={user.profilePhoto}
          sx={{ 
            width: 100, 
            height: 100,
            mb: 1,
            backgroundColor: user.profilePhoto ? 'transparent' : '#CF6B4D',
            fontSize: '2.5rem'
          }}
        >
          {!user.profilePhoto && user.firstName.charAt(0)}
        </Avatar>
        <Button
          variant="outlined"
          component="label"
          startIcon={<PhotoCamera />}
          sx={{
            color: '#CF6B4D',
            borderColor: '#CF6B4D',
            '&:hover': {
              borderColor: '#CF6B4D',
              backgroundColor: 'rgba(207, 107, 77, 0.04)'
            }
          }}
        >
          Changer ma photo de profil
          <input type="file" hidden accept="image/*" onChange={handlePhotoUpload} />
        </Button>
      </Box>

      {/* Formulaire */}
      <Box component="form" onSubmit={handleSubmit} sx={{ backgroundColor: 'white', p: 3, borderRadius: 2 }}>
        {/* Section Identité */}
        <TextField
          fullWidth
          label="Nom"
          value={user.lastName}
          onChange={handleChange('lastName')}
          margin="normal"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <EditIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          fullWidth
          label="Prénom"
          value={user.firstName}
          onChange={handleChange('firstName')}
          margin="normal"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <EditIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          fullWidth
          label="Nom d'utilisateur"
          value={user.username}
          onChange={handleChange('username')}
          margin="normal"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <EditIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          fullWidth
          label="A propos"
          placeholder="Ajoutez une description"
          value={user.bio}
          onChange={handleChange('bio')}
          margin="normal"
          multiline
          rows={2}
        />

        <Divider sx={{ my: 3 }} />

        {/* Section Informations personnelles */}
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
          Informations personnelles
        </Typography>
        
        <TextField
          fullWidth
          label="Date de naissance"
          type="date"
          value={user.birthDate}
          onChange={handleChange('birthDate')}
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          select
          fullWidth
          label="Identité de genre"
          value={user.gender}
          onChange={handleChange('gender')}
          margin="normal"
        >
          {genders.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          fullWidth
          label="Pays/Région"
          value={user.country}
          onChange={handleChange('country')}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Langue"
          value={user.language}
          onChange={handleChange('language')}
          margin="normal"
        />
        <TextField
          fullWidth
          label="E-mail"
          type="email"
          value={user.email}
          onChange={handleChange('email')}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Mot de passe"
          type="password"
          value={user.password}
          onChange={handleChange('password')}
          margin="normal"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <EditIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
        <Button
          fullWidth
          variant="contained"
          component="label"
          sx={{
            mt: 2,
            backgroundColor: '#CF6B4D',
            color: 'white',
            '&:hover': {
              backgroundColor: '#b3593f'
            }
          }}
        >
          Pièce d'identité
          <input type="file" hidden accept="image/*,application/pdf" />
        </Button>

        {/* Bouton de sauvegarde */}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{
            mt: 4,
            py: 1.5,
            backgroundColor: '#CF6B4D',
            color: 'white',
            fontWeight: 'bold',
            '&:hover': {
              backgroundColor: '#b3593f'
            }
          }}
        >
          Enregistrer les changements
        </Button>
      </Box>
    </Container>
  );
};

export default EditProfile;