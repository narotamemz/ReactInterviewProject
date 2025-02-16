/** @type {import('next').NextConfig} */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { i18n } = require('./next-i18next.config');

module.exports = {
  publicRuntimeConfig: {
      BASE_URL: process.env.NEXTAUTH_URL
  },
  reactStrictMode: true,
  images: {
    domains: [
      'tailwindui.com',
      'images.unsplash.com',
      'source.unsplash.com',
      'placeimg.com',
    ],
  },
  i18n,
};
