import React from 'react'
import { Link } from 'gatsby'
import styled from "styled-components"

const Header = styled.header`
  display: flex;
  width: 100%;
  height: 5em;
  padding: 0 1em;
  line-height: 5em;
  font-size: 1rem;
  justify-content: space-between;
  a {
    color: #000;
  }
`

export default () => (
  <Header>
    <Link to="/">vv13</Link>
    <Link to="/blog/">博客</Link>
  </Header>
)
