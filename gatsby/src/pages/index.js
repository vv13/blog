import React from 'react';
import styled from 'styled-components';
import banner from '../assets/banner.jpg'
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
      <Banner src={banner} />
    </IndexMain>
  </MainLayout>
);

const Banner = styled.img`
  max-width: 100%;
`;

