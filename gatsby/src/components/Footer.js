import React from 'react';
import styled from 'styled-components';
import site from '../config/site';

const Footer = styled.footer`
  text-align: center;
  color: ${({ theme }) => theme.hint};
  font-size: 12px;
`;
export default () => (
  <Footer>
    <p>{site.footerTxt}</p>
  </Footer>
);
