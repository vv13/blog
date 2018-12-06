import React from "react"
import { graphql } from "gatsby"


export default ({ data }) => (
  <div style={{ color: `teal` }}>
    <h1>About {data.site.siteMetadata.title}</h1>
    <p>Hello, I'm vv13, a Front End Develop.</p>
  </div>
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
