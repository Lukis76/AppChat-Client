/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  images: {

    domains: ['lh3.googleusercontent.com', 'thumbs.dreamstime.com', "toppng.com", "banner2.cleanpng.com", "avatars0.githubusercontent.com"],
  }
}

module.exports = nextConfig
