import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Heading,
  Text,
} from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const DashboardPage: React.FC = () => {
  const [message, setMessage] = useState('');
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8000/dashboard/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMessage(response.data.message);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        // Handle error, e.g., redirect to login
        logout();
        navigate('/login');
      }
    };
    fetchData();
  }, [navigate, logout]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box px={8} py={10} textAlign="center">
      <Heading mb={8}>Dashboard</Heading>
      <Text fontSize="xl" mb={8}>
        {message}
      </Text>
      <Button onClick={handleLogout}>
        Logout
      </Button>
    </Box>
  );
};

export default DashboardPage;
