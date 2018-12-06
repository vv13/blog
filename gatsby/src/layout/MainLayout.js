import React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import Header from '../components/Header';
import Footer from '../components/Footer';
import theme from '../config/theme';

const Container = styled.div`
  margin: 0 auto;
  max-width: 1200px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

export default ({ children }) => (
  <ThemeProvider theme={theme}>
    <Container>
      <Header />
      {children}
      <Footer />
    </Container>
  </ThemeProvider>
);
