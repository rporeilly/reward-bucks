import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import App from '../App';
import theme from '../theme';
import { BrowserRouter } from 'react-router-dom';

// Mock firebase if needed
jest.mock('../firebase', () => ({
  db: {},
  // Add your firebase mocks here
}));

describe('App Component', () => {
  const renderApp = () => {
    return render(
      <BrowserRouter>
        <ChakraProvider theme={theme}>
          <App />
        </ChakraProvider>
      </BrowserRouter>
    );
  };

  test('renders without crashing', () => {
    renderApp();
  });

  test('displays the header', () => {
    renderApp();
    expect(screen.getByRole('heading', { name: /Target Bucks™/i })).toBeInTheDocument();
  });
});
