import React from 'react';
import styled from 'styled-components';
import site from '../config/site';

const Footer = styled.footer`
  text-align: center;
  color: ${({ theme }) => theme.hint};
  font-size: 12px;
  a {
    color: ${({ theme }) => theme.hint};
  }
`;
export default () => (
  <Footer>
    <p>{site.footerTxt} | <a href="http://www.beian.miit.gov.cn" target="_blank">蜀ICP备17042657号</a></p>
  </Footer>
);
