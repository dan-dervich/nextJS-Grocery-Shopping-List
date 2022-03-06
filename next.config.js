//  @type {import('next').NextConfig} 
const nextConfig = {
  reactStrictMode: true,
  env: {
    JWT_SECRET: 'b42b6c8fd1334cb68341228ed0138801',
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig
