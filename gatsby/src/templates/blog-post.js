import React, { useEffect } from 'react'
import { graphql } from 'gatsby'
import { Helmet } from 'react-helmet'
import styled from 'styled-components'
import MainLayout from '../layout/MainLayout'
import mermaid from 'mermaid'
import { escape2Html } from '../utils'
import { MDXRenderer } from 'gatsby-plugin-mdx'

const ArticleWrap = styled.div`
    padding: 0 1em;
`

const ArticleTitle = styled.h1`
    text-align: center;
    border-bottom: 0;
    padding-bottom: 3rem;
`

const BlogPost = ({ data }) => {
    const post = data.mdx
    useEffect(() => {
        document.querySelectorAll('.mermaid').forEach((element, index) => {
            mermaid.mermaidAPI.render(
                'mermaid' + index,
                escape2Html(element.innerHTML),
                (svgCode) => {
                    element.innerHTML = svgCode
                },
                element
            )
        })
    }, [post.body])
    return (
        <MainLayout>
            <Helmet title={`vv13 - ${post.frontmatter.title}`} />
            <ArticleWrap>
                <ArticleTitle>{post.frontmatter.title}</ArticleTitle>
                <MDXRenderer>{post.body}</MDXRenderer>
            </ArticleWrap>
        </MainLayout>
    )
}

export const pageQuery = graphql`
    query MDXQuery($id: String!) {
        mdx(id: { eq: $id }) {
            id
            body
            frontmatter {
                title
                date(formatString: "YYYY-MM-DD")
                tags
            }
        }
    }
`

export default BlogPost
