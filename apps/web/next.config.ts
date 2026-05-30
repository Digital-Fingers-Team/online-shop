import type { NextConfig } from "next";
const nextConfig: NextConfig = { transpilePackages: ["@marketplace/types", "@marketplace/utils"] };
export default nextConfig;
