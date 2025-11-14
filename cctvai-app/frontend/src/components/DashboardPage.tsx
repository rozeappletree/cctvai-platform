import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Heading,
  Text,
  Input, // Added Input
  VStack, // Added VStack for layout
  Alert, // Added Alert for messages
  AlertIcon, // Added AlertIcon for messages
} from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const DashboardPage: React.FC = () => {
  const [message, setMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // State for selected file
  const [uploadError, setUploadError] = useState<string | null>(null); // State for upload errors
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null); // State for upload success
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
        // Removed logout and navigate('/login') from here as per request
        // The user wants to see the upload section after login, even if dashboard data fetch fails.
        setUploadError('Failed to load dashboard data. Please try again.');
      }
    };
    fetchData();
  }, [navigate, logout]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
      setUploadError(null); // Clear previous errors
      setUploadSuccess(null); // Clear previous success messages
    }
  };

  const handleUploadConfig = async () => {
    if (!selectedFile) {
      setUploadError('Please select an XML file to upload.');
      return;
    }

    setUploadError(null);
    setUploadSuccess(null);

    const formData = new FormData();
    formData.append('config_file', selectedFile);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:8000/validate-config', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.valid) {
        setUploadSuccess('Configuration file validated successfully!');
        navigate('/admin'); // Redirect to admin panel on success
      } else {
        setUploadError(response.data.message || 'Invalid configuration file.');
      }
    } catch (error) {
      console.error('Failed to upload or validate config file:', error);
      setUploadError('Failed to upload or validate config file. Please check the file and try again.');
    }
  };

  return (
    <Box px={8} py={10} textAlign="center">
      <Heading mb={8}>Dashboard</Heading>
      <Text fontSize="xl" mb={8}>
        {message}
      </Text>

      <VStack spacing={4} mt={8} maxW="md" mx="auto">
        <Heading size="md">Load Configuration</Heading>
        <Input
          type="file"
          accept=".xml"
          onChange={handleFileChange}
          p={1}
          border="1px"
          borderColor="gray.200"
          borderRadius="md"
        />
        <Button onClick={handleUploadConfig} isDisabled={!selectedFile}>
          Load config
        </Button>

        {uploadError && (
          <Alert status="error">
            <AlertIcon />
            {uploadError}
          </Alert>
        )}

        {uploadSuccess && (
          <Alert status="success">
            <AlertIcon />
            {uploadSuccess}
          </Alert>
        )}
      </VStack>

      <Button onClick={handleLogout} mt={8}>
        Logout
      </Button>
    </Box>
  );
};

export default DashboardPage;
