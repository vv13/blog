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

const ListItemWrap = styled.div`
  display: flex;
  width: 80%;
  margin: 3rem auto 0;
  &:first-of-type {
    margin-top: 0;
  }
`
const ListItemHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 10rem;
  flex-shrink: 0;
`
const ListItemBody = styled.div`

`

export default ({ data, pathContext }) => {
  const {
    allMarkdownRemark: { edges, totalCount }
  } = data;
  return (
    <MainLayout>
      <Helmet title="博客" />
      {edges.map(({ node }) => (
        <ListItemWrap key={node.fields.slug}>
          <ListItemHeader>
            <div>{node.frontmatter.date}</div>
            <div>{node.frontmatter.tags}</div>
          </ListItemHeader>
          <ListItemBody>
            <Link to={node.fields.slug}>
              {node.frontmatter.title}
            </Link>
            <p>{node.excerpt}</p>
          </ListItemBody>
        </ListItemWrap>
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
          excerpt(pruneLength: 140)
        }
      }
    }
  }
`;
