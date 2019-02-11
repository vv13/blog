import React from 'react';
import { graphql } from 'gatsby';
import { Helmet } from 'react-helmet';
import styled from 'styled-components'
import MainLayout from '../layout/MainLayout';

const ArticleWrap = styled.div`
  padding: 0 4em;
`

const ArticleTitle = styled.h1`
    text-align: center;
    border-bottom: 0;
    padding-bottom: 3rem;
`
export default ({ data }) => {
  const post = data.markdownRemark;
  return (
    <MainLayout>
      <Helmet title={`vv13 - ${post.frontmatter.title}`} />
      <ArticleWrap>
        <ArticleTitle>{post.frontmatter.title}</ArticleTitle>
        <div dangerouslySetInnerHTML={{ __html: post.html }} />
      </ArticleWrap>
    </MainLayout>
  );
};

export const query = graphql`
  query($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
        date(formatString: "YYYY-MM-DD")
        tags
      }
    }
  }
`;
