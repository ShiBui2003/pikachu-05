/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
    tsconfigPath: './tsconfig.json',
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    typedRoutes: true,
  },
}

export default nextConfig
