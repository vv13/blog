import React from "react";
import { Link } from "gatsby";
import styled from "styled-components";

const Header = styled.header`
  display: flex;
  width: 100%;
  height: 5em;
  padding: 0 1em;
  line-height: 5em;
  font-size: 1rem;
  justify-content: space-between;
  a {
    color: ${(props) => (props.dark ? "#fff" : "#000")};
    text-decoration: none;
  }
  section > a {
    margin-left: 2em;
  }
`;

export default ({ dark }) => (
  <Header dark={dark}>
    <Link to="/">vv13</Link>
    <section>
      <Link to="/blog/">博客</Link>
      <Link to="/about-me/">关于我</Link>
    </section>
  </Header>
);
