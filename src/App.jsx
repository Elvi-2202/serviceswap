import React from 'react';
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
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;