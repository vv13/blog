import React from 'react';
import { graphql, Link } from 'gatsby';
import styled from 'styled-components'
import MediaQuery from 'react-responsive';
import MainLayout from '../layout/MainLayout';
import Pagination from '../components/Pagination';
import Helmet from '../components/Helmet'

const ListItemWrap = styled.div`
  display: flex;
  width: 80%;
  margin: 3rem auto 0;
  &:first-of-type {
    margin-top: 0;
  }
  @media(max-width: 900px) {
    flex-direction: column-reverse;
  }
`
const ListItemHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 10rem;
  flex-shrink: 0;
  @media(max-width: 900px) {
    flex-direction: row-reverse;
    justify-content: space-between;
    width: 100%;
  }
`

const ArticleExcerpt = styled.div`
  width: 80%;
  margin: 1rem auto;
`

export default ({ data, pathContext }) => {
  const {
    allMarkdownRemark: { edges, totalCount }
  } = data;
  return (
    <MainLayout>
      <Helmet title="博客" />
      {edges.map(({ node }) => (
        <article>
          <ListItemWrap key={node.fields.slug}>
            <ListItemHeader>
              <div>{node.frontmatter.date}</div>
              <div>{node.frontmatter.tags}</div>
            </ListItemHeader>
            <div>
              <Link to={node.fields.slug}>
                {node.frontmatter.title}
              </Link>
              <MediaQuery query="(min-width: 900px)">
                <p>{node.excerpt}</p>
              </MediaQuery>
            </div>
          </ListItemWrap>
          <MediaQuery query="(max-width: 900px)">
            <ArticleExcerpt>
              <p>{node.excerpt}</p>
            </ArticleExcerpt>
          </MediaQuery>
        </article>
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
