/**
 * @type {import('next').NextConfig}
 */

const securityHeaders = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
];

const nextConfig = {
  // Disable Turbopack (fixes Tailwind/PostCSS/LightningCSS issues)
  experimental: {
    turbo: false,
  },

  compress: true,

  // Keep your existing security headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;