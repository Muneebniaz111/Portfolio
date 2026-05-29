/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        // ESLint errors won't block production builds
        ignoreDuringBuilds: true,
    },
    typescript: {
        // If there are any remaining TS edge cases, they won't block the build
        // Remove this line once all type errors are fully resolved
        ignoreBuildErrors: false,
    },
};

export default nextConfig;
