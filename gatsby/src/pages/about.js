import React from 'react';
import { graphql } from 'gatsby';
import MainLayout from '../layout/MainLayout';
import styled from 'styled-components';

const NothingTalk = styled.div`
  text-align: center;
  width: 100%;
`;

export default ({ data }) => (
  <MainLayout>
    <NothingTalk>
      <p>zwhvv13@gmail.com</p>
    </NothingTalk>
  </MainLayout>
);

export const query = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`;
