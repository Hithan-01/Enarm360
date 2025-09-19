import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MantineProvider, createTheme, ColorSchemeScript, MantineColorSchemeManager, localStorageColorSchemeManager } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import LandingPage from './pages/LandingPage';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './pages/AdminDashboard';
import EstudianteDashboard from './pages/EstudianteDashboard';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import RegisterPage from './pages/RegisterPage';
// Páginas del módulo estudiantil
import SimuladorPage from './pages/SimuladorPage';
import FlashcardsPage from './pages/FlashcardsPage';
import EstadisticasPage from './pages/EstadisticasPage';
import RankingsPage from './pages/RankingsPage';
import CrearPreguntasPage from './pages/CrearPreguntasPage';
// Páginas del módulo de administración
import ClinicalCasesPage from './pages/admin/ClinicalCasesPage';
import QuestionReviewsPage from './pages/admin/QuestionReviewsPage';
import UserStatisticsPage from './pages/admin/UserStatisticsPage';
import SubscriptionsPage from './pages/admin/SubscriptionsPage';
import QuestionDatabasePage from './pages/admin/QuestionDatabasePage';
import UserPermissionsPage from './pages/admin/UserPermissionsPage';
import ResultadosPage from './pages/ResultadosPage';

//Páginas de examen
import ExamenPage from './pages/ExamenPage';

import './App.css';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import './styles/mantine-custom.css';

// Importar servicios para configurar interceptors globales
import './services';

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
              
              {/* Ruta de registro */}
              <Route path="/register" element={<RegisterPage />} />
              
              {/* Dashboard de administrador - solo accesible por admins */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute requiredRole="ADMIN">
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Casos Clínicos - solo accesible por admins */}
              <Route
                path="/admin/clinical-cases"
                element={
                  <ProtectedRoute requiredRole="ADMIN">
                    <ClinicalCasesPage />
                  </ProtectedRoute>
                }
              />

              {/* Revisión de Preguntas - solo accesible por admins */}
              <Route
                path="/admin/question-reviews"
                element={
                  <ProtectedRoute requiredRole="ADMIN">
                    <QuestionReviewsPage />
                  </ProtectedRoute>
                }
              />

              {/* Estadísticas de Usuario - solo accesible por admins */}
              <Route
                path="/admin/statistics"
                element={
                  <ProtectedRoute requiredRole="ADMIN">
                    <UserStatisticsPage />
                  </ProtectedRoute>
                }
              />

              {/* Suscripciones y Finanzas - solo accesible por admins */}
              <Route
                path="/admin/subscriptions"
                element={
                  <ProtectedRoute requiredRole="ADMIN">
                    <SubscriptionsPage />
                  </ProtectedRoute>
                }
              />

              {/* Base de Datos de Preguntas - solo accesible por admins */}
              <Route
                path="/admin/question-database"
                element={
                  <ProtectedRoute requiredRole="ADMIN">
                    <QuestionDatabasePage />
                  </ProtectedRoute>
                }
              />

              {/* Permisos de Usuario - solo accesible por admins */}
              <Route
                path="/admin/permissions"
                element={
                  <ProtectedRoute requiredRole="ADMIN">
                    <UserPermissionsPage />
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

              {/* Módulo de Simulador - solo accesible por estudiantes */}
              <Route
                path="/estudiante/simulador"
                element={
                  <ProtectedRoute requiredRole="ESTUDIANTE">
                    <SimuladorPage />
                  </ProtectedRoute>
                }
              />

              {/* Página de examen - solo accesible por estudiantes */}
              <Route
                path="/examen/:id"
                element={
                  <ProtectedRoute requiredRole="ESTUDIANTE">
                    <ExamenPage />
                  </ProtectedRoute>
                }
              />
              {/* Página de resultados del examen - solo accesible por estudiantes */}
              <Route path="/examenes/:intentoId/resultado" element={<ResultadosPage />} />


              {/* Módulo de Flashcards - solo accesible por estudiantes */}
              <Route
                path="/estudiante/flashcards"
                element={
                  <ProtectedRoute requiredRole="ESTUDIANTE">
                    <FlashcardsPage />
                  </ProtectedRoute>
                }
              />

              {/* Módulo de Estadísticas - solo accesible por estudiantes */}
              <Route
                path="/estudiante/estadisticas"
                element={
                  <ProtectedRoute requiredRole="ESTUDIANTE">
                    <EstadisticasPage />
                  </ProtectedRoute>
                }
              />

              {/* Módulo de Rankings - solo accesible por estudiantes */}
              <Route
                path="/estudiante/rankings"
                element={
                  <ProtectedRoute requiredRole="ESTUDIANTE">
                    <RankingsPage />
                  </ProtectedRoute>
                }
              />

              {/* Módulo de Crear Preguntas - solo accesible por estudiantes con permisos */}
              <Route
                path="/estudiante/preguntas"
                element={
                  <ProtectedRoute requiredRole="ESTUDIANTE">
                    <CrearPreguntasPage />
                  </ProtectedRoute>
                }
              />

              {/* Página de configuración - accesible por usuarios autenticados */}
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <SettingsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings/:section"
                element={
                  <ProtectedRoute>
                    <SettingsPage />
                  </ProtectedRoute>
                }
              />

              {/* Redirigir /profile a /settings para compatibilidad */}
              <Route path="/profile" element={<Navigate to="/settings" replace />} />
              
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
