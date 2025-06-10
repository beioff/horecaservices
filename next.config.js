/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: process.env.NODE_ENV === 'production' ? '/horecaservices' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/horecaservices/' : '',
}

export default nextConfig 