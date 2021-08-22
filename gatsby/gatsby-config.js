const path = require("path");

module.exports = {
  plugins: [
    "gatsby-plugin-sharp",
    "gatsby-plugin-image",
    `gatsby-remark-images`,
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: `posts`,
        path: path.resolve(__dirname, "../md"),
      },
    },
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        extensions: [`.mdx`, `.md`],
        gatsbyRemarkPlugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 1000,
              quality: 100,
              backgroundColor: `transparent`,
            },
          },
        ],
      },
    },
    {
      resolve: `gatsby-plugin-typography`,
      options: {
        pathToConfigModule: `src/utils/typography.js`,
      },
    },
  ],
};
