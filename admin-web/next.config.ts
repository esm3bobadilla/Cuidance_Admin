import path from 'node:path';
import type { NextConfig } from 'next';

// GitHub Pages serves the site from /Cuidance_Admin. Local dev stays at the root.
const basePath = process.env.GITHUB_PAGES === 'true' ? '/Cuidance_Admin' : '';

const nextConfig: NextConfig = {
  // Repo root, so Admin Web can import shared/ (design tokens live outside admin-web/)
  turbopack: {
    root: path.join(__dirname, '..'),
  },
  // Static export for GitHub Pages
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  basePath,
  assetPrefix: basePath,
  // Lets plain <a href> links add the base path (Next only does this for next/link)
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
