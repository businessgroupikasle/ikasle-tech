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
  // Canonical 301 redirects: standardizes URLs, eliminates duplicate content, and preserves link equity.
  async redirects() {
    return [
      { source: "/home", destination: "/", permanent: true },
      { source: "/about-us", destination: "/about", permanent: true },
      { source: "/contact-us", destination: "/contact", permanent: true },
      { source: "/clients", destination: "/clientele", permanent: true },
      { source: "/portfolio", destination: "/clientele", permanent: true },
      { source: "/privacy", destination: "/privacy-policy", permanent: true },
      { source: "/terms", destination: "/terms-and-conditions", permanent: true },
      { source: "/services/custom-software", destination: "/services/custom-software-development", permanent: true },
      { source: "/services/website", destination: "/services/website-development", permanent: true },
      { source: "/services/web-apps", destination: "/services/web-application-development", permanent: true },
      { source: "/services/mobile", destination: "/services/mobile-app-development", permanent: true },
      { source: "/services/erp", destination: "/services/erp-business-automation", permanent: true },
      { source: "/services/ai", destination: "/services/ai-intelligent-solutions", permanent: true },
      { source: "/services/ui-ux", destination: "/services/ui-ux-product-design", permanent: true },
    ];
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
        ],
      },
    ];
  },
};

export default nextConfig;
