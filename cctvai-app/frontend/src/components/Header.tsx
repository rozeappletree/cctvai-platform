import { Box, Flex, Heading } from '@chakra-ui/react';
import React from 'react';

const Header: React.FC = () => {
  return (
    <Box as="header" bg="black" py={4} px={8} boxShadow="md">
      <Flex align="center" justify="space-between">
        <Heading as="h1" size="lg" color="purple.300">
          CCTV Intelligence
        </Heading>
      </Flex>
    </Box>
  );
};

export default Header;
