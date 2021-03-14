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
    i {
      margin-left: 5px;
    }
  }
`;

export default ({ dark }) => (
  <Header dark={dark}>
    <Link to="/">vv13</Link>
    <section>
      <Link to="/blog/">博客</Link>
      <a target="_blank" href="https://github.com/vv13">
        Github
        <i className="iconfont icon-link"></i>
      </a>
    </section>
  </Header>
);
