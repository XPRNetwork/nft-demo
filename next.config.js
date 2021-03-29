module.exports = {
  images: {
    domains: ['cloudflare-ipfs.com'],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      issuer: {
        test: /\.(js|ts)x?$/,
      },
      use: ['@svgr/webpack', 'url-loader'],
    });

    return config;
  },
};
