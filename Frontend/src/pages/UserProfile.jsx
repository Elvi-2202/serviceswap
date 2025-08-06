import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  useMediaQuery,
} from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Pour la navigation

// Icône de profil utilisateur en SVG inline
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

// Icône de crayon (édition) en SVG inline
const PencilIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-pencil"
    style={{ color: '#777', cursor: 'pointer' }}
  >
    <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
    <path d="m15 5 4 4" />
  </svg>
);

const UserProfilePage = () => {
  const navigate = useNavigate(); // Hook pour la navigation
  const isMobile = useMediaQuery('(max-width:600px)'); // Utilisé dans le JSX

  // État pour les données utilisateur chargées depuis API
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // URL API pour récupérer l'utilisateur connecté (à adapter selon ta route)
  const API_USER_URL = 'http://localhost:8000/api/user/me';

  // Récupérer token JWT depuis le stockage local (adapter si nécessaire)
  const token = localStorage.getItem('jwt_token');

  // Chargement des données utilisateur depuis API au montage
  useEffect(() => {
    fetch(API_USER_URL, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : '',
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Erreur lors du chargement des données utilisateur');
        return res.json();
      })
      .then((data) => {
        // Adapter le mapping des données reçues selon ton API et entité User
        setUserData({
          nom: data.nom || '',
          prenom: data.prenom || '',
          nomUtilisateur: data.pseudo || '', // possible nom de champ différent dans API
          aPropos: data.description || '',
          dateNaissance: data.dateNaissance || '',
          identiteGenre: data.genre || '',
          paysRegion: data.localisation || '',
          langue: data.langue || '',
          email: data.email || '',
          motDePasse: '********', // Ne pas exposer le vrai mot de passe
          pieceIdentite: data.pieceIdentite || '',
        });
        setLoading(false);
      })
      .catch((error) => {
        console.error('Erreur chargement utilisateur :', error);
        // En cas d’erreur, on peut set userData à null et loading à false
        setUserData(null);
        setLoading(false);
      });
  }, [API_USER_URL, token]);

  const handleEditClick = (field) => {
    // Navigation vers page édition avec paramètre facultatif
    navigate('/edit-profile', { state: { fieldToEdit: field } });
  };

  // Affichage ligne info utilisateur
  const InfoRow = ({ label, value }) => (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        py: 1.5,
        borderBottom: '1px solid #e0e0e0',
      }}
    >
      <Typography variant="body1" sx={{ color: '#333', fontWeight: 'normal' }}>
        {label}
      </Typography>
      <Typography variant="body1" sx={{ color: '#777', fontWeight: 'normal' }}>
        {value || ''}
      </Typography>
    </Box>
  );

  if (loading) {
    return <Typography sx={{ p: 3, textAlign: "center" }}>Chargement du profil...</Typography>;
  }

  if (!userData) {
    return <Typography sx={{ p: 3, textAlign: "center", color: 'error.main' }}>Impossible de charger les informations utilisateur.</Typography>;
  }

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3, md: 4 },
        maxWidth: { xs: '100%', sm: 600, md: 700 },
        margin: '0 auto',
        backgroundColor: '#fefbf8',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxSizing: 'border-box',
      }}
    >
      {/* Titre de la page */}
      <Typography variant="h4" sx={{ mb: 3, textAlign: 'center', fontWeight: 'bold', color: '#333' }}>
        Mon Compte
      </Typography>

      {/* Section photo de profil */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mb: 4,
          pt: 4,
          width: '100%',
          backgroundColor: '#fefbf8',
          position: 'relative',
        }}
      >
        <Box
          sx={{
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
          }}
        >
          <UserIcon />
        </Box>
        {/* Crayon d’édition */}
        <Box
          onClick={() => handleEditClick('profile')}
          sx={{
            position: 'absolute',
            top: 'calc(50% - 10px)',
            left: 'calc(50% + 50px)',
            cursor: 'pointer',
            backgroundColor: 'white',
            borderRadius: '50%',
            p: 0.5,
            boxShadow: '0px 2px 5px rgba(0,0,0,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <PencilIcon />
        </Box>
      </Box>

      {/* Boutons Mes Services / Mes Troc avec fullWidth responsive */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          mt: 3,
          gap: 2,
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'stretch', sm: 'center' },
          width: '100%',
          maxWidth: 600,
          px: { xs: 2, sm: 0 },
        }}
      >
        <Button
          variant="outlined"
          startIcon={<Typography>📋</Typography>}
          component={React.forwardRef((props, ref) => <a href="/services" ref={ref} {...props} />)}
          fullWidth={isMobile}
          sx={{ textTransform: 'none' }}
        >
          Mes Services
        </Button>
        <Button
          variant="outlined"
          startIcon={<Typography>🔄</Typography>}
          component={React.forwardRef((props, ref) => <a href="/troc" ref={ref} {...props} />)}
          fullWidth={isMobile}
          sx={{ textTransform: 'none' }}
        >
          Mes Troc
        </Button>
      </Box>

      {/* Section Informations de base */}
      <Box sx={{ width: '100%', mb: 4, px: { xs: 0, sm: 2 } }}>
        <InfoRow label="Nom" value={userData.nom} />
        <InfoRow label="Prénom" value={userData.prenom} />
        <InfoRow label="Nom d'utilisateur" value={userData.nomUtilisateur} />
        <InfoRow label="À propos" value={userData.aPropos} />
      </Box>

      {/* Section Informations personnelles */}
      <Box sx={{ width: '100%', mb: 4, px: { xs: 0, sm: 2 } }}>
        <Typography variant="h6" sx={{ mb: 2, color: '#333', fontWeight: 'bold' }}>
          Informations personnelles
        </Typography>
        <InfoRow label="Date de naissance" value={userData.dateNaissance} />
        <InfoRow label="Identité de genre" value={userData.identiteGenre} />
        <InfoRow label="Pays/Région" value={userData.paysRegion} />
        <InfoRow label="Langue" value={userData.langue} />
        <InfoRow label="E-mail" value={userData.email} />
        <InfoRow label="Mot de passe" value={userData.motDePasse} />
        <InfoRow label="Pièce d'identité" value={userData.pieceIdentite} />
      </Box>
    </Box>
  );
};

export default UserProfilePage;
