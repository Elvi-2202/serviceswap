import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';

import HomePage from './pages/Home';
import FeedbackPage from './pages/Feedback';
import Settings from "./pages/Settings";
import EditProfile from "./pages/EditProfile";
import UserProfile from "./pages/UserProfile";
import Profile from './pages/Profile';
import Login from './pages/LogIn';  // Si nom fichier LogIn
import Welcome from './pages/welcome';
import Services from './pages/Services';
import Troc from './pages/Troc';
import Notifications from './pages/Notifications';
import AddService from './pages/AddService';
import EditService from './pages/EditService';
import Categorie from './pages/Categorie';


const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Redirection racine vers welcome */}
          <Route path="/" element={<Navigate to="/welcome" replace />} />

          {/* Pages publiques et principales */}
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          {/* <Route path="/signup" element={<SignUp />} /> */}

          {/* Pages nécessitant authentification */}
          <Route path="/home" element={<HomePage />} />
          <Route path="/feedback" element={<FeedbackPage />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          
          {/* Si besoin, route paramétrée pour profil utilisateur */}
          <Route path="/user-profile" element={<UserProfile />} />
          {/* Exemple avec paramètre si tu souhaites : */}
          {/* <Route path="/user-profile/:userId" element={<UserProfile />} /> */}

          <Route path="/profile" element={<Profile />} />

          {/* Services */}
          <Route path="/services" element={<Services />} />
          <Route path="/add-service" element={<AddService />} />
          <Route path="/edit-service/:id" element={<EditService />} />

          {/* Catégorie */}
          <Route path="/categorie" element={<Categorie />} />

          {/* Troc */}
          <Route path="/troc" element={<Troc />} />

          {/* Notifications */}
          <Route path="/notifications" element={<Notifications />} />

          {/* Route 404 si page non trouvée */}
          <Route path="*" element={<Navigate to="/welcome" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
