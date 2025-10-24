import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config, { isServer }) => {
    // This is to prevent a build error from yahoo-finance2.
    // The library includes test files that are not meant to be used in a Next.js application.
    // This plugin will ignore the problematic test files during the build process.
    config.plugins.push(
      new (require('webpack').IgnorePlugin)({
        resourceRegExp: /yahoo-finance2\/esm\/tests/,
      })
    );
    return config;
  },
};

export default nextConfig;
