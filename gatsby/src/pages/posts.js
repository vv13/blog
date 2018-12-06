import React from 'react';
import { Link, graphql } from 'gatsby';
import { Helmet } from 'react-helmet';

import MainLayout from '../layout/MainLayout';

export default ({ data }) => {
  return (
    <MainLayout>
      <Helmet>
        <title>博客文章页</title>
      </Helmet>
      <h1>Amazing Pandas Eating Things</h1>
      <h4>{data.allMarkdownRemark.totalCount} Posts</h4>
      {data.allMarkdownRemark.edges.map(({ node }) => (
        <div key={node.id}>
          <Link to={node.fields.slug}>
            <h3>
              {node.frontmatter.title} <span>— {node.frontmatter.date}</span>
            </h3>
          </Link>
          <p>{node.excerpt}</p>
        </div>
      ))}
    </MainLayout>
  );
};

export const query = graphql`
  query {
    allMarkdownRemark(
      limit: 10
      skip: 0
      sort: { fields: [frontmatter___date], order: DESC }
    ) {
      totalCount
      pageInfo {
        hasNextPage
      }
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            title
            date(formatString: "YYYY-MM-DD")
            tags
          }
          excerpt(pruneLength: 100)
        }
      }
    }
  }
`;
