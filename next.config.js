/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    RPC_ENDPOINT: process.env.RPC_ENDPOINT,
    SECRET: process.env.SECRET,
  },
  images: {
    domains: ['arweave.net']
  }
}

module.exports = nextConfig
