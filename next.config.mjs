/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ["js", "jsx", "ts", "tsx", "mdx"],
  transpilePackages: ["@boxyhq/saml-jackson"],
  images: {
    minimumCacheTTL: 2592000, // 30 days
    remotePatterns: prepareRemotePatterns(),
  },
  skipTrailingSlashRedirect: true,
  assetPrefix:
    process.env.NODE_ENV === "production" &&
    process.env.VERCEL_ENV === "production"
      ? process.env.NEXT_PUBLIC_BASE_URL
      : undefined,
  async redirects() {
    return [
      {
        source: "/",
        destination: "/dashboard",
        permanent: false,
        has: [
          {
            type: "host",
            value: process.env.NEXT_PUBLIC_APP_BASE_HOST || "(?<host>.*)",
          },
        ],
      },
      {
        source: "/settings",
        destination: "/settings/general",
        permanent: false,
      },
    ];
  },
  async headers() {
    const isDev = process.env.NODE_ENV === "development";

    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Referrer-Policy",
            value: "no-referrer-when-downgrade",
          },
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "Report-To",
            value: JSON.stringify({
              group: "csp-endpoint",
              max_age: 10886400,
              endpoints: [{ url: "/api/csp-report" }],
            }),
          },
          {
            key: "Content-Security-Policy-Report-Only",
            value:
              `default-src 'self' https: ${isDev ? "http:" : ""}; ` +
              `script-src 'self' 'unsafe-inline' 'unsafe-eval' https: ${isDev ? "http:" : ""}; ` +
              `style-src 'self' 'unsafe-inline' https: ${isDev ? "http:" : ""}; ` +
              `img-src 'self' data: blob: https: ${isDev ? "http:" : ""}; ` +
              `font-src 'self' data: https: ${isDev ? "http:" : ""}; ` +
              `frame-ancestors 'none'; ` +
              `connect-src 'self' https: ${isDev ? "http: ws: wss:" : ""}; ` + 
              `${isDev ? "" : "upgrade-insecure-requests;"} ` +
              "report-to csp-endpoint;",
          },
        ],
      },
      {
        source: "/view/:path*",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex",
          },
        ],
      },
      {
        source: "/login",
        has: [
          {
            type: "query",
            key: "next",
          },
        ],
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow",
          },
        ],
      },
      {
        source: "/view/:path*/embed",
        headers: [
          {
            key: "Content-Security-Policy",
            value:
              `default-src 'self' https: ${isDev ? "http:" : ""}; ` +
              `script-src 'self' 'unsafe-inline' 'unsafe-eval' https: ${isDev ? "http:" : ""}; ` +
              `style-src 'self' 'unsafe-inline' https: ${isDev ? "http:" : ""}; ` +
              `img-src 'self' data: blob: https: ${isDev ? "http:" : ""}; ` +
              `font-src 'self' data: https: ${isDev ? "http:" : ""}; ` +
              "frame-ancestors *; " + 
              `connect-src 'self' https: ${isDev ? "http: ws: wss:" : ""}; ` + 
              `${isDev ? "" : "upgrade-insecure-requests;"}`,
          },
          {
            key: "X-Robots-Tag",
            value: "noindex",
          },
        ],
      },
      {
        source: "/services/:path*",
        has: [
          {
            type: "host",
            value: process.env.NEXT_PUBLIC_WEBHOOK_BASE_HOST || "(?<host>.*)",
          },
        ],
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex",
          },
        ],
      },
      {
        source: "/api/webhooks/services/:path*",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex",
          },
        ],
      },
      {
        source: "/unsubscribe",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex",
          },
        ],
      },
    ];
  },
  experimental: {
    outputFileTracingIncludes: {
      "/api/mupdf/*": ["./node_modules/mupdf/dist/*.wasm"],
      "/api/auth/saml/token": [
        "./node_modules/jose/**/*",
        "./node_modules/openid-client/**/*",
      ],
      "/api/auth/saml/userinfo": [
        "./node_modules/jose/**/*",
        "./node_modules/openid-client/**/*",
      ],
    },
    missingSuspenseWithCSRBailout: false,
    // THE SURGERY: Force Next.js to ignore these incompatible Node packages on the Edge
    serverComponentsExternalPackages: ['@trigger.dev/core', '@trigger.dev/sdk', 'require-in-the-middle'],
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@google-cloud/kms": false,
      "@google-cloud/secret-manager": false,
      mongodb: false,
      mysql: false,
      "react-native-sqlite-storage": false,
      aws4: false,
      "@sap/hana-client": false,
      "@sap/hana-client/extension/Stream": false,
      "hdb-pool": false,
    };

    config.module = {
      ...config.module,
      exprContextCritical: false,
    };

    return config;
  },
};

function prepareRemotePatterns() {
  let patterns = [
    { protocol: "https", hostname: "assets.papermark.io" },
    { protocol: "https", hostname: "cdn.papermarkassets.com" },
    { protocol: "https", hostname: "d2kgph70pw5d9n.cloudfront.net" },
    { protocol: "https", hostname: "pbs.twimg.com" },
    { protocol: "https", hostname: "media.licdn.com" },
    { protocol: "https", hostname: "lh3.googleusercontent.com" },
    { protocol: "https", hostname: "www.papermark.io" },
    { protocol: "https", hostname: "app.papermark.io" },
    { protocol: "https", hostname: "www.papermark.com" },
    { protocol: "https", hostname: "app.papermark.com" },
    { protocol: "https", hostname: "faisalman.github.io" },
    { protocol: "https", hostname: "d36r2enbzam0iu.cloudfront.net" },
    { protocol: "https", hostname: "d35vw2hoyyl88.cloudfront.net" },
  ];

  if (process.env.NEXT_PRIVATE_UPLOAD_DISTRIBUTION_HOST) {
    patterns.push({
      protocol: "https",
      hostname: process.env.NEXT_PRIVATE_UPLOAD_DISTRIBUTION_HOST,
    });
  }

  if (process.env.NEXT_PRIVATE_ADVANCED_UPLOAD_DISTRIBUTION_HOST) {
    patterns.push({
      protocol: "https",
      hostname: process.env.NEXT_PRIVATE_ADVANCED_UPLOAD_DISTRIBUTION_HOST,
    });
  }

  if (process.env.NEXT_PRIVATE_UPLOAD_DISTRIBUTION_HOST_US) {
    patterns.push({
      protocol: "https",
      hostname: process.env.NEXT_PRIVATE_UPLOAD_DISTRIBUTION_HOST_US,
    });
  }

  if (process.env.NEXT_PRIVATE_ADVANCED_UPLOAD_DISTRIBUTION_HOST_US) {
    patterns.push({
      protocol: "https",
      hostname: process.env.NEXT_PRIVATE_ADVANCED_UPLOAD_DISTRIBUTION_HOST_US,
    });
  }

  if (process.env.VERCEL_ENV === "production") {
    patterns.push({
      protocol: "https",
      hostname: "yoywvlh29jppecbh.public.blob.vercel-storage.com",
    });
  }

  if (
    process.env.VERCEL_ENV === "preview" ||
    process.env.NODE_ENV === "development"
  ) {
    patterns.push({
      protocol: "https",
      hostname: "36so9a8uzykxknsu.public.blob.vercel-storage.com",
    });
  }

  return patterns;
}

export default nextConfig;
