import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_USER_URL = 'http://localhost:8000/api/user/me';

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      setLoading(false);
      setError("Vous n'êtes pas connecté. Veuillez vous authentifier.");
      return;
    }

    fetch(API_USER_URL, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Erreur lors du chargement des données utilisateur');
        }
        return res.json();
      })
      .then((data) => {
        setUserData({
          nom: data.nom || '',
          prenom: data.prenom || '',
          pseudo: data.pseudo || '',
          aPropos: data.description || '',
          dateNaissance: data.dateNaissance || '',
          identiteGenre: data.genre || '',
          paysRegion: data.localisation || '',
          langue: data.langue || '',
          email: data.email || '',
          motDePasse: '********',
          pieceIdentite: data.pieceIdentite || '',
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error('Erreur chargement utilisateur :', err);
        setError("Erreur lors de la récupération des données. Veuillez réessayer.");
        setLoading(false);
      });
  }, [API_USER_URL]);

  const handleEditClick = (field) => {
    navigate('/edit-profile', { state: { fieldToEdit: field } });
  };

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

  if (!userData) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Alert severity="warning">Impossible de charger les informations utilisateur.</Alert>
      </Box>
    );
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
      <Typography variant="h4" sx={{ mb: 3, textAlign: 'center', fontWeight: 'bold', color: '#333' }}>
        Mon Compte
      </Typography>

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
    
      <Box sx={{ width: '100%', mb: 4, px: { xs: 0, sm: 2 } }}>
        <InfoRow label="Nom" value={userData.nom} />
        <InfoRow label="Prénom" value={userData.prenom} />
        <InfoRow label="Nom d'utilisateur" value={userData.pseudo} />
        <InfoRow label="À propos" value={userData.aPropos} />
      </Box>
    
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