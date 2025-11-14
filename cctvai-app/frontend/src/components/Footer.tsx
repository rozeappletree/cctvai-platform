import { Box, Text } from '@chakra-ui/react';
import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Footer: React.FC = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return null;
  }

  return (
    <Box as="footer" bg="--chakra-colors-black" py={4} px={8} mt={8} textAlign="center">
      <Text color="whiteAlpha.700">
        &copy; {new Date().getFullYear()} CCTV Intelligence Platform. All rights reserved.
      </Text>
    </Box>
  );
};

export default Footer;
