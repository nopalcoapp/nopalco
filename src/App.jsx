
    import React, { useEffect } from 'react';
    import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
    import { AnimatePresence } from 'framer-motion';
    import Layout from '@/components/Layout.jsx';
    import SplashScreen from '@/pages/SplashScreen.jsx';
    import HomeScreen from '@/pages/HomeScreen.jsx';
    import AgendaScreen from '@/pages/AgendaScreen.jsx';
    import ProfileScreen from '@/pages/ProfileScreen.jsx';
    import LoginScreen from '@/pages/LoginScreen.jsx';
    import ArtistProfileScreen from '@/pages/ArtistProfileScreen.jsx';
    import PublicArtistProfileViewer from '@/pages/PublicArtistProfileViewer.jsx';
    import BookingCalendarScreen from '@/pages/BookingCalendarScreen.jsx';
    import ArtistSearchScreen from '@/pages/ArtistSearchScreen.jsx';
    import FinancialsScreen from '@/pages/FinancialsScreen.jsx';
    import ContractorFinancialsScreen from '@/pages/ContractorFinancialsScreen.jsx';
    import BookingRequestsScreen from '@/pages/BookingRequestsScreen.jsx';
    import NotificationsScreen from '@/pages/NotificationsScreen.jsx';
    import ChatScreen from '@/pages/ChatScreen.jsx';
    import TermsAndContractsScreen from '@/pages/TermsAndContractsScreen.jsx';
    import useLocalStorage from '@/hooks/useLocalStorage.jsx';
    import { Toaster } from '@/components/ui/toaster.jsx';
    import NotificationBell from '@/components/NotificationBell.jsx';

    function ProtectedRoute({ children }) {
      const [user] = useLocalStorage('no-palco-user', null);
      if (!user) {
        return <Navigate to="/login" replace />;
      }
      return children;
    }
    
    function ArtistRoute({ children }) {
      const [user] = useLocalStorage('no-palco-user', null);
      if (!user) {
        return <Navigate to="/login" replace />;
      }
      if (user.type !== 'Artista') {
         return <Navigate to="/home" replace />;
      }
      return children;
    }

    function ContractorRoute({ children }) {
      const [user] = useLocalStorage('no-palco-user', null);
      if (!user) {
        return <Navigate to="/login" replace />;
      }
      if (user.type !== 'Contratante') {
         return <Navigate to="/home" replace />;
      }
      return children;
    }


    function App() {
      const [theme] = useLocalStorage('no-palco-theme', 'dark');

      useEffect(() => {
        if (theme === 'light') {
          document.documentElement.classList.remove('dark');
        } else {
          document.documentElement.classList.add('dark');
        }
      }, [theme]);

      return (
        <Router>
          <Toaster />
          <NotificationBell />
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/splash" element={<SplashScreen />} />
              <Route path="/login" element={<LoginScreen />} />
              <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                <Route index element={<Navigate to="/home" replace />} />
                <Route path="home" element={<HomeScreen />} />
                <Route path="agenda" element={<AgendaScreen />} />
                <Route path="perfil" element={<ProfileScreen />} />
                <Route path="artista/:artistId" element={<ArtistProfileScreen />} />
                <Route path="meu-perfil-publico" element={<ArtistRoute><PublicArtistProfileViewer /></ArtistRoute>} />
                <Route path="buscar-artistas" element={<ContractorRoute><ArtistSearchScreen /></ContractorRoute>} />
                <Route path="reservar/:artistId" element={<ContractorRoute><BookingCalendarScreen /></ContractorRoute>} />
                <Route path="financas" element={<ArtistRoute><FinancialsScreen /></ArtistRoute>} />
                <Route path="financas-contratante" element={<ContractorRoute><ContractorFinancialsScreen /></ContractorRoute>} />
                <Route path="solicitacoes" element={<ArtistRoute><BookingRequestsScreen /></ArtistRoute>} /> 
                <Route path="notificacoes" element={<NotificationsScreen />} />
                <Route path="mensagens/:conversationId?" element={<ChatScreen />} /> 
                <Route path="termos-e-contratos" element={<TermsAndContractsScreen />} />
              </Route>
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </AnimatePresence>
        </Router>
      );
    }

    export default App;
  