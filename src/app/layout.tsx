import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import Script from "next/script";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Providers } from "@/components/layout/Providers";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { siteConfig } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [
    "software development company",
    "custom software",
    "website development",
    "web application development",
    "mobile app development",
    "ERP solutions",
    "AI automation",
    "Next.js",
    "UI/UX design",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    url: "/",
    locale: "en_US",
    images: [
      {
        url: `${siteConfig.url}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} — ${siteConfig.tagline}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: [`${siteConfig.url}/opengraph-image`],
  },
  verification: {
    google: "21zn54EIJ7gDbuMd_vEdCJFqZOe_lKgAtaX_lx8g4HE",
    other: {
      "msvalidate.01": process.env.NEXT_PUBLIC_BING_VERIFICATION || "F6B8CD5E3B89E5031DEE5507E7BC8528",
      "geo.region": "IN-TN",
      "geo.placename": "Coimbatore",
      "geo.position": "11.0168;76.9558",
      "ICBM": "11.0168, 76.9558",
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", type: "image/png" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

const rootSchemaGraph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteConfig.url}/#organization`,
      name: siteConfig.name,
      legalName: siteConfig.name,
      alternateName: ["IKASLE", "IKASLE Tech", "IKASLE Technologies Coimbatore"],
      url: siteConfig.url,
      logo: {
        "@type": "ImageObject",
        "@id": `${siteConfig.url}/#logo`,
        url: `${siteConfig.url}/icon.svg`,
        caption: siteConfig.name,
      },
      image: { "@id": `${siteConfig.url}/#logo` },
      description: siteConfig.description,
      email: siteConfig.contact.email || "business@ikasle.in",
      telephone: siteConfig.contact.phone || "+917845132962",
      address: {
        "@type": "PostalAddress",
        streetAddress: "1639/A, 2nd Floor, Hopes, Peelamedu",
        addressLocality: "Coimbatore",
        addressRegion: "Tamil Nadu",
        postalCode: "641004",
        addressCountry: "IN",
      },
      contactPoint: [
        {
          "@type": "ContactPoint",
          telephone: siteConfig.contact.phone || "+917845132962",
          contactType: "customer service",
          email: siteConfig.contact.email || "business@ikasle.in",
          areaServed: ["IN", "GB", "AE", "US", "CA", "AU", "NZ", "SA"],
          availableLanguage: ["English", "Tamil"],
        },
      ],
      sameAs: [siteConfig.social.linkedin, siteConfig.social.github].filter(Boolean),
    },
    {
      "@type": "ProfessionalService",
      "@id": `${siteConfig.url}/#localbusiness`,
      name: siteConfig.name,
      url: siteConfig.url,
      logo: `${siteConfig.url}/icon.svg`,
      image: `${siteConfig.url}/opengraph-image`,
      description:
        "Software development company in Coimbatore, India. Engineering custom software, web and mobile applications, ERP platforms, and AI automation.",
      telephone: siteConfig.contact.phone || "+917845132962",
      email: siteConfig.contact.email || "business@ikasle.in",
      priceRange: "$$",
      address: {
        "@type": "PostalAddress",
        streetAddress: "1639/A, 2nd Floor, Hopes, Peelamedu",
        addressLocality: "Coimbatore",
        addressRegion: "Tamil Nadu",
        postalCode: "641004",
        addressCountry: "IN",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 11.0168,
        longitude: 76.9558,
      },
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          opens: "09:00",
          closes: "18:00",
        },
      ],
      areaServed: [
        { "@type": "City", name: "Coimbatore" },
        { "@type": "State", name: "Tamil Nadu" },
        { "@type": "Country", name: "India" },
        { "@type": "Country", name: "United Kingdom" },
        { "@type": "Country", name: "United Arab Emirates" },
      ],
      parentOrganization: { "@id": `${siteConfig.url}/#organization` },
    },
    {
      "@type": "WebSite",
      "@id": `${siteConfig.url}/#website`,
      url: siteConfig.url,
      name: siteConfig.name,
      description: siteConfig.description,
      publisher: { "@id": `${siteConfig.url}/#organization` },
      inLanguage: "en-US",
    },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    // suppressHydrationWarning: browser extensions (e.g. ones that set data-qb-installed) add attributes to
    // <html> before React hydrates. This only silences attribute mismatches on this one element, not its children.
    // data-scroll-behavior: lets Next switch off the smooth scrolling in globals.css during route changes. Without it,
    // its reset to the top animates, gets stuck on a lower section, and new pages open part-way down.
    <html lang="en" data-scroll-behavior="smooth" className={`${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
      <body>
        {/* Google Tag Manager (GTM-NPDMNWC5). beforeInteractive injects these into <head> so the tag loads early. */}
        <Script id="gtm-init" strategy="beforeInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());`}
        </Script>
        <Script id="gtm-loader" src="https://www.googletagmanager.com/gtm.js?id=GTM-NPDMNWC5" strategy="beforeInteractive" />
        <GoogleAnalytics />
        <div id="top" aria-hidden="true" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(rootSchemaGraph).replace(/</g, "\\u003c") }}
        />
        <a
          href="#main"
          className="sr-only z-[100] rounded-full bg-ink px-4 py-2 text-sm text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Skip to content
        </a>
        <Providers>
          <Header />
          <main id="main" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
