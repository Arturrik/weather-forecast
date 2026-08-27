/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(glsl|frag|vert)$/,
      type: "asset/source",
    });
    return config;
  },
};

export default nextConfig;
