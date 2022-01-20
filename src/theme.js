import { mode } from '@chakra-ui/theme-tools';
import { extendTheme } from '@chakra-ui/react';

const styles = {
  global: props => ({
    body: {
      color: mode('gray.800', 'whiteAlpha.900')(props),
      bg: '#e9e9e9'
    },
    h1: {
      color: mode('#004261', 'white')(props)
    },
    ".wrapper": {
      bg: mode('white', '#141214')(props),
    },
    ".chakra-accordion p, .chakra-portal p": {
      fontSize: '11px',
      textAlign: 'left',
      mb: '20px'
    }
  }),
};

const Button = {
  // The styles all button have in common
  baseStyle: {

  },

  // Two sizes: sm and md
  sizes: {
    sm: {
      fontSize: "sm",
      px: 4, // <-- px is short for paddingLeft and paddingRight
      py: 3, // <-- py is short for paddingTop and paddingBottom
    },
    md: {
      fontSize: "md",
      px: 6, // <-- these values are tokens from the design system
      py: 4, // <-- these values are tokens from the design system
    },
  },
  // Two variants: outline and solid
  variants: {
    outline: {
      // borderColor: "#004261",
      // color: "white",
      // bg: "#004261",
    },
    solid: {
    },
  },
  // The default size and variant values
  defaultProps: {
  },
}

const theme = extendTheme({
  styles,
  components: {
    Button,
  },
});

export default theme;
