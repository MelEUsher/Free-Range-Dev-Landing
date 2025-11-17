/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  // Disable Turbopack for compatibility
  // experimental: {
  //   turbo: false,
  // },
  
  compress: true,
  
  // Security headers
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline'", // Allow inline for React hydration
              "style-src 'self' 'unsafe-inline'", // Allow inline styles
              "img-src 'self' data:",
              "font-src 'self' data:",
              "connect-src 'self'",
              "frame-src https://www.youtube.com https://www.tiktok.com",
            ].join("; "),
          },
        ],
      },
    ];
  },

  // Domain redirects handled in _redirects file for Netlify
  async redirects() {
    return [];
  },
};

export default nextConfig;