import { extendTheme, ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  fonts: {
    heading: `'Inter', sans-serif`,
    body: `'Inter', sans-serif`,
  },
  styles: {
    global: {
      'html, body': {
        background: 'black',
        color: 'whiteAlpha.900',
      },
    },
  },
  components: {
    Box: {
        baseStyle: {
            background: 'gray.800',
            borderRadius: 'md',
            boxShadow: 'md',
        }
    },
    Button: {
      baseStyle: {
        fontWeight: 'bold',
      },
      variants: {
        solid: {
          bg: 'purple.500',
          color: 'white',
          _hover: {
            bg: 'purple.600',
          },
        },
        outline: {
            borderColor: 'purple.500',
            color: 'purple.500',
            _hover: {
                bg: 'purple.500',
                color: 'white',
            }
        }
      },
      defaultProps: {
        variant: 'solid',
      },
    },
    Input: {
        defaultProps: {
            focusBorderColor: 'purple.500',
        }
    },
    Heading: {
        baseStyle: {
            color: 'whiteAlpha.900',
        }
    },
    FormLabel: {
        baseStyle: {
            color: 'whiteAlpha.800',
        }
    },
    Text: {
        baseStyle: {
            color: 'whiteAlpha.900',
        }
    }
  },
});

export default theme;
