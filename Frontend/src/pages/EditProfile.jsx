import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const UserIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="100"
    height="100"
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="currentColor"
    strokeWidth="0"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-user"
  >
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const ChevronIcon = ({ isOpen }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-chevron-right"
    style={{
      transition: 'transform 0.3s ease-in-out',
      transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
      color: '#777',
    }}
  >
    <path d="m9 18 6-6-6-6" />
  </svg>
);

const PaperclipIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-paperclip"
    style={{ color: '#777' }}
  >
    <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
  </svg>
);

const EditAccountPage = () => {
  const navigate = useNavigate();
  const [accountData, setAccountData] = useState({
    nom: '',
    prenom: '',
    nomUtilisateur: '',
    aPropos: '',
    dateNaissance: '',
    identiteGenre: '',
    paysRegion: '',
    langue: '',
    email: '',
    motDePasse: '',
    pieceIdentite: null, // Initialisé à null pour stocker l'objet File
    photoProfil: null,  // Nouveau champ pour la photo de profil
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const photoInputRef = useRef(null);
  const fileInputRef = useRef(null);

  // La bonne URL pour récupérer les données de l'utilisateur
  const API_USER_ME_URL = 'http://localhost:8000/api/user/me';

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      setError("Vous n'êtes pas connecté. Veuillez vous authentifier.");
      return;
    }

    fetch(API_USER_ME_URL, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        if (!res.ok) throw new Error('Erreur récupération données utilisateur');
        return res.json();
      })
      .then(data => {
        setAccountData({
          // Les champs sont mis à jour pour correspondre à la réponse de votre API simplifiée
          // Nous conservons la structure pour les champs qui pourraient être ajoutés plus tard
          nom: data.nom || '',
          prenom: data.prenom || '',
          nomUtilisateur: data.pseudo || '',
          aPropos: data.description || '',
          dateNaissance: data.dateNaissance || '',
          identiteGenre: data.genre || '',
          paysRegion: data.localisation || '',
          langue: data.langue || '',
          email: data.email || '',
          motDePasse: '',
          pieceIdentite: data.pieceIdentite || null,
          photoProfil: data.photoProfil || null,
        });
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError("Erreur lors de la récupération des données. Veuillez réessayer.");
        setLoading(false);
      });
  }, []);

  const handleChange = (name, value) => {
    setAccountData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoClick = () => {
    photoInputRef.current.click();
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleChange('photoProfil', file); // Stocker l'objet File
      console.log('Photo de profil sélectionnée:', file.name);
    }
  };

  const handleFileIconClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      handleChange('pieceIdentite', file); // Stocker l'objet File
      console.log('Fichier PDF sélectionné:', file.name);
    } else {
      alert("Veuillez sélectionner un fichier PDF.");
    }
  };

  const handleSaveChanges = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Tu dois être connecté.e pour modifier ton profil.");
      return;
    }

    setIsSubmitting(true);

    const API_UPDATE_USER_URL = 'http://localhost:8000/api/user/me';

    // Créer un objet FormData pour envoyer les fichiers et les autres données
    const formData = new FormData();
    formData.append('pseudo', accountData.nomUtilisateur);
    formData.append('description', accountData.aPropos);
    formData.append('localisation', accountData.paysRegion);
    formData.append('email', accountData.email);

    // Ajouter les fichiers s'ils ont été modifiés
    if (accountData.photoProfil instanceof File) {
      formData.append('photoProfil', accountData.photoProfil);
    }
    if (accountData.pieceIdentite instanceof File) {
      formData.append('pieceIdentite', accountData.pieceIdentite);
    }
    // Note: Pour les autres champs comme nom, prenom, etc., ils ne sont pas présents
    // dans votre backend simplifié. Je les ai donc retirés du `formData`.
    // Si vous les ajoutez à votre entité User plus tard, vous devrez les ajouter ici.

    fetch(API_UPDATE_USER_URL, {
      method: 'PUT',
      headers: {
        // Ne pas spécifier 'Content-Type': 'application/json' pour les requêtes FormData
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })
      .then(res => {
        if (!res.ok) {
          return res.json().then(errorData => {
            throw new Error(errorData.message || 'Erreur lors de la mise à jour');
          });
        }
        return res.json();
      })
      .then(() => {
        alert('Changements enregistrés avec succès!');
        navigate('/user-profile'); // Redirection vers la page de profil
      })
      .catch(err => {
        alert(err.message);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const EditableInfoRow = ({ label, name, value, type = "text", options = [] }) => {
    const [isEditing, setIsEditing] = useState(false);

    const onBlurEdit = () => {
      setIsEditing(false);
    };

    const onClickRow = () => {
      if (name !== 'pieceIdentite') {
        setIsEditing(true);
      }
    };

    const displayValue = (value instanceof File) ? value.name : value;

    if (isEditing) {
      if (options.length > 0) {
        return (
          <Box sx={{ py: 1.5, borderBottom: '1px solid #e0e0e0' }}>
            <FormControl fullWidth variant="standard">
              <InputLabel>{label}</InputLabel>
              <Select
                autoFocus
                value={displayValue}
                onChange={(e) => handleChange(name, e.target.value)}
                onBlur={onBlurEdit}
                label={label}
                sx={{
                  '& .MuiInputBase-input': { textAlign: 'right', color: '#777', fontWeight: 'normal' },
                }}
              >
                {options.map(option => (
                  <MenuItem key={option.value || option} value={option.value || option}>
                    {option.label || option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        );
      }
      return (
        <Box sx={{ py: 1.5, borderBottom: '1px solid #e0e0e0' }}>
          <TextField
            fullWidth
            autoFocus
            variant="standard"
            type={type}
            value={displayValue}
            onChange={(e) => handleChange(name, e.target.value)}
            onBlur={onBlurEdit}
            InputProps={{
              disableUnderline: true,
              style: { textAlign: 'right', color: '#777', fontWeight: 'normal' },
            }}
          />
        </Box>
      );
    }

    return (
      <Box
        onClick={onClickRow}
        sx={{
          py: 1.5,
          borderBottom: '1px solid #e0e0e0',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          '&:hover': { backgroundColor: '#f5f5f5' }
        }}
      >
        <Typography sx={{ color: '#333', fontWeight: 'normal' }}>{label}</Typography>
        <Typography sx={{ color: '#777', textAlign: 'right', flexGrow: 1, pr: 1 }}>
          {displayValue || (label === "À propos" ? "Ajoutez une description" : "")}
        </Typography>
        {name === 'pieceIdentite' && (
          <Box onClick={(e) => { e.stopPropagation(); handleFileIconClick(); }} sx={{ cursor: 'pointer' }}>
            <PaperclipIcon />
          </Box>
        )}
        {name !== 'pieceIdentite' && <ChevronIcon isOpen={false} />}
      </Box>
    );
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{
      p: { xs: 2, sm: 3, md: 4 },
      maxWidth: { xs: '100%', sm: 600, md: 700 },
      margin: '0 auto',
      backgroundColor: '#fefbf8',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      boxSizing: 'border-box',
    }}>
      <Typography variant="h4" sx={{ mb: 3, textAlign: 'center', fontWeight: 'bold', color: '#333' }}>
        Edit Profile
      </Typography>

      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        mb: 4,
        pt: 4,
        width: '100%',
        backgroundColor: '#fefbf8',
      }}>
        <Box sx={{
          width: 120,
          height: 120,
          borderRadius: '50%',
          backgroundColor: '#333',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          mb: 1.5,
          overflow: 'hidden',
        }}>
          <UserIcon />
        </Box>
        <Button
          variant="text"
          onClick={handlePhotoClick}
          sx={{
            color: '#CF6B4D',
            textTransform: 'none',
            fontWeight: 'bold',
            fontSize: '0.95rem',
          }}
        >
          Changer ma photo de profil
        </Button>
      </Box>
      <input
        type="file"
        ref={photoInputRef}
        onChange={handlePhotoChange}
        accept="image/*"
        style={{ display: 'none' }}
      />

      <Box sx={{ width: '100%', mb: 4, px: { xs: 0, sm: 2 } }}>
        <EditableInfoRow label="Nom" name="nom" value={accountData.nom} />
        <EditableInfoRow label="Prénom" name="prenom" value={accountData.prenom} />
        <EditableInfoRow label="Nom d'utilisateur" name="nomUtilisateur" value={accountData.nomUtilisateur} />
        <EditableInfoRow label="À propos" name="aPropos" value={accountData.aPropos} />
      </Box>

      <Box sx={{ width: '100%', mb: 4, px: { xs: 0, sm: 2 } }}>
        <Typography variant="h6" sx={{ mb: 2, color: '#333', fontWeight: 'bold' }}>
          Informations personnelles
        </Typography>
        <EditableInfoRow label="Date de naissance" name="dateNaissance" value={accountData.dateNaissance} type="date" />
        <EditableInfoRow
          label="Identité de genre"
          name="identiteGenre"
          value={accountData.identiteGenre}
          options={[
            { value: 'Masculin', label: 'Masculin' },
            { value: 'Féminin', label: 'Féminin' }
          ]}
        />
        <EditableInfoRow label="Pays/Région" name="paysRegion" value={accountData.paysRegion} />
        <EditableInfoRow label="Langue" name="langue" value={accountData.langue} />
        <EditableInfoRow label="E-mail" name="email" value={accountData.email} type="email" />
        <EditableInfoRow label="Mot de passe" name="motDePasse" value={accountData.motDePasse} type="password" />
        <EditableInfoRow label="Pièce d'identité" name="pieceIdentite" value={accountData.pieceIdentite} />
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".pdf"
          style={{ display: 'none' }}
        />
      </Box>

      <Button
        variant="contained"
        onClick={handleSaveChanges}
        disabled={isSubmitting}
        sx={{
          backgroundColor: '#CF6B4D',
          '&:hover': { backgroundColor: '#b75a3d' },
          padding: '12px 60px',
          borderRadius: 2,
          fontSize: '1.1rem',
          fontWeight: 'bold',
          textTransform: 'none',
          mt: 4,
          width: { xs: '90%', sm: 'auto' },
          maxWidth: 400,
        }}
      >
        {isSubmitting ? <CircularProgress size={24} /> : 'Enregistrer les changements'}
      </Button>
    </Box>
  );
};

export default EditAccountPage;