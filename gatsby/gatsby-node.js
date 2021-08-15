const path = require("path");
const { createFilePath } = require(`gatsby-source-filesystem`);
const blogListTemplate = path.resolve("src/templates/blog-list.js");
const blogPostTemplate = path.resolve("src/templates/blog-post.js");

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions;
  if (node.internal.type === "Mdx") {
    const value = createFilePath({ node, getNode });
    createNodeField({
      name: "slugpath",
      node,
      value: `/blog/post${value}`,
    });
  }
};

exports.createPages = async function ({ actions, graphql }) {
  const { data } = await graphql(`
    query {
      allMdx {
        pageInfo {
          totalCount
        }
        nodes {
          id
          fields {
            slugpath
          }
        }
      }
    }
  `);
  const totalCount = data.allMdx.pageInfo.totalCount;

  const postsPerPage = 10;
  const numPages = Math.ceil(totalCount / postsPerPage);
  Array.from({ length: numPages }).forEach((_, i) => {
    actions.createPage({
      path: i === 0 ? `/blog` : `/blog/${i + 1}`,
      component: blogListTemplate,
      context: {
        limit: postsPerPage,
        skip: i * postsPerPage,
      },
    });
  });

  data.allMdx.nodes.forEach((node) => {
    const slugpath = node.fields.slugpath;
    actions.createPage({
      path: slugpath,
      component: blogPostTemplate,
      context: {
        id: node.id,
      },
    });
  });
};
