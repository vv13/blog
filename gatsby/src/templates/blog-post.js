import React, { useEffect } from "react";
import { graphql } from "gatsby";
import { Helmet } from "react-helmet";
import styled from "styled-components";
import MainLayout from "../layout/MainLayout";
import mermaid from "mermaid";
import { escape2Html } from "../utils";

const ArticleWrap = styled.div`
  padding: 0 1em;
`;

const ArticleTitle = styled.h1`
  text-align: center;
  border-bottom: 0;
  padding-bottom: 3rem;
`;

export default ({ data }) => {
  const post = data.markdownRemark;
  useEffect(() => {
    document.querySelectorAll(".mermaid").forEach((element, index) => {
      mermaid.mermaidAPI.render(
        "mermaid" + index,
        escape2Html(element.innerHTML),
        (svgCode) => {
          element.innerHTML = svgCode;
        },
        element
      );
    });
  }, [post.html]);
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
