

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
        { 
            protocol: 'https',
            hostname: "oss-cdn.deniffer.com",
            pathname: "**"
         },
         {
            protocol: 'https',
            hostname: "ai-virtual-character-deniffer.s3.ap-southeast-1.amazonaws.com",
            pathname: "**"
         }
        ]
    },
};

export default nextConfig;
