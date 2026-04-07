/** @type {import('next').NextConfig} */
const isGithubPagesBuild = process.env.GITHUB_ACTIONS === 'true'

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    NEXT_PUBLIC_BASE_PATH: isGithubPagesBuild ? '/blog' : '',
  },
  ...(isGithubPagesBuild
    ? {
        basePath: '/blog',
        assetPrefix: '/blog/',
      }
    : {}),
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig
