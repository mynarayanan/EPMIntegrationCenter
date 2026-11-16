import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@integration-centre/shared-types'],
};

export default nextConfig;
