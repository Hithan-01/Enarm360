import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Box, useMantineColorScheme } from '@mantine/core';
import Sidebar from './Sidebar';
import TopHeader from './TopHeader';
import { authService } from '../services/authService';
import { profileService } from '../services/profileService';
import { UsuarioProfile } from '../types/profile';
import PageTransition from './animations/PageTransition';

const Layout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { colorScheme } = useMantineColorScheme();
  const [user] = useState(authService.getCurrentUserFromStorage());
  const [profile, setProfile] = useState<UsuarioProfile | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Load user profile on mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profileData = await profileService.getMyProfile();
        setProfile(profileData);
      } catch (error) {
        console.error('Error loading profile:', error);
        // Si no se puede cargar el perfil, continuar sin él
      }
    };

    if (authService.isAuthenticated()) {
      loadProfile();
    }
  }, []);

  // Auto-collapse sidebar ONLY when in settings page
  useEffect(() => {
    if (location.pathname.startsWith('/settings')) {
      setSidebarCollapsed(true);
    } else {
      setSidebarCollapsed(false);
    }
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate('/login');
    } catch (error) {
      console.error('Error en logout:', error);
      navigate('/login');
    }
  };

  return (
    <Box
      style={{
        minHeight: '100vh',
        background: colorScheme === 'dark'
          ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
          : 'linear-gradient(135deg, #f7f3ee 0%, #f2ede6 100%)',
        display: 'flex',
      }}
    >
      {/* Sidebar */}
      <Sidebar
        user={{
          username: user?.username || '',
          email: user?.email || '',
          roles: user?.roles || [],
          nombre: profile?.nombre || user?.nombre,
          apellidos: profile?.apellido || user?.apellidos,
          avatar: profile?.avatar
        }}
        onLogout={handleLogout}
        onCollapseChange={setSidebarCollapsed}
        initialCollapsed={sidebarCollapsed}
      />

      {/* Right Side Container */}
      <Box
        style={{
          marginLeft: sidebarCollapsed ? '60px' : '220px',
          flex: 1,
          transition: 'margin-left 0.3s ease',
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
        }}
      >
        {/* Top Header */}
        <TopHeader
          user={{
            username: user?.username || '',
            email: user?.email || '',
            roles: user?.roles || [],
            nombre: user?.nombre,
            apellidos: user?.apellidos,
          }}
          onLogout={handleLogout}
          sidebarWidth={0}
        />

        {/* Main Content */}
        <Box
          style={{
            flex: 1,
            overflow: 'hidden',
            overflowY: 'auto',
          }}
        >
          <PageTransition type="medical" duration={800}>
            <Outlet />
          </PageTransition>
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;