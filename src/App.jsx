import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import HomePage from './pages/Home';
import FeedbackPage from './pages/Feedback';
import Settings from "./pages/Settings";
import EditProfile from "./pages/EditProfile";
import UserProfile from "./pages/UserProfile";
import Profile from './pages/Profile';


const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/feedback" element={<FeedbackPage />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/user-profile" element={<UserProfile />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;