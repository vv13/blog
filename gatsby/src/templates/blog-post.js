import React from 'react';
import { graphql } from 'gatsby';
import { Helmet } from 'react-helmet';
import styled from 'styled-components'
import MainLayout from '../layout/MainLayout';

const ArticleWrap = styled.div`
  padding: 0 4em;
`
export default ({ data }) => {
  const post = data.markdownRemark;
  return (
    <MainLayout>
      <Helmet title={`vv13 - ${post.frontmatter.title}`} />
      <ArticleWrap>
        <h1>{post.frontmatter.title}</h1>
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
