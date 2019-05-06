import React from 'react';
import styled from 'styled-components';
import MediaQuery from 'react-responsive';
import site from '../config/site';
import Helmet from '../components/Helmet';
import MainLayout from '../layout/MainLayout';

const links = [
  {
    icon: 'github',
    info: 'Github',
    link: 'https://github.com/vv13'
  },
  {
    icon: 'juejin',
    info: '掘金',
    link: 'https://juejin.im/user/59b23a016fb9a0248d2513d6'
  },
  {
    icon: 'codepen',
    info: 'CodePen',
    link: 'https://codepen.io/vv13/'
  },
  {
    icon: 'segmentfault',
    info: '思否',
    link: 'https://segmentfault.com/u/vv13'
  },
  {
    icon: 'instagram',
    info: 'Instagram',
    link: 'https://www.instagram.com/zwhvv13'
  }
];

const IndexMain = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

export default () => (
  <MainLayout>
    <Helmet title={site.title} noSuffix />
    <IndexMain>
      <Banner src="http://qn.vv13.cn/18-9-12/24175809.jpg" />
      <Links>
        {links.map(link => (
          <Li key={link.icon}>
            <a href={link.link}>
              <i className={`iconfont icon-${link.icon}`} />
            </a>
            <MediaQuery query="(min-width: 900px)">
              <IconText>{link.info}</IconText>
            </MediaQuery>
          </Li>
        ))}
      </Links>
    </IndexMain>
  </MainLayout>
);

const Li = styled.li`
  width: 50px;
  position: relative;
  text-align: center;
`;

const IconText = styled.span`
  position: absolute;
  bottom: -20px;
  left: -20px;
  right: -20px;
  text-align: center;
  margin: auto;
  opacity: 0;
  white-space: nowrap;
  transition: opacity 0.5s linear;
  ${Li}:hover & {
    opacity: 1;
  }
`;

const Banner = styled.img`
  max-width: 100%;
`;

const Links = styled.ul`
  display: flex;
  justify-content: center;
  align-items: center;
  list-style: none;

  .iconfont {
    color: #000;
    font-size: 1.5rem;
  }
`;
