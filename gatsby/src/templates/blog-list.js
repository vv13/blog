import React from 'react';
import { graphql, Link } from 'gatsby';
import styled from 'styled-components'
import MainLayout from '../layout/MainLayout';
import Pagination from '../components/Pagination';
import Helmet from '../components/Helmet'

const Title = styled.h3`
  font-size: 1rem;
  a {
    color: ${({theme}) => theme.strong}
  }
`

export default ({ data, pathContext }) => {
  const {
    allMarkdownRemark: { edges, totalCount }
  } = data;
  return (
    <MainLayout>
      <Helmet title="博客" />
      {edges.map(({ node }) => (
        <div key={node.fields.slug}>
          <Title>
            <Link to={node.fields.slug}>{node.frontmatter.title}</Link>
          </Title>
          <p>
            {node.frontmatter.date} {node.frontmatter.tags}
          </p>
        </div>
      ))}
      <Pagination totalCount={totalCount} {...pathContext} />
    </MainLayout>
  );
};
export const blogListQuery = graphql`
  query blogListQuery($skip: Int!, $limit: Int!) {
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      limit: $limit
      skip: $skip
    ) {
      totalCount
      edges {
        node {
          id
          fields {
            slug
          }
          frontmatter {
            title
            date(formatString: "YYYY-MM-DD")
            tags
          }
        }
      }
    }
  }
`;
