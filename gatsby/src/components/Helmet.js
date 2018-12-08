import React from 'react';
import { Helmet } from 'react-helmet';
import config from '../config/site';

export default ({ title, noSuffix }) => {
  return (
    <Helmet>
      <title>{`${title}${!noSuffix ? config.titleSuffix : ''}`}</title>
      <link rel="stylesheet" href=""/>
      <link rel="icon" type="image/png" href="/favicon-32.ico" sizes="32x32"></link>
    </Helmet>
  );
};
