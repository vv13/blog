import React from "react";
import Head from 'next/head';
import config from "../config/site";

export const HelmetComp: React.FC<{ title: string; noSuffix?: boolean }> = ({ title, noSuffix }) => {
  return (
    <Head>
      <title>{`${title}${!noSuffix ? config.titleSuffix : ""}`}</title>
      <link
        rel="icon"
        type="image/png"
        href={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/favicon-32.ico`}
        sizes="32x32"
      ></link>
    </Head>
  );
};

export default HelmetComp;
