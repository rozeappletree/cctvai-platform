import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Heading,
  Flex,
  useColorModeValue,
  Text,
} from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const DashboardPage: React.FC = () => {
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const boxBgColor = useColorModeValue('white', 'gray.700');

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
        navigate('/login');
      }
    };
    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <Flex minHeight="100vh" width="full" align="center" justifyContent="center" bg={bgColor}>
      <Box
        borderWidth={1}
        px={8}
        py={10}
        borderRadius="lg"
        boxShadow="lg"
        bg={boxBgColor}
        w={{ base: '90%', sm: '600px' }}
        textAlign="center"
      >
        <Heading mb={8}>Dashboard</Heading>
        <Text fontSize="xl" mb={8}>
          {message}
        </Text>
        <Button colorScheme="teal" onClick={handleLogout}>
          Logout
        </Button>
      </Box>
    </Flex>
  );
};

export default DashboardPage;
