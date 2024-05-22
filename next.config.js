/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    RPC_ENDPOINT: process.env.RPC_ENDPOINT,
    SECRET: process.env.SECRET,
    REACT_APP_PINATA_API_KEY: process.env.REACT_APP_PINATA_API_KEY,
    REACT_APP_PINATA_API_SECRET: process.env.REACT_APP_PINATA_API_SECRET
  },
  images: {
    domains: ['arweave.net', 'gateway.pinata.cloud']
  },
  headers: [
    {
      sources: "/api/(.*)",
      headers: [
        {
          key: "Access-Control-Allow-Origin",
          value: "*"
        }
      ]
    }
  ]
}

module.exports = nextConfig
