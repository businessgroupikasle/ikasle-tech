import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Dev only: lets phones and tablets on the office network load the dev server's scripts. Without this the page
  // opens at the network address but never starts, so the menu is dead and animated sections stay invisible.
  allowedDevOrigins: ["192.168.*.*"],
  images: {
    // AVIF where supported (noticeably smaller photos), WebP otherwise.
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
    // Policy for `next upgrade --agent` and the upgrade reminders shown by `next dev` / `next build`.
    agentUpgrade: "security",
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          // Browsers ignore HSTS on plain-HTTP localhost, so this only takes effect on the HTTPS site.
          { key: "Strict-Transport-Security", value: "max-age=31536000" },
          // Deliberately minimal CSP: these directives can't break scripts, styles or analytics. A full
          // script/style policy needs nonces and testing with GA and the animation libraries first.
          { key: "Content-Security-Policy", value: "frame-ancestors 'self'; base-uri 'self'; form-action 'self'; object-src 'none'" },
        ],
      },
    ];
  },
};

export default nextConfig;
