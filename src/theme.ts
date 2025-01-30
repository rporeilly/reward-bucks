import { mode, StyleFunctionProps } from '@chakra-ui/theme-tools';
import { extendTheme, ThemeConfig } from '@chakra-ui/react';

const styles = {
  global: (props: StyleFunctionProps) => ({
    body: {
      color: mode('gray.800', 'whiteAlpha.900')(props),
      backgroundColor: '#829786',
      backgroundImage: 'url("black-linen.png")'
    },
    h1: {
      color: mode('#004261', 'white')(props)
    },
    '.wrapper': {
      bg: mode('white', '#141214')(props),
    },
    '.chakra-accordion p, .chakra-portal p': {
      fontSize: '11px',
      textAlign: 'left',
      mb: '20px'
    }
  })
};

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

const theme = extendTheme({ config, styles });

export default theme;
