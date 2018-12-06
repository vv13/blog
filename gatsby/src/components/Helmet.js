import React from 'react';
import { Helmet } from 'react-helmet';
import config from '../config/site';

export default ({ title, noSuffix }) => {
  return (
    <Helmet>
      <title>{`${title}${!noSuffix ? config.titleSuffix : ''}`}</title>
    </Helmet>
  );
};
