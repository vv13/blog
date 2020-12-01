import React from "react";
import { graphql } from "gatsby";
import MainLayout from "../layout/MainLayout";
import styled from "styled-components";

const NothingTalk = styled.div`
  text-align: center;
  width: 100%;
`;

export default ({ data }) => (
  <MainLayout>
    <p>
      如果您喜欢我的博客，可以点此 <a href="/rss.xml">链接</a> 进行订阅。
    </p>
    <h2>作品相关</h2>
    <ul>
      <li>
        <a href="https://github.com/vv13" target="_blank">
          Github
        </a>
        <a href="https://www.npmjs.com/~zwhvv13" target="_blank">
          npm Packages
        </a>
      </li>
    </ul>
    <h2>联系方式</h2>
    <p>您可以通过邮箱与我联系：zwhvv13@gmail.com。</p>
  </MainLayout>
);

export const query = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`;
