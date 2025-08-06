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
} from '@mui/material';

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
    pieceIdentite: '',
  });

  const [editMode, setEditMode] = useState({});

  const fileInputRef = useRef(null);

  // Récupérer token JWT (adapter si autre stockage)
  const token = localStorage.getItem('jwt_token');

  // Pour récupérer l'id user connecté : 
  // Soit tu stockes l'id dans localStorage/sessionStorage, soit tu as un endpoint '/api/user/me'
  // Ici, exemple d'usage d'/api/user/me pour obtenir les données
  const API_USER_ME_URL = 'http://localhost:8000/api/user/me';

  useEffect(() => {
    if (!token) return;

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
        // Adapter ces champs en fonction de la structure JSON renvoyée par ta route user
        setAccountData({
          nom: data.nom || '',
          prenom: data.prenom || '',
          nomUtilisateur: data.pseudo || '',
          aPropos: data.description || '',
          dateNaissance: data.dateNaissance || '',
          identiteGenre: data.genre || '',
          paysRegion: data.localisation || '',
          langue: data.langue || '',
          email: data.email || '',
          motDePasse: '', // Ne jamais mettre en clair, champ vide par défaut
          pieceIdentite: data.pieceIdentite || '',
        });
      })
      .catch(err => {
        console.error(err);
      });
  }, [token]);

  const handleChange = (name, value) => {
    setAccountData(prev => ({ ...prev, [name]: value }));
  };

  const toggleEdit = (name, value) => {
    setEditMode(prev => ({ ...prev, [name]: value }));
  };

  const handleFileIconClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleChange('pieceIdentite', file.name);
      console.log('Fichier sélectionné:', file.name);
    }
  };

  const handleSaveChanges = () => {
    if (!token) {
      alert("Tu dois être connecté.e pour modifier ton profil.");
      return;
    }

    // On suppose que tu as une route PUT pour mettre à jour l'utilisateur connecté, par ex. /api/user/{id}
    // Si tu ne connais pas l'id, une solution c'est d'avoir un endpoint PUT /api/user/me
    // Pour cet exemple, utilisons PUT /api/user/me

    const API_UPDATE_USER_URL = 'http://localhost:8000/api/user/me';

    // Construction du payload à envoyer (à adapter selon backend)
    // Ne pas oublier que le motDePasse doit être traité séparément côté backend s'il est modifié
    const payload = {
      nom: accountData.nom,
      prenom: accountData.prenom,
      pseudo: accountData.nomUtilisateur,
      description: accountData.aPropos,
      dateNaissance: accountData.dateNaissance,
      genre: accountData.identiteGenre,
      localisation: accountData.paysRegion,
      langue: accountData.langue,
      email: accountData.email,
      // On n'envoie pas motDePasse ici pour éviter de modifier sans changement explicite, ou l'envoyer si modifié
      pieceIdentite: accountData.pieceIdentite,
    };

    fetch(API_UPDATE_USER_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })
      .then(res => {
        if (!res.ok) throw new Error('Erreur lors de la mise à jour');
        alert('Changements enregistrés');
      })
      .catch(err => {
        alert(err.message);
      });
  };

  const EditableInfoRow = ({ label, name, value, type = "text", options = [] }) => {
    const isEditing = editMode[name] === true;

    const onBlurEdit = () => {
      toggleEdit(name, false);
    };

    const onClickRow = () => {
      if (name !== 'pieceIdentite') {
        toggleEdit(name, true);
      }
    };

    if (isEditing) {
      if (options.length > 0) {
        return (
          <Box sx={{ py: 1.5, borderBottom: '1px solid #e0e0e0' }}>
            <FormControl fullWidth variant="standard">
              <InputLabel>{label}</InputLabel>
              <Select
                autoFocus
                value={value}
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
            value={value}
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
          {value || (label === "À propos" ? "Ajoutez une description" : "")}
        </Typography>
        {name === 'pieceIdentite' ? (
          <Box onClick={(e) => { e.stopPropagation(); handleFileIconClick(); }} sx={{ cursor: 'pointer' }}>
            <PaperclipIcon />
          </Box>
        ) : (
          <ChevronIcon isOpen={false} />
        )}
      </Box>
    );
  };

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
          style={{ display: 'none' }}
        />
      </Box>

      <Button
        variant="contained"
        onClick={handleSaveChanges}
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
        Enregistrer les changements
      </Button>
    </Box>
  );
};

export default EditAccountPage;
