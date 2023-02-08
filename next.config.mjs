export default {
  experimental: {
    appDir: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.gravatar.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  rewrites: () => {
    return {
      beforeFiles: [
        {
          source: '/blog',
          destination: 'https://usenextbase.feather.blog/blog',
        },
        {
          source: '/blog/:path*',
          destination: 'https://usenextbase.feather.blog/blog/:path*',
        },
        {
          source: '/_feather',
          destination: 'https://usenextbase.feather.blog/_feather',
        },
        {
          source: '/_feather/:path*',
          destination: 'https://usenextbase.feather.blog/_feather/:path*',
        },
      ],
    };
  },
  headers: () => {
    return [
      {
        source: '/blog',
        headers: [
          {
            key: 'X-Forwarded-Host',
            value: 'usenextbase.com',
          },
        ],
      },
      {
        source: '/blog/:slug*',
        headers: [
          {
            key: 'X-Forwarded-Host',
            value: 'usenextbase.com',
          },
        ],
      },
      {
        source: '/_feather',
        headers: [
          {
            key: 'X-Forwarded-Host',
            value: 'usenextbase.com',
          },
        ],
      },

      {
        source: '/_feather/:slug*',
        headers: [
          {
            key: 'X-Forwarded-Host',
            value: 'usenextbase.com',
          },
        ],
      },
    ];
  },
};
