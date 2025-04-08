import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export',
  assetPrefix: './',
  transpilePackages: ["antd", "@ant-design", "rc-util", "rc-pagination", "rc-picker", "rc-notification", "rc-tooltip", "rc-tree", "rc-table"],
};

export default nextConfig;
