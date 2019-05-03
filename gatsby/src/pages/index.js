import React from 'react';
import styled from 'styled-components';
import site from '../config/site';
import Helmet from '../components/Helmet';
import MainLayout from '../layout/MainLayout';

const Banner = styled.img`
  max-width: 100%;
`;

const Links = styled.ul`
  display: flex;
  justify-content: center;
  align-items: center;
  list-style: none;

  & > li {
    width: 50px;
  }

  .iconfont {
    color: #000;
    font-size: 1.5rem;
  }
`;

const links = [
  {
    icon: 'github',
    link: 'https://github.com/vv13'
  },
  {
    icon: 'juejin',
    link: 'https://juejin.im/user/59b23a016fb9a0248d2513d6'
  },
  {
    icon: 'codepen',
    link: 'https://codepen.io/vv13/'
  },
  {
    icon: 'segmentfault',
    link: 'https://segmentfault.com/u/vv13'
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
          <li key={link.icon}>
            <a href={link.link}>
              <i className={`iconfont icon-${link.icon}`} />
            </a>
          </li>
        ))}
      </Links>
    </IndexMain>
  </MainLayout>
);
