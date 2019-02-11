import React from "react"
import { graphql } from "gatsby"
import MainLayout from '../layout/MainLayout';


export default ({ data }) => (
  <MainLayout>
    没想好
  </MainLayout>
)

export const query = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`
