import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box, Container, Flex } from '@chakra-ui/react';
import LoginPage from './components/LoginPage';
import DashboardPage from './components/DashboardPage';
import Header from './components/Header';
import Footer from './components/Footer';
import { useAuth } from './contexts/AuthContext';

const App: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <Flex direction="column" minHeight="100vh">
        <Header />
        <Box as="main" flex="1" py={8}>
          <Container maxW="container.md">
            <Routes>
              <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" />} />
              <Route
                path="/dashboard"
                element={isAuthenticated ? <DashboardPage /> : <Navigate to="/login" />}
              />
              <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
          </Container>
        </Box>
        <Footer />
      </Flex>
    </Router>
  );
};

export default App;
