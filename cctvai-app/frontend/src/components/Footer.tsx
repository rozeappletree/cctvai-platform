import { Box, Text } from '@chakra-ui/react';
import React from 'react';

const Footer: React.FC = () => {
  return (
    <Box as="footer" bg="--chakra-colors-black" py={4} px={8} mt={8} textAlign="center">
      <Text color="whiteAlpha.700">
        &copy; {new Date().getFullYear()} CCTVAi Platform. All rights reserved.
      </Text>
    </Box>
  );
};

export default Footer;
