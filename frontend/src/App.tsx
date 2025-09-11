import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MantineProvider, createTheme, ColorSchemeScript, MantineColorSchemeManager, localStorageColorSchemeManager } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import LandingPage from './pages/LandingPage';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './pages/AdminDashboard';
import EstudianteDashboard from './pages/EstudianteDashboard';
import './App.css';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import './styles/mantine-custom.css';

const theme = createTheme({
  primaryColor: 'blue',
  colors: {
    'medical-blue': [
      '#f0f9ff',
      '#e0f2fe', 
      '#bae6fd',
      '#7dd3fc',
      '#38bdf8',
      '#0ea5e9',
      '#0284c7',
      '#0369a1',
      '#075985',
      '#0c4a6e'
    ],
    'medical-green': [
      '#f0fdf4',
      '#dcfce7',
      '#bbf7d0', 
      '#86efac',
      '#4ade80',
      '#22c55e',
      '#16a34a',
      '#15803d',
      '#166534',
      '#14532d'
    ]
  },
  fontFamily: 'Inter, sans-serif',
  headings: { fontFamily: 'Inter, sans-serif' },
  radius: {
    md: '12px',
    lg: '16px',
    xl: '24px'
  }
});

const colorSchemeManager = localStorageColorSchemeManager({
  key: 'enarm360-color-scheme',
});

function App() {

  return (
    <>
      <ColorSchemeScript defaultColorScheme="light" />
      <MantineProvider theme={theme} colorSchemeManager={colorSchemeManager} defaultColorScheme="light">
        <Notifications position="top-right" />
        <Router>
          <div className="App">
            <Routes>
              {/* Ruta raíz - Landing Page pública */}
              <Route path="/" element={<LandingPage />} />
              
              {/* Ruta de login */}
              <Route path="/login" element={<Login />} />
              
              {/* Dashboard de administrador - solo accesible por admins */}
              <Route 
                path="/admin/dashboard" 
                element={
                  <ProtectedRoute requiredRole="ADMIN">
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              
              {/* Dashboard de estudiante - solo accesible por estudiantes */}
              <Route 
                path="/estudiante/dashboard" 
                element={
                  <ProtectedRoute requiredRole="ESTUDIANTE">
                    <EstudianteDashboard />
                  </ProtectedRoute>
                } 
              />
              
              {/* Ruta por defecto - redirige a home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
      </MantineProvider>
    </>
  );
}

export default App;
