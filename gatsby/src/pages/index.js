import React from 'react';
import styled from 'styled-components';
import site from '../config/site';
import Helmet from '../components/Helmet';
import MainLayout from '../layout/MainLayout';


const IndexMain = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

export default () => (
  <MainLayout>
    <Helmet title={site.title} noSuffix />
    <IndexMain>
      <Banner src="http://qn.vv13.cn/18-9-12/24175809.jpg" />
    </IndexMain>
  </MainLayout>
);

const Banner = styled.img`
  max-width: 100%;
`;

