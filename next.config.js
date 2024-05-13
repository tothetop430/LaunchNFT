/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    RPC_ENDPOINT: process.env.RPC_ENDPOINT,
  },
  images: {
    domains: ['arweave.net']
  }
}

module.exports = nextConfig
