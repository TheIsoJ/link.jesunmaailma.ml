/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  async redirects() {
    return [
      {
        source: "/:short([A-Za-z0-9_-]{9})",
        destination: `${process.env.NEXT_PUBLIC_API_URL}/:short`,
        permanent: false,
      }
    ]
  }
}

module.exports = nextConfig
