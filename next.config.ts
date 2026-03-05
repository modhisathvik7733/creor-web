import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Removed output: "export" — need server rendering for dynamic routes (share/[id])
};

export default nextConfig;
