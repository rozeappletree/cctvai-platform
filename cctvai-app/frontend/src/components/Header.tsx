import { Box, Flex, Heading } from '@chakra-ui/react';
import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Header: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Box as="header" bg="black" py={4} px={8} boxShadow="md">
      <Flex align="center" justify="space-between">
        {!isAuthenticated && (
          <Heading as="h1" size="lg" color="purple.300">
            Intelligent Surveillance Platform
          </Heading>
        )}
      </Flex>
    </Box>
  );
};

export default Header;
