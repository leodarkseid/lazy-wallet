// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   output: "export",
// };

// export default nextConfig;


/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    return config;
  },
};

export default nextConfig;