import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/juegos",
        destination: "/games",
        permanent: true,
      },
      {
        source: "/juegos/:id",
        destination: "/games/:id",
        permanent: true,
      },
      {
        source: "/juegos/:id/jugar",
        destination: "/games/:id/play",
        permanent: true,
      },
      {
        source: "/salon",
        destination: "/hall-of-fame",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
