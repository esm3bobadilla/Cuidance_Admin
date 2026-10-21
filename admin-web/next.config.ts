import path from 'node:path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Repo root, so Admin Web can import shared/ (design tokens live outside admin-web/)
  turbopack: {
    root: path.join(__dirname, '..'),
  },
};

export default nextConfig;
