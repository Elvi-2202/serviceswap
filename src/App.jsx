import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import HomePage from './pages/Home';
import FeedbackPage from './pages/Feedback';
import Settings from "./pages/Settings";
import EditProfile from "./pages/EditProfile";
import UserProfile from "./pages/UserProfile";
import Profile from './pages/Profile';
import Login from './pages/LogIn';
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
          {/* Redirige la racine "/" vers "/welcome" */}
          <Route path="/" element={<Navigate to="/welcome" replace />} />
          
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/feedback" element={<FeedbackPage />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/user-profile" element={<UserProfile />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/services" element={<Services />} />
          <Route path="/troc" element={<Troc />} />
          <Route path="/categorie" element={<Categorie />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/add-service" element={<AddService />} />
          <Route path="/edit-service/:id" element={<EditService />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;